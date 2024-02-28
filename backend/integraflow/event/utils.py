from django.db import IntegrityError

from integraflow.event.models import Person


def get_person(project_id: str, distinct_id: str):
    return Person.objects.get(
        project_id=project_id,
        persondistinctid__project_id=project_id,
        persondistinctid__distinct_id=str(distinct_id)
    )


def get_or_create_person(project_id: str, distinct_id: str):
    try:
        person = get_person(project_id, distinct_id)
    except Person.DoesNotExist:
        try:
            person = Person.objects.create(
                project_id=project_id,
                distinct_ids=[str(distinct_id)]
            )
            # Catch race condition where in between getting and creating,
            # another request already created this person
        except IntegrityError:
            person = get_person(project_id, distinct_id)

    return person
