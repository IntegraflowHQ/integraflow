default_app_config = "integraflow.user.app.UserAppConfig"


class UserEvents:
    """The different user event types."""

    # User related events
    USER_CREATED = "user_created"
    USER_ACTIVATED = "user_activated"
    USER_DEACTIVATED = "user_deactivated"
    MAGIC_LINK_SENT = "magic_link_sent"
    PASSWORD_RESET_LINK_SENT = "password_reset_link_sent"
    PASSWORD_RESET = "password_reset"
    PASSWORD_CHANGED = "password_changed"
    EMAIL_CHANGE_REQUEST = "email_changed_request"
    EMAIL_CHANGED = "email_changed"

    # Admin actions over user events
    USER_DELETED = "customer_deleted"  # admin deleted a user
    EMAIL_ASSIGNED = "email_assigned"  # the admin assigned an email
    NAME_ASSIGNED = "name_assigned"  # the admin updated a name
    NOTE_ADDED = "note_added"  # the admin added a note to the user

    CHOICES = [
        (USER_CREATED, "The user was created"),
        (USER_ACTIVATED, "The user was activated"),
        (USER_DEACTIVATED, "The user was deactivated"),
        (PASSWORD_RESET_LINK_SENT, "Password reset link was sent to the user"),
        (PASSWORD_RESET, "The user password was reset"),
        (
            EMAIL_CHANGE_REQUEST,
            "The user requested to change the user's email address.",
        ),
        (PASSWORD_CHANGED, "The user password was changed"),
        (EMAIL_CHANGED, "The user email address was changed"),
        (USER_DELETED, "A user was deleted"),
        (NAME_ASSIGNED, "A user's name was edited"),
        (EMAIL_ASSIGNED, "A user's email address was edited"),
        (NOTE_ADDED, "A note was added to the user"),
    ]
