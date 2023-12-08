DOC_CATEGORY_APPS = "Apps"
DOC_CATEGORY_AUTH = "Authentication"
DOC_CATEGORY_EVENTS = "Events"
DOC_CATEGORY_ORGANIZATIONS = "Organizations"
DOC_CATEGORY_PROJECTS = "Projects"
DOC_CATEGORY_SURVEYS = "Surveys"
DOC_CATEGORY_USERS = "Users"
DOC_CATEGORY_WEBHOOKS = "Webhooks"


# Map models to category names in doc directive.
DOC_CATEGORY_MAP = {
    "app.App": DOC_CATEGORY_APPS,
    "app.AppToken": DOC_CATEGORY_APPS,
    "app.AppExtension": DOC_CATEGORY_APPS,
    "app.AppInstallation": DOC_CATEGORY_APPS,
    "core.EventDeliveryAttempt": DOC_CATEGORY_WEBHOOKS,
    "event.Event": DOC_CATEGORY_EVENTS,
    "event.EventProperty": DOC_CATEGORY_EVENTS,
    "event.Person": DOC_CATEGORY_EVENTS,
    "event.PersonDistinctId": DOC_CATEGORY_EVENTS,
    "event.PropertyDefinition": DOC_CATEGORY_EVENTS,
    "organization.Organization": DOC_CATEGORY_ORGANIZATIONS,
    "organization.OrganizationMembership": DOC_CATEGORY_ORGANIZATIONS,
    "organization.OrganizationInvite": DOC_CATEGORY_ORGANIZATIONS,
    "project.Project": DOC_CATEGORY_PROJECTS,
    "project.ProjectMembership": DOC_CATEGORY_PROJECTS,
    "project.ProjectTheme": DOC_CATEGORY_PROJECTS,
    "survey.Survey": DOC_CATEGORY_SURVEYS,
    "survey.SurveyQuestion": DOC_CATEGORY_SURVEYS,
    "survey.SurveyChannel": DOC_CATEGORY_SURVEYS,
    "user.User": DOC_CATEGORY_USERS,
    "webhook.WebhookEvent": DOC_CATEGORY_WEBHOOKS,
    "webhook.Webhook": DOC_CATEGORY_WEBHOOKS,
}
