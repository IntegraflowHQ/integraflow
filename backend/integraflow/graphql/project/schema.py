import graphene

from integraflow.graphql.project.mutations import ProjectCreate


class ProjectQueries(graphene.ObjectType):
    pass


class ProjectMutations(graphene.ObjectType):
    # Base mutations
    project_create = ProjectCreate.Field()
