import { faker } from "@faker-js/faker";
import { expect, Page, test as setup } from "@playwright/test";
import fs from "fs";
import {
    NEW_USER_FILE,
    NON_ONBOARDED_USER_FILE,
    ONBOARDED_USER_FILE,
    RESPONSE_CHECKER_USER_FILE,
    ROUTES,
    SURVEY_MAKER_FILE,
    surveyResponseDetailsFile,
    userCredentials,
} from "./utils/constants";
import { authenticateUser, saveSurveyMakerDetails, saveUserDetails } from "./utils/helper";

setup("authenticate as new user", async ({ page }) => {
    await authenticateUser(page, userCredentials.NEW_USER_EMAIL);

    await page.waitForURL("/create-workspace");
    await expect(page).toHaveURL("/create-workspace");
    await expect(page.locator("h3")).toContainText("Create a new workspace");

    await page.context().storageState({ path: NEW_USER_FILE });
});

setup("authenticate as survey maker", async ({ page }) => {
    await authenticateUser(page, userCredentials.SURVEY_MAKER);

    await page.waitForURL((url) => {
        return ROUTES.PATTERNS.ONBOARDING_URL.test(url.pathname) || url.pathname === ROUTES.WORKSPACE.CREATE;
    });

    const currentUrl = page.url();

    if (currentUrl.includes(ROUTES.WORKSPACE.CREATE)) {
        await expect(page).toHaveURL(ROUTES.WORKSPACE.CREATE);
        await expect(page.locator("h3")).toContainText("Create a new workspace");

        await page.locator('[name="workspaceName"]').fill("survey maker");
        await page.locator('[name="workspaceUrl"]').fill("survey-maker");
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL(ROUTES.PATTERNS.ONBOARDING_URL);
        const url = new URL(page.url());
        await page.getByRole("link", { name: "Surveys" }).click();
        await saveSurveyMakerDetails(page, SURVEY_MAKER_FILE, url);
    } else if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        await page.getByRole("link", { name: "Surveys" }).click();
        const url = new URL(page.url());
        await saveSurveyMakerDetails(page, SURVEY_MAKER_FILE, url);
    }
});

setup("authenticate as onboarded user", async ({ page }) => {
    await authenticateUser(page, userCredentials.ONBOARDED_USER_EMAIL);

    await page.waitForURL((url) => {
        return (
            ROUTES.PATTERNS.ONBOARDING_URL.test(url.pathname) ||
            url.pathname === ROUTES.WORKSPACE.CREATE ||
            ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname)
        );
    });

    const currentUrl = page.url();

    if (currentUrl.includes(ROUTES.WORKSPACE.CREATE)) {
        await expect(page).toHaveURL(ROUTES.WORKSPACE.CREATE);
        await expect(page.locator("h3")).toContainText("Create a new workspace");

        await page.locator('[name="workspaceName"]').fill("onboarded22");
        await page.locator('[name="workspaceUrl"]').fill("onboarded22");
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL(ROUTES.PATTERNS.ONBOARDING_URL);
        const url = new URL(page.url());
        await handleOnboardingSteps(page);
        await saveUserDetails(page, ONBOARDED_USER_FILE, url);
    } else if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        const url = new URL(page.url());
        await handleOnboardingSteps(page);
        await saveUserDetails(page, ONBOARDED_USER_FILE, url);
    } else if (ROUTES.PATTERNS.SURVEY_LIST_URL.test(currentUrl)) {
        const url = new URL(page.url());
        await saveUserDetails(page, ONBOARDED_USER_FILE, url);
    } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
    }
});

setup("authenticate as non onboarded user", async ({ page }) => {
    await authenticateUser(page, userCredentials.NON_ONBOARDED_USER_EMAIL);

    await page.waitForURL((url) => {
        return ROUTES.PATTERNS.ONBOARDING_URL.test(url.pathname) || url.pathname === ROUTES.WORKSPACE.CREATE;
    });

    const currentUrl = page.url();

    if (currentUrl.includes(ROUTES.WORKSPACE.CREATE)) {
        await expect(page).toHaveURL(ROUTES.WORKSPACE.CREATE);
        await expect(page.locator("h3")).toContainText("Create a new workspace");

        await page.locator('[name="workspaceName"]').fill(faker.word.words(2));
        await page.locator('[name="workspaceUrl"]').fill(`${faker.word.words(1)}-${faker.word.words(1)}`);
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL(ROUTES.PATTERNS.ONBOARDING_URL);
        const url = new URL(page.url());

        await saveUserDetails(page, NON_ONBOARDED_USER_FILE, url);
    } else if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        const url = new URL(page.url());
        await saveUserDetails(page, NON_ONBOARDED_USER_FILE, url);
    } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
    }
});

setup("authenticate as response validation user", async ({ page }) => {
    await authenticateUser(page, userCredentials.RESPONSE_CHECKER);
    const currentUrl = page.url();

    if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        const url = new URL(page.url());
        await saveUserDetails(page, RESPONSE_CHECKER_USER_FILE, url);
    } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
    }

    await page.getByRole("link", { name: "Surveys" }).click();

    await page.waitForURL((url) => ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));

    await page.getByText("Untitled Survey").last().waitFor();
    await page.getByText("Untitled Survey").last().click();

    await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));

    const url = new URL(page.url());
    // await saveUserDetails(page, RESPONSE_CHECKER_USER_FILE, url);

    const pathname = new URL(url).pathname;
    const workspaceSlug = pathname.split("/")[1];
    const projectSlug = pathname.split("/")[3];
    const surveySlug = pathname.split("/")[5];

    const details = { workspaceSlug, projectSlug, surveySlug };

    await page.getByRole("tab", { name: "Distribute" }).click();

    const surveyUrl = await page.getByRole("link").first().getAttribute("href");
    if (surveyUrl) {
        await page.goto(surveyUrl);
        fs.writeFileSync(surveyResponseDetailsFile, JSON.stringify({ surveyUrl, details }), "utf-8");
        await page.context().storageState({ path: RESPONSE_CHECKER_USER_FILE });
    } else {
        throw new Error("Distribute link not found!");
    }

    await page.getByText("Integraflow").click();
});

async function handleOnboardingSteps(page: Page) {
    const activeButton = page.locator('button[data-state="active"]');

    const steps = [
        /integrate sdk/i,
        /identify your users/i,
        /track your events/i,
        /publish your first survey/i,
        /connect your first integration/i,
    ];

    for (const step of steps) {
        await expect(activeButton).toContainText(step);
        await page.getByRole("button", { name: /skip/i }).click();
    }

    await page.waitForURL((url) => ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));
}
