import { Page } from "@playwright/test";
import fs from "fs";
import { e2eTestToken, ROUTES, surveyMakerDetailsFile, userDetailsFile } from "../constants";

export const waitForResponse = async (page: Page, operationName: string, actionCallback: () => void) => {
    const [response] = await Promise.all([
        page.waitForResponse((response) => {
            const request = response.request();
            if (request) {
                const postData = request.postData();
                if (postData && postData.includes(operationName)) {
                    return response.url().includes("/graphql") && response.status() === 200;
                }
            }
            return false;
        }),
        actionCallback(),
    ]);

    const request = response.request();
    const postData = request?.postData();

    if (postData) {
        try {
            const parsedData = JSON.parse(postData);
            return parsedData;
        } catch (error) {
            return null;
        }
    }
    return null;
};

export async function authenticateUser(page: Page, email: string) {
    await page.goto("/");
    await page.getByPlaceholder("Enter your email").fill(email);
    await page.getByRole("button", { name: /Continue with email/i }).click();
    await page.waitForURL(`/auth/magic-sign-in/?email=${encodeURIComponent(email)}`);
    await page.getByRole("button", { name: /enter code manually/i }).click();
    await page.fill('input[name="code"]', e2eTestToken);
    await page.getByRole("button", { name: /continue/i }).click();
    await page.waitForURL((url) => {
        return (
            ROUTES.PATTERNS.ONBOARDING_URL.test(url.pathname) ||
            url.pathname === ROUTES.WORKSPACE.CREATE ||
            ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname)
        );
    });
}

export function extractWorkspaceAndProjectSlugs(url: string) {
    const pathname = new URL(url).pathname;
    const workspaceSlug = pathname.split("/")[1];
    const projectSlug = pathname.split("/")[3];
    return { workspaceSlug, projectSlug };
}

export async function saveUserDetails(page: Page, storageFile: string, url) {
    const { workspaceSlug, projectSlug } = extractWorkspaceAndProjectSlugs(url);
    const details = { workspaceSlug, projectSlug };
    fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");
    await page.context().storageState({ path: storageFile });
    console.log({ workspaceSlug }, { projectSlug });
}
export async function saveSurveyMakerDetails(page: Page, storageFile: string, url) {
    const { workspaceSlug, projectSlug } = extractWorkspaceAndProjectSlugs(url);
    const details = { workspaceSlug, projectSlug };
    fs.writeFileSync(surveyMakerDetailsFile, JSON.stringify(details), "utf-8");
    await page.context().storageState({ path: storageFile });
    console.log({ workspaceSlug }, { projectSlug });
}

export const gotoSurvey = async (page: Page, workspaceSlug: string, projectSlug: string, surveySlug: string) => {
    await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));
    await page.waitForURL((url) => {
        return ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname);
    });
};

export const createQuestion = async (page: Page, questionType: string) => {
    await page.getByTestId("add-question").click();
    await waitForResponse(page, "SurveyQuestionCreate", async () => {
        await page.getByTestId(questionType).click();
    });
    await waitForResponse(page, "SurveyQuestionUpdate", async () => {
        await page.locator(".ql-editor").fill("Hello");
    });
    await page.getByTestId("add-description-btn").click();
    await waitForResponse(page, "SurveyQuestionUpdate", async () => {
        await page.locator(".ql-editor").last().fill("Hi there");
    });
};
