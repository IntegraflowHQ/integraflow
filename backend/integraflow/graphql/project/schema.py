import graphene

from integraflow.graphql.project.mutations import ProjectCreate, ProjectUpdate


class ProjectQueries(graphene.ObjectType):
    pass


class ProjectMutations(graphene.ObjectType):
    # Base mutations
    project_create = ProjectCreate.Field()
    project_update = ProjectUpdate.Field()
