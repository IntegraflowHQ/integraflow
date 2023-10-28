from typing import Union

from .models import User


def retrieve_user_by_email(email) -> Union[User, None]:
    """
    Retrieve user by email.

    Email lookup is case-insensitive, unless the query returns more than one
    user. In such a case, function return case-sensitive result.
    """
    users = list(User.objects.filter(email__iexact=email))

    if len(users) > 1:
        users_exact = [user for user in users if user.email == email]
        users_iexact = [user for user in users if user.email == email.lower()]
        users = users_exact or users_iexact

    if users:
        return users[0]
    return None
