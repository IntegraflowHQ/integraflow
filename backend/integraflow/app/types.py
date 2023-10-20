class AppType:
    LOCAL = "local"
    THIRDPARTY = "thirdparty"

    CHOICES = [(LOCAL, "local"), (THIRDPARTY, "thirdparty")]


class AppExtensionMount:
    """All places where app extension can be mounted."""

    NAVIGATION = "navigation"

    CHOICES = [
        (NAVIGATION, "navigation"),
    ]


class AppExtensionTarget:
    """All available ways of opening an app extension.

    POPUP - app's extension will be mounted as a popup window
    APP_PAGE - redirect to app's page
    """

    POPUP = "popup"
    APP_PAGE = "app_page"

    CHOICES = [(POPUP, "popup"), (APP_PAGE, "app_page")]
