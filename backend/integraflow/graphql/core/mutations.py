from enum import Enum
from itertools import chain
from typing import (
    Any,
    Collection,
    Dict,
    Iterable,
    List,
    Optional,
    Tuple,
    Type,
    TypeVar,
    Union,
    overload,
)

import graphene
from django.core.exceptions import (
    NON_FIELD_ERRORS,
    ImproperlyConfigured,
    ValidationError,
)
from django.db.models import Model, Q, QuerySet
from django.db.models.fields.files import FileField
from graphene import ObjectType
from graphene.types.mutation import MutationOptions
from graphql.error import GraphQLError
from integraflow.core.exceptions import PermissionDenied
from integraflow.core.utils.events import call_event
from integraflow.graphql.core.doc_category import DOC_CATEGORY_MAP
from integraflow.graphql.core.validators import validate_one_of_args_is_in_mutation
from integraflow.graphql.utils import get_nodes, resolve_global_ids_to_primary_keys
from integraflow.permission.enums import BasePermissionEnum
from integraflow.permission.utils import (
    all_permissions_required,
    message_one_of_permissions_required,
    one_of_permissions_or_auth_filter_required,
)

from . import ResolveInfo
from .context import disallow_replica_in_context, setup_context_user
from .types.common import NonNullList
from .types.model import ModelObjectType
from .utils import (
    WebhookEventInfo,
    ext_ref_to_global_id_or_error,
    from_global_id_or_error,
    message_webhook_events,
    snake_to_camel_case,
)
from .utils.error_codes import get_error_code_from_error


def get_model_name(model):
    """Return name of the model with first letter lowercase."""
    model_name = model.__name__
    return model_name[:1].lower() + model_name[1:]


def get_error_fields(
    error_type_class,
    error_type_field
):
    error_field = graphene.Field(
        NonNullList(
            error_type_class,
            description="List of errors that occurred executing the mutation.",
        ),
        default_value=[],
        required=True,
    )
    return {error_type_field: error_field}


def validation_error_to_error_type(
    validation_error: ValidationError, error_type_class
) -> list:
    """Convert a ValidationError into a list of Error types."""
    err_list = []
    error_class_fields = set(error_type_class._meta.fields.keys())
    if hasattr(validation_error, "error_dict"):
        # convert field errors
        for field_label, field_errors in validation_error.error_dict.items():
            field = (
                None
                if field_label == NON_FIELD_ERRORS
                else snake_to_camel_case(field_label)
            )
            for err in field_errors:
                error = error_type_class(
                    field=field,
                    message=err.messages[0],
                    code=get_error_code_from_error(err),
                )
                attach_error_params(error, err.params, error_class_fields)
                err_list.append(error)
    else:
        # convert non-field errors
        for err in validation_error.error_list:
            error = error_type_class(
                message=err.messages[0],
                code=get_error_code_from_error(err),
            )
            attach_error_params(error, err.params, error_class_fields)
            err_list.append(error)
    return err_list


def attach_error_params(
    error,
    params: Optional[dict],
    error_class_fields: set
):
    if not params:
        return {}
    # If some of the params key overlap with error class fields
    # attach param value to the error
    error_fields_in_params = set(params.keys()) & error_class_fields
    for error_field in error_fields_in_params:
        setattr(error, error_field, params[error_field])


class ModelMutationOptions(MutationOptions):
    doc_category = None
    exclude = None
    model = None
    object_type = None
    return_field_name = None


MT = TypeVar("MT", bound=Model)


class BaseMutation(graphene.Mutation):
    class Meta:
        abstract = True

    @classmethod
    def _validate_permissions(cls, permissions):
        if not permissions:
            return
        if not isinstance(permissions, tuple):
            raise ImproperlyConfigured(
                f"Permissions should be a tuple in Meta class: {permissions}"
            )
        for p in permissions:
            if not isinstance(p, Enum):
                raise ImproperlyConfigured(
                    f"Permission should be an enum: {p}."
                )

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        auto_permission_message=True,
        description=None,
        doc_category=None,
        permissions: Optional[Collection[BasePermissionEnum]] = None,
        _meta=None,
        error_type_class=None,
        error_type_field=None,
        errors_mapping=None,
        support_meta_field=False,
        support_private_meta_field=False,
        auto_webhook_events_message: bool = True,
        auto_verify_project: bool = False,
        auto_verify_organization: bool = False,
        webhook_events_info: Optional[List[WebhookEventInfo]] = None,
        **options,
    ):
        if not _meta:
            _meta = MutationOptions(cls)

        if not description:
            raise ImproperlyConfigured("No description provided in Meta")

        if not error_type_class:
            raise ImproperlyConfigured("No error_type_class provided in Meta.")

        cls._validate_permissions(permissions)

        _meta.auto_permission_message = auto_permission_message
        _meta.error_type_class = error_type_class
        _meta.error_type_field = error_type_field
        _meta.errors_mapping = errors_mapping
        _meta.permissions = permissions
        _meta.support_meta_field = support_meta_field
        _meta.support_private_meta_field = support_private_meta_field
        _meta.auto_verify_project = auto_verify_project
        _meta.auto_verify_organization = auto_verify_organization

        if permissions and auto_permission_message:
            permissions_msg = message_one_of_permissions_required(permissions)
            description = f"{description} {permissions_msg}"

        if webhook_events_info and auto_webhook_events_message:
            description += message_webhook_events(webhook_events_info)

        cls.webhook_events_info = webhook_events_info

        cls.doc_category = doc_category

        super().__init_subclass_with_meta__(
            description=description, _meta=_meta, **options
        )

        if error_type_field:
            cls._meta.fields.update(
                get_error_fields(
                    error_type_class,
                    error_type_field,
                )
            )
        cls._meta.fields.update(get_error_fields(error_type_class, "errors"))

    @classmethod
    def _update_mutation_arguments_and_fields(cls, arguments, fields):
        cls._meta.arguments.update(arguments)
        cls._meta.fields.update(fields)

    @classmethod
    def _get_node_by_pk(
        cls,
        info: ResolveInfo,
        graphene_type: Type[ModelObjectType[MT]],
        pk: Union[int, str],
        qs=None,
    ) -> Optional[MT]:
        """Attempt to resolve a node from the given internal ID.

        Whether by using the provided query set object or by calling type's
        get_node().
        """
        if qs is not None:
            return qs.filter(Q(pk=pk)).first()

        get_node = getattr(graphene_type, "get_node", None)
        if get_node:
            return get_node(info, pk)
        return None

    @classmethod
    def get_global_id_or_error(
        cls,
        id: str,
        only_type: Union[ObjectType, str, None] = None,
        field: str = "id",
    ):
        try:
            _object_type, pk = from_global_id_or_error(
                id,
                only_type,
                raise_error=True
            )
        except GraphQLError as e:
            raise ValidationError(
                {field: ValidationError(str(e), code="graphql_error")}
            )
        return pk

    @overload
    @classmethod
    def get_node_or_error(
        cls,
        info: ResolveInfo,
        node_id: str,
        *,
        field: str = "id",
        only_type: Type[ModelObjectType[MT]],
        qs: Any = None,
        code: str = "not_found",
    ) -> MT:
        ...

    @overload
    @classmethod
    def get_node_or_error(
        cls,
        info: ResolveInfo,
        node_id: Optional[str],
        *,
        field: str = "id",
        only_type: Type[ModelObjectType[MT]],
        qs: Any = None,
        code: str = "not_found",
    ) -> Optional[MT]:
        ...

    @overload
    @classmethod
    def get_node_or_error(
        cls,
        info: ResolveInfo,
        node_id: str,
        *,
        field: str = "id",
        only_type: None,
        qs: QuerySet[MT],
        code: str = "not_found",
    ) -> MT:
        ...

    @overload
    @classmethod
    def get_node_or_error(
        cls,
        info: ResolveInfo,
        node_id: str,
        *,
        field: str = "id",
        only_type: None = None,
        qs: Any = None,
        code: str = "not_found",
    ) -> Model:
        ...

    @overload
    @classmethod
    def get_node_or_error(
        cls,
        info: ResolveInfo,
        node_id: Optional[str],
        *,
        field: str = "id",
        only_type: Any = None,
        qs: Any = None,
        code: str = "not_found",
    ) -> Optional[Model]:
        ...

    @classmethod
    def get_node_or_error(
        cls,
        info: ResolveInfo,
        node_id: Optional[str],
        *,
        field: str = "id",
        only_type: Optional[Type[ObjectType]] = None,
        qs: Optional[QuerySet] = None,
        code: str = "not_found",
    ) -> Optional[Model]:
        if not node_id:
            # the function now has three possible outcomes:
            # * Null
            # * the object you asked for
            # * ValidationError
            return None

        try:
            object_type, pk = from_global_id_or_error(
                node_id, only_type, raise_error=True
            )

            if isinstance(object_type, str):
                object_type = info.schema.get_type(object_type).graphene_type

            node = cls._get_node_by_pk(
                info,
                graphene_type=object_type,
                pk=pk,
                qs=qs
            )
        except (AssertionError, GraphQLError) as e:
            raise ValidationError(
                {field: ValidationError(str(e), code="graphql_error")}
            )
        else:
            if node is None:
                raise ValidationError(
                    {
                        field: ValidationError(
                            f"Couldn't resolve to a node: {node_id}", code=code
                        )
                    }
                )
        return node

    @classmethod
    def get_global_ids_or_error(
        cls,
        ids: Iterable[str],
        only_type: Union[ObjectType, str, None] = None,
        field: str = "ids",
    ):
        try:
            _nodes_type, pks = resolve_global_ids_to_primary_keys(
                ids, only_type, raise_error=True
            )
        except GraphQLError as e:
            raise ValidationError(
                {field: ValidationError(str(e), code="graphql_error")}
            )
        return pks

    @overload
    @classmethod
    def get_nodes_or_error(
        cls,
        ids,
        field,
        only_type: Type[ModelObjectType[MT]],
        qs=None,
        schema=None
    ) -> List[MT]:
        ...

    @overload
    @classmethod
    def get_nodes_or_error(
        cls,
        ids,
        field,
        only_type: Optional[ObjectType] = None,
        qs=None,
        schema=None
    ) -> List[Model]:
        ...

    @classmethod
    def get_nodes_or_error(
        cls,
        ids,
        field,
        only_type=None,
        qs=None,
        schema=None
    ):
        try:
            instances = get_nodes(ids, only_type, qs=qs, schema=schema)
        except GraphQLError as e:
            raise ValidationError(
                {field: ValidationError(str(e), code="graphql_error")}
            )
        return instances

    @staticmethod
    def remap_error_fields(validation_error, field_map) -> None:
        """Rename validation_error fields according to provided field_map.

        Skips renaming fields from field_map that are not on validation_error.
        """
        for old_field, new_field in field_map.items():
            try:
                validation_error.error_dict[
                    new_field
                ] = validation_error.error_dict.pop(old_field)
            except KeyError:
                pass

    @classmethod
    def clean_instance(cls, info: ResolveInfo, instance, /) -> None:
        """Clean the instance that was created using the input data.

        Once an instance is created, this method runs `full_clean()` to perform
        model validation.
        """
        try:
            if not cls.verify_instance(info.context, instance):
                raise PermissionDenied()

            instance.full_clean()
        except ValidationError as error:
            if hasattr(cls._meta, "exclude"):
                # Ignore validation errors for fields that are specified as
                # excluded.
                new_error_dict = {}
                for field, errors in error.error_dict.items():
                    if field not in cls._meta.exclude:
                        new_error_dict[field] = errors
                error.error_dict = new_error_dict

            if cls._meta.errors_mapping:
                cls.remap_error_fields(error, cls._meta.errors_mapping)

            if error.error_dict:
                raise error

    @classmethod
    def construct_instance(cls, instance, cleaned_data):
        """Fill instance fields with cleaned data.

        The `instance` argument is either an empty instance of a already
        existing one which was fetched from the database. `cleaned_data` is
        data to be set in instance fields. Returns `instance` with filled
        fields, but not saved to the database.
        """
        from django.db import models

        opts = instance._meta

        for f in opts.fields:
            if any(
                [
                    not f.editable,
                    isinstance(f, models.AutoField),
                    f.name not in cleaned_data,
                ]
            ):
                continue
            data = cleaned_data[f.name]
            if data is None:
                # We want to reset the file field value when None was passed
                # in the input, but `FileField.save_form_data` ignores None
                # values. In that case we manually pass False which clears
                # the file.
                if isinstance(f, FileField):
                    data = False
                if not f.null:
                    data = f._get_default()  # type: ignore
            f.save_form_data(instance, data)
        return instance

    @classmethod
    def verify_instance(cls, context, instance):
        if cls._meta.auto_verify_project:
            return instance.project.pk == context.user.project.pk

        if cls._meta.auto_verify_organization:
            return instance.organization.pk == context.user.organization.pk

        return True

    @classmethod
    def check_permissions(
        cls,
        context,
        permissions=None,
        require_all_permissions=False,
        **data
    ):
        """Determine whether user or app has rights to perform this mutation.

        Default implementation assumes that account is allowed to perform any
        mutation. By overriding this method or defining required permissions
        in the meta-class, you can restrict access to it.

        The `context` parameter is the Context instance associated with the
        request.
        """
        all_permissions = permissions or cls._meta.permissions
        if not all_permissions:
            return True
        if require_all_permissions:
            return all_permissions_required(context, all_permissions)
        return one_of_permissions_or_auth_filter_required(
            context,
            all_permissions
        )

    @classmethod
    def mutate(cls, root, info: ResolveInfo, **data):
        disallow_replica_in_context(info.context)
        setup_context_user(info.context)

        if not cls.check_permissions(info.context, data=data):
            raise PermissionDenied(permissions=cls._meta.permissions)

        try:
            response = cls.perform_mutation(root, info, **data)
            if response.errors is None:
                response.errors = []
            return response
        except ValidationError as e:
            return cls.handle_errors(e)

    @classmethod
    def perform_mutation(cls, _root, _info: ResolveInfo, /):
        raise NotImplementedError()

    @classmethod
    def handle_errors(cls, error: ValidationError, **extra):
        error_list = validation_error_to_error_type(
            error,
            cls._meta.error_type_class
        )
        return cls.handle_typed_errors(error_list, **extra)

    @classmethod
    def handle_typed_errors(cls, errors: list, **extra):
        """Return class instance with errors."""
        if cls._meta.error_type_field is not None:
            extra.update({cls._meta.error_type_field: errors})
        return cls(errors=errors, **extra)

    @staticmethod
    def call_event(func_obj, *func_args, **kwargs):
        return call_event(func_obj, *func_args, **kwargs)


def is_list_of_ids(field) -> bool:
    if isinstance(field.type, graphene.List):
        of_type = field.type.of_type
        if isinstance(of_type, graphene.NonNull):
            of_type = of_type.of_type
        return of_type == graphene.ID
    return False


def is_id_field(field) -> bool:
    return (
        field.type == graphene.ID
        or isinstance(field.type, graphene.NonNull)
        and field.type.of_type == graphene.ID
    )


class ModelMutation(BaseMutation):
    class Meta:
        abstract = True

    @classmethod
    def __init_subclass_with_meta__(
        cls,
        arguments=None,
        model=None,
        exclude=None,
        return_field_name=None,
        object_type=None,
        _meta=None,
        **options,
    ):
        if not model:
            raise ImproperlyConfigured("model is required for ModelMutation")
        if not _meta:
            _meta = ModelMutationOptions(cls)

        doc_category_key = f"{model._meta.app_label}.{model.__name__}"
        if (
            "doc_category" not in options and
            doc_category_key in DOC_CATEGORY_MAP
        ):
            options["doc_category"] = DOC_CATEGORY_MAP[doc_category_key]

        if exclude is None:
            exclude = []

        if not return_field_name:
            return_field_name = get_model_name(model)
        if arguments is None:
            arguments = {}

        _meta.model = model
        _meta.object_type = object_type
        _meta.return_field_name = return_field_name
        _meta.exclude = exclude  # type: ignore
        super().__init_subclass_with_meta__(_meta=_meta, **options)

        model_type = cls.get_type_for_model()
        if not model_type:
            raise ImproperlyConfigured(
                f"GraphQL type for model {cls._meta.model.__name__} could not "
                f"be resolved for {cls.__name__}"
            )
        fields = {return_field_name: graphene.Field(model_type)}

        cls._update_mutation_arguments_and_fields(
            arguments=arguments,
            fields=fields
        )

    @classmethod
    def clean_input(cls, info: ResolveInfo, instance, data, *, input_cls=None):
        """Clean input data received from mutation arguments.

        Fields containing IDs or lists of IDs are automatically resolved into
        model instances. `instance` argument is the model instance the mutation
        is operating on (before setting the input data). `input` is raw input
        data the mutation receives.

        Override this method to provide custom transformations of incoming
        data.
        """

        if not input_cls:
            input_cls = getattr(cls.Arguments, "input")
        cleaned_input = {}

        for field_name, field_item in input_cls._meta.fields.items():
            if field_name in data:
                value = data[field_name]

                # handle list of IDs field
                if value is not None and is_list_of_ids(field_item):
                    instances = (
                        cls.get_nodes_or_error(
                            value,
                            field_name,
                            schema=info.schema
                        )
                        if value
                        else []
                    )
                    cleaned_input[field_name] = instances

                # handle ID field
                elif value is not None and is_id_field(field_item):
                    instance = cls.get_node_or_error(
                        info,
                        value,
                        field=field_name
                    )
                    cleaned_input[field_name] = instance

                # handle other fields
                else:
                    cleaned_input[field_name] = value
        return cleaned_input

    @classmethod
    def _save_m2m(cls, _info: ResolveInfo, instance, cleaned_data):
        opts = instance._meta
        for f in chain(opts.many_to_many, opts.private_fields):
            if not hasattr(f, "save_form_data"):
                continue
            if f.name in cleaned_data and cleaned_data[f.name] is not None:
                f.save_form_data(instance, cleaned_data[f.name])

    @classmethod
    def success_response(cls, instance):
        """Return a success response."""
        return cls(**{cls._meta.return_field_name: instance, "errors": []})

    @classmethod
    def save(cls, _info: ResolveInfo, instance, _cleaned_input, /):
        instance.save()

    @classmethod
    def get_type_for_model(cls):
        if not cls._meta.object_type:
            raise ImproperlyConfigured(
                f"Either GraphQL type for model {cls._meta.model.__name__} "
                f"needs to be specified on object_type option or "
                f"{cls.__name__} needs to define custom get_type_for_model() "
                "method."
            )

        return cls._meta.object_type

    @classmethod
    def get_instance(cls, info: ResolveInfo, **data):
        """Retrieve an instance from the supplied global id.

        The expected graphene type can be lazy (str).
        """
        object_id = data.get("id")
        qs = data.get("qs")
        if object_id:
            model_type = cls.get_type_for_model()
            instance = cls.get_node_or_error(
                info, object_id, only_type=model_type, qs=qs
            )
        else:
            instance = cls._meta.model()
        return instance

    @classmethod
    def post_save_action(cls, info: ResolveInfo, instance, cleaned_input):
        """Perform an action after saving an object and its m2m."""
        pass

    @classmethod
    def perform_mutation(cls, _root, info: ResolveInfo, /, **data):
        """Perform model mutation.

        Depending on the input data, `mutate` either creates a new instance or
        updates an existing one. If `id` argument is present, it is assumed
        that this is an "update" mutation. Otherwise, a new instance is
        created based on the model associated with this mutation.
        """
        instance = cls.get_instance(info, **data)
        data = data.get("input")
        cleaned_input = cls.clean_input(info, instance, data)
        instance = cls.construct_instance(instance, cleaned_input)

        cls.clean_instance(info, instance)
        cls.save(info, instance, cleaned_input)
        cls._save_m2m(info, instance, cleaned_input)

        cls.post_save_action(info, instance, cleaned_input)
        return cls.success_response(instance)


class ModelWithExtRefMutation(ModelMutation):
    class Meta:
        abstract = True

    @classmethod
    def get_object_id(cls, **data):
        """Resolve object id by given id or external reference."""
        object_id, ext_ref = data.get("id"), data.get("external_reference")
        validate_one_of_args_is_in_mutation(
            "id", object_id, "external_reference", ext_ref
        )

        if ext_ref and not object_id:
            object_id = ext_ref_to_global_id_or_error(cls._meta.model, ext_ref)

        return object_id

    @classmethod
    def get_instance(cls, info, **data):
        """Retrieve an instance from the supplied global id.

        The expected graphene type can be lazy (str).
        """
        object_id = cls.get_object_id(**data)
        qs = data.get("qs")
        if object_id:
            model_type = cls.get_type_for_model()
            return cls.get_node_or_error(
                info,
                object_id,
                only_type=model_type,
                qs=qs
            )


class ModelDeleteMutation(ModelMutation):
    class Meta:
        abstract = True

    @classmethod
    def clean_instance(cls, info: ResolveInfo, instance, /):
        """Perform additional logic before deleting the model instance.

        Override this method to raise custom validation error and abort
        the deletion process.
        """

        if not cls.verify_instance(info.context, instance):
            raise PermissionDenied()

    @classmethod
    def delete(cls, _info: ResolveInfo, instance):
        instance.delete()

    @classmethod
    def perform_mutation(  # type: ignore[override]
        cls, _root, info: ResolveInfo, /, *, id=None
    ):
        """Perform a mutation that deletes a model instance."""
        instance = cls.get_instance(
            info,
            id=id
        )

        cls.clean_instance(info, instance)
        db_id = instance.id
        cls.delete(info, instance)

        # After the instance is deleted, set its ID to the original database's
        # ID so that the success response contains ID of the deleted object.
        instance.id = db_id
        cls.post_save_action(info, instance, None)
        return cls.success_response(instance)


class BaseBulkMutation(BaseMutation):
    count = graphene.Int(
        required=True,
        description="Returns how many objects were affected."
    )

    class Meta:
        abstract = True

    @classmethod
    def __init_subclass_with_meta__(
        cls, model=None, object_type=None, _meta=None, **kwargs
    ):
        if not model:
            raise ImproperlyConfigured("model is required for bulk mutation")
        if not _meta:
            _meta = ModelMutationOptions(cls)

        _meta.model = model
        _meta.object_type = object_type

        doc_category_key = f"{model._meta.app_label}.{model.__name__}"
        if (
            "doc_category" not in kwargs and
            doc_category_key in DOC_CATEGORY_MAP
        ):
            kwargs["doc_category"] = DOC_CATEGORY_MAP[doc_category_key]

        super().__init_subclass_with_meta__(_meta=_meta, **kwargs)

    @classmethod
    def get_type_for_model(cls):
        if not cls._meta.object_type:
            raise ImproperlyConfigured(
                f"Either GraphQL type for model {cls._meta.model.__name__} "
                f"needs to be specified on object_type option or "
                f"{cls.__name__} needs to define custom get_type_for_model() "
                "method."
            )

        return cls._meta.object_type

    @classmethod
    def clean_instance(cls, info: ResolveInfo, instance, /):
        """Perform additional logic.

        Override this method to raise custom validation error and prevent
        bulk action on the instance.
        """

        if not cls.verify_instance(info.context, instance):
            raise PermissionDenied()

    @classmethod
    def bulk_action(cls, _info: ResolveInfo, _queryset: QuerySet, /):
        """Implement action performed on queryset."""
        raise NotImplementedError

    @classmethod
    def perform_mutation(  # type: ignore[override]
        cls, _root, info: ResolveInfo, /, *, ids, **data
    ) -> Tuple[int, Optional[ValidationError]]:
        """Perform a mutation that deletes a list of model instances."""
        clean_instance_ids = []
        errors_dict: Dict[str, List[ValidationError]] = {}
        # Allow to pass empty list for dummy mutation
        if not ids:
            return 0, None
        instance_model = cls._meta.model
        model_type = cls.get_type_for_model()
        if not model_type:
            raise ImproperlyConfigured(
                f"GraphQL type for model {cls._meta.model.__name__} could "
                f"not be resolved for {cls.__name__}"
            )

        try:
            instances = cls.get_nodes_or_error(
                ids, "id", model_type, schema=info.schema
            )
        except ValidationError as error:
            return 0, error
        for instance, node_id in zip(instances, ids):
            instance_errors = []

            # catch individual validation errors to raise them later as
            # a single error
            try:
                cls.clean_instance(info, instance)
            except ValidationError as e:
                msg = ". ".join(e.messages)
                instance_errors.append(msg)

            if not instance_errors:
                clean_instance_ids.append(instance.pk)
            else:
                instance_errors_msg = ". ".join(instance_errors)
                ValidationError({
                    node_id: instance_errors_msg
                }).update_error_dict(
                    errors_dict
                )

        if errors_dict:
            errors = ValidationError(errors_dict)
        else:
            errors = None
        count = len(clean_instance_ids)
        if count:
            qs = instance_model.objects.filter(pk__in=clean_instance_ids)
            cls.bulk_action(info, qs, **data)
        return count, errors

    @classmethod
    def mutate(cls, root, info: ResolveInfo, **data):
        disallow_replica_in_context(info.context)
        setup_context_user(info.context)

        if not cls.check_permissions(info.context):
            raise PermissionDenied(permissions=cls._meta.permissions)

        count, errors = cls.perform_mutation(root, info, **data)
        if errors:
            return cls.handle_errors(errors, count=count)

        return cls(errors=[], count=count)


class ModelBulkDeleteMutation(BaseBulkMutation):
    class Meta:
        abstract = True

    @classmethod
    def bulk_action(cls, _info: ResolveInfo, queryset, /):
        queryset.delete()
