from typing import List, Union

import graphene

from integraflow.app import models
from integraflow.app.types import AppExtensionTarget
from integraflow.core.exceptions import PermissionDenied
from integraflow.graphql.core import ResolveInfo
from integraflow.graphql.core.connection import CountableConnection
from integraflow.graphql.core.doc_category import DOC_CATEGORY_APPS
from integraflow.graphql.core.federation import (
    federated_entity,
    resolve_federation_references
)
from integraflow.graphql.core.types.common import (
    BaseObjectType,
    NonNullList,
)
from integraflow.graphql.core.types.model import ModelObjectType
from integraflow.graphql.meta.types import ObjectWithMetadata
from integraflow.graphql.utils import get_user_or_app_from_context
from integraflow.graphql.webhook.dataloaders import WebhooksByAppIdLoader
from integraflow.graphql.webhook.enums import (
    WebhookEventTypeAsyncEnum,
    WebhookEventTypeSyncEnum
)
from integraflow.graphql.webhook.types import Webhook
from .dataloaders import (
    AppByIdLoader,
    AppExtensionByAppIdLoader,
    AppTokensByAppIdLoader,
    app_promise_callback,
)
from .enums import AppExtensionMountEnum, AppExtensionTargetEnum, AppTypeEnum
from .resolvers import (
    resolve_access_token_for_app,
    resolve_access_token_for_app_extension,
    resolve_app_extension_url,
)

# Maximal thumbnail size for manifest preview
MANIFEST_THUMBNAIL_MAX_SIZE = 512


class AppManifestExtension(BaseObjectType):
    label = graphene.String(
        description="Label of the extension to show in the dashboard.",
        required=True
    )
    url = graphene.String(
        description="URL of a view where extension's iframe is placed.",
        required=True
    )
    mount = AppExtensionMountEnum(
        description="Place where given extension will be mounted.",
        required=True,
    )
    target = AppExtensionTargetEnum(
        description="Type of way how app extension will be opened.",
        required=True
    )

    class Meta:
        doc_category = DOC_CATEGORY_APPS

    @staticmethod
    def resolve_target(root, _info: ResolveInfo):
        return root.get("target") or AppExtensionTarget.POPUP

    @staticmethod
    def resolve_url(root, _info: ResolveInfo):
        """Return an extension URL."""
        return resolve_app_extension_url(root)


class AppExtension(AppManifestExtension, ModelObjectType[models.AppExtension]):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the app extension."
    )
    app = graphene.Field(
        "integraflow.graphql.app.types.App",
        required=True,
        description="The app assigned to app extension.",
    )
    access_token = graphene.String(
        description="JWT token used to authenticate by third-party app "
        "extension."
    )

    class Meta:
        description = "Represents app data."
        interfaces = [graphene.relay.Node]
        model = models.AppExtension

    @staticmethod
    def resolve_url(root, info: ResolveInfo):
        return (
            AppByIdLoader(info.context)
            .load(root.app_id)
            .then(
                lambda app: AppManifestExtension.resolve_url(
                    {
                        "target":
                        root.target,
                        "app_url": app.app_url,
                        "url": root.url
                    },
                    info,
                )
            )
        )

    @staticmethod
    def resolve_target(root, _info: ResolveInfo):
        return root.target

    @staticmethod
    @app_promise_callback
    def resolve_app(root, info: ResolveInfo, app):
        app_id = None
        if app and app.id == root.app_id:
            app_id = root.app_id
        else:
            requestor = get_user_or_app_from_context(info.context)
            if requestor:
                app_id = root.app_id

        if not app_id:
            raise PermissionDenied()
        return AppByIdLoader(info.context).load(app_id)

    @staticmethod
    def resolve_access_token(root: models.AppExtension, info: ResolveInfo):
        def _resolve_access_token(app):
            return resolve_access_token_for_app_extension(info, root, app)

        return AppByIdLoader(info.context).load(
            root.app_id  # type: ignore
        ).then(_resolve_access_token)


class AppExtensionCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_APPS
        node = AppExtension


class AppManifestWebhook(BaseObjectType):
    name = graphene.String(
        description="The name of the webhook.",
        required=True
    )
    async_events = NonNullList(
        WebhookEventTypeAsyncEnum,
        description="The asynchronous events that webhook wants to subscribe.",
    )
    sync_events = NonNullList(
        WebhookEventTypeSyncEnum,
        description="The synchronous events that webhook wants to subscribe.",
    )
    query = graphene.String(
        description="Subscription query of a webhook", required=True
    )
    target_url = graphene.String(
        description="The url to receive the payload.", required=True
    )

    class Meta:
        doc_category = DOC_CATEGORY_APPS

    @staticmethod
    def resolve_async_events(root, _info: ResolveInfo):
        return [
            WebhookEventTypeAsyncEnum[name] for name in root.get(
                "asyncEvents",
                []
            )
        ]

    @staticmethod
    def resolve_sync_events(root, _info: ResolveInfo):
        return [
            WebhookEventTypeSyncEnum[name] for name in root.get(
                "syncEvents",
                []
            )
        ]

    @staticmethod
    def resolve_target_url(root, _info: ResolveInfo):
        return root["targetUrl"]


class AppManifestRequiredIntegraflowVersion(BaseObjectType):
    constraint = graphene.String(
        required=True,
        description=(
            "Required Integraflow version as semver range."
        ),
    )
    satisfied = graphene.Boolean(
        required=True,
        description=(
            "Informs if the Integraflow version matches the required one."
        ),
    )

    class Meta:
        doc_category = DOC_CATEGORY_APPS


class AppManifestBrandLogo(BaseObjectType):
    default = graphene.String(
        required=True,
        description="Data URL with a base64 encoded logo image."
    )

    class Meta:
        doc_category = DOC_CATEGORY_APPS
        description = (
            "Represents the app's manifest brand data."
        )


class AppBrandLogo(BaseObjectType):
    default = graphene.String(
        required=True,
        description="URL to the default logo image."
    )

    class Meta:
        doc_category = DOC_CATEGORY_APPS
        description = (
            "Represents the app's brand logo data."
        )


class AppBrand(BaseObjectType):
    logo = graphene.Field(
        AppBrandLogo,
        required=True,
        description="App's logos details.",
    )

    class Meta:
        description = (
            "Represents the app's brand data."
        )
        doc_category = DOC_CATEGORY_APPS

    @staticmethod
    def resolve_logo(
        root: Union[models.App, models.AppInstallation], _info: ResolveInfo
    ):
        return root


class AppManifestBrand(BaseObjectType):
    logo = graphene.Field(
        AppManifestBrandLogo,
        required=True,
        description="App's logos details."
    )

    class Meta:
        description = (
            "Represents the app's manifest brand data."
        )
        doc_category = DOC_CATEGORY_APPS


class Manifest(BaseObjectType):
    identifier = graphene.String(
        required=True,
        description="The identifier of the manifest for the app."
    )
    version = graphene.String(
        required=True,
        description="The version of the manifest for the app."
    )
    name = graphene.String(
        required=True,
        description="The name of the manifest for the app ."
    )
    about = graphene.String(
        description="Description of the app displayed in the dashboard."
    )
    app_url = graphene.String(
        description="App website rendered in the dashboard."
    )
    token_target_url = graphene.String(
        description=(
            "Endpoint used during process of app installation, "
            "[see installing an app.]"
        )
    )
    data_privacy_url = graphene.String(
        description="URL to the full privacy policy."
    )
    homepage_url = graphene.String(
        description="External URL to the app homepage."
    )
    support_url = graphene.String(
        description="External URL to the page where app users can find "
        "support."
    )
    extensions = NonNullList(
        AppManifestExtension,
        required=True,
        description=(
            "List of extensions that will be mounted in Integraflow's "
            "dashboard."
        ),
    )
    webhooks = NonNullList(
        AppManifestWebhook,
        description="List of the app's webhooks.",
        required=True,
    )
    audience = graphene.String(
        description=(
            "The audience that will be included in all JWT tokens for the app."
        )
    )
    author = graphene.String(
        description=("The App's author name.")
    )
    brand = graphene.Field(
        AppManifestBrand,
        description="App's brand data.",
    )

    class Meta:
        description = "The manifest definition."
        doc_category = DOC_CATEGORY_APPS

    @staticmethod
    def resolve_extensions(root, _info: ResolveInfo):
        for extension in root.extensions:
            extension["app_url"] = root.app_url
        return root.extensions


class AppToken(BaseObjectType):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the app token."
    )
    name = graphene.String(description="Name of the authenticated token.")
    auth_token = graphene.String(description="Last 4 characters of the token.")

    class Meta:
        description = "Represents token data."
        doc_category = DOC_CATEGORY_APPS
        interfaces = [graphene.relay.Node]

    @staticmethod
    def get_node(info: ResolveInfo, id):
        try:
            return models.AppToken.objects.get(pk=id)
        except models.AppToken.DoesNotExist:
            return None

    @staticmethod
    def resolve_auth_token(root: models.AppToken, _info: ResolveInfo):
        return root.token_last_4


@federated_entity("id")
class App(ModelObjectType[models.App]):
    id = graphene.GlobalID(required=True, description="The ID of the app.")
    created = graphene.DateTime(
        description="The date and time when the app was created."
    )
    is_active = graphene.Boolean(
        description="Determine if app will be set active or not."
    )
    name = graphene.String(description="Name of the app.")
    type = AppTypeEnum(description="Type of the app.")
    tokens = NonNullList(
        AppToken,
        description=(
            "Last 4 characters of the tokens."
        ),
    )
    webhooks = NonNullList(
        Webhook,
        description=(
            "List of webhooks assigned to this app."
        ),
    )

    about_app = graphene.String(description="Description of this app.")

    data_privacy_url = graphene.String(
        description="URL to details about the privacy policy on the app owner "
        "page."
    )
    homepage_url = graphene.String(description="Homepage of the app.")
    support_url = graphene.String(description="Support page for the app.")
    app_url = graphene.String(description="URL to iframe with the app.")
    manifest_url = graphene.String(
        description="URL to manifest used during app's installation."
    )
    version = graphene.String(description="Version number of the app.")
    access_token = graphene.String(
        description="JWT token used to authenticate by thridparty app."
    )
    author = graphene.String(
        description=("The App's author name.")
    )
    extensions = NonNullList(
        AppExtension,
        description="App's dashboard extensions.",
        required=True,
    )
    brand = graphene.Field(
        AppBrand, description="App's brand data."
    )

    class Meta:
        description = "Represents app data."
        interfaces = [graphene.relay.Node, ObjectWithMetadata]
        model = models.App

    @staticmethod
    def resolve_created(root: models.App, _info: ResolveInfo):
        return root.created_at

    @staticmethod
    def resolve_tokens(root: models.App, info: ResolveInfo):
        return AppTokensByAppIdLoader(info.context).load(
            root.id  # type: ignore
        )

    @staticmethod
    def resolve_webhooks(root: models.App, info: ResolveInfo):
        return WebhooksByAppIdLoader(info.context).load(
            root.id  # type: ignore
        )

    @staticmethod
    def resolve_access_token(root: models.App, info: ResolveInfo):
        return resolve_access_token_for_app(info, root)

    @staticmethod
    def resolve_extensions(root: models.App, info: ResolveInfo):
        return AppExtensionByAppIdLoader(info.context).load(
            root.id  # type: ignore
        )

    @staticmethod
    def __resolve_references(roots: List["App"], info: ResolveInfo):
        from .resolvers import resolve_apps

        requestor = get_user_or_app_from_context(info.context)
        if not requestor:
            qs = models.App.objects.none()
        else:
            qs = resolve_apps(info)

        return resolve_federation_references(App, roots, qs)

    @staticmethod
    @app_promise_callback
    def resolve_metadata(root: models.App, info: ResolveInfo, app):
        return ObjectWithMetadata.resolve_metadata(root, info)

    @staticmethod
    @app_promise_callback
    def resolve_metafield(
        root: models.App, info: ResolveInfo, app, *, key: str
    ):
        return ObjectWithMetadata.resolve_metafield(root, info, key=key)

    @staticmethod
    @app_promise_callback
    def resolve_metafields(
        root: models.App, info: ResolveInfo, app, *, keys=None
    ):
        return ObjectWithMetadata.resolve_metafields(root, info, keys=keys)

    @staticmethod
    def resolve_brand(root: models.App, _info: ResolveInfo):
        if root.brand_logo_default:
            return root


class AppCountableConnection(CountableConnection):
    class Meta:
        doc_category = DOC_CATEGORY_APPS
        node = App


class AppInstallation(ModelObjectType[models.AppInstallation]):
    id = graphene.GlobalID(
        required=True,
        description="The ID of the app installation."
    )
    app_name = graphene.String(
        required=True, description="The name of the app installation."
    )
    manifest_url = graphene.String(
        required=True,
        description="The URL address of manifest for the app installation.",
    )
    brand = graphene.Field(
        AppBrand, description="App's brand data."
    )

    class Meta:
        model = models.AppInstallation
        description = "Represents ongoing installation of app."
        # interfaces = [graphene.relay.Node, Job]

    @staticmethod
    def resolve_brand(root: models.AppInstallation, _info: ResolveInfo):
        if root.brand_logo_default:
            return root
