DOC_CATEGORY_APPS = "Apps"
DOC_CATEGORY_AUTH = "Authentication"
DOC_CATEGORY_ORGANIZATIONS = "Organizations"
DOC_CATEGORY_PROJECTS = "Projects"
DOC_CATEGORY_USERS = "Users"
DOC_CATEGORY_WEBHOOKS = "Webhooks"


# Map models to category names in doc directive.
DOC_CATEGORY_MAP = {
    "app.App": DOC_CATEGORY_APPS,
    "app.AppToken": DOC_CATEGORY_APPS,
    "app.AppExtension": DOC_CATEGORY_APPS,
    "app.AppInstallation": DOC_CATEGORY_APPS,
    "webhook.WebhookEvent": DOC_CATEGORY_WEBHOOKS,
    "webhook.Webhook": DOC_CATEGORY_WEBHOOKS,
    "core.EventDeliveryAttempt": DOC_CATEGORY_WEBHOOKS,
    "organization.Organization": DOC_CATEGORY_ORGANIZATIONS,
    "project.Project": DOC_CATEGORY_PROJECTS,
    "user.User": DOC_CATEGORY_USERS
}
