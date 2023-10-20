DOC_CATEGORY_APPS = "Apps"
DOC_CATEGORY_AUTH = "Authentication"
DOC_CATEGORY_USERS = "Users"
DOC_CATEGORY_WEBHOOKS = "Webhooks"


# Map models to category names in doc directive.
DOC_CATEGORY_MAP = {
    "account.Address": DOC_CATEGORY_USERS,
    "account.CustomerEvent": DOC_CATEGORY_USERS,
    "account.Group": DOC_CATEGORY_USERS,
    "account.StaffNotificationRecipient": DOC_CATEGORY_USERS,
    "account.User": DOC_CATEGORY_USERS,
    "app.App": DOC_CATEGORY_APPS,
    "app.AppToken": DOC_CATEGORY_APPS,
    "app.AppExtension": DOC_CATEGORY_APPS,
    "app.AppInstallation": DOC_CATEGORY_APPS,
    "webhook.WebhookEvent": DOC_CATEGORY_WEBHOOKS,
    "webhook.Webhook": DOC_CATEGORY_WEBHOOKS,
    "core.EventDeliveryAttempt": DOC_CATEGORY_WEBHOOKS,
}
