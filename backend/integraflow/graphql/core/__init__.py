import graphene

from . import fields  # noqa
from .context import IntegraflowContext

__all__ = ["IntegraflowContext"]


class ResolveInfo(graphene.ResolveInfo):
    context: IntegraflowContext
