export const NEW_USER_FILE = "playwright/.auth/newUser.json";
export const ONBOARDED_USER_FILE = "playwright/.auth/onboardedUser.json";
export const NON_ONBOARDED_USER_FILE = "playwright/.auth/nonOnboardedUser.json";
export const userDetailsFile = "playwright/.auth/userDetails.json";

export const ROUTES = {
    WORKSPACE: {
        CREATE: "/create-workspace",
        ONBOARDING: (workspaceSlug: string, projectSlug: string) =>
            `/${workspaceSlug}/projects/${projectSlug}/get-started`,
    },

    SURVEY: {
        LIST: (workspaceSlug: string, projectSlug: string) => `/${workspaceSlug}/projects/${projectSlug}/surveys`,
        SINGLE: (workspaceSlug: string, projectSlug: string, surveySlug: string) =>
            `/${workspaceSlug}/projects/${projectSlug}/survey/${surveySlug}`,
    },

    PATTERNS: {
        ONBOARDING_URL: /\/[\w-]+\/projects\/[\w-]+\/get-started/,
        SURVEY_LIST_URL: /\/[\w-]+\/projects\/[\w-]+\/surveys/,
        SINGLE_SURVEY: /\/[\w-]+\/projects\/[\w-]+\/survey\/[\w-]+/,
    },
};
