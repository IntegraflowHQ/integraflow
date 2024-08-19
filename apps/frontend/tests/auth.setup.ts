import { expect, Page, test as setup } from "@playwright/test";
import { NEW_USER_FILE, NON_ONBOARDED_USER_FILE, ONBOARDED_USER_FILE } from "./utils/constants";

const e2eTestToken = "e2e_test_token";

const createWorkspaceUrl = "/create-workspace";
const onboardingUrl = /\/[\w-]+\/projects\/[\w-]+\/get-started/;
const surveyListUrl = /\/onboarded\/projects\/[\w-]+\/surveys/;

async function authenticateUser(page: Page, email: string, stateFile: string) {
    await page.goto("/");
    await page.getByPlaceholder("Enter your email").fill(email);
    await page.getByRole("button", { name: /Continue with email/i }).click();
    await page.waitForURL(`/auth/magic-sign-in/?email=${encodeURIComponent(email)}`);
    await page.getByRole("button", { name: /enter code manually/i }).click();
    await page.fill('input[name="code"]', e2eTestToken);
    await page.getByRole("button", { name: /continue/i }).click();

    await page.context().storageState({ path: stateFile });
}

setup("authenticate as new user", async ({ page }) => {
    await authenticateUser(page, "new-user@example.com", NEW_USER_FILE);

    await page.waitForURL("/create-workspace");
    await expect(page).toHaveURL("/create-workspace");
    await expect(page.locator("h3")).toContainText("Create a new workspace");
});

setup("authenticate as onboarded user", async ({ page }) => {
    await authenticateUser(page, "onboarded@example.com", ONBOARDED_USER_FILE);

    // Wait for the navigation to complete to one of the expected URLs
    await page.waitForURL(
        (url) => {
            return (
                onboardingUrl.test(url.pathname) ||
                url.pathname === createWorkspaceUrl ||
                surveyListUrl.test(url.pathname)
            );
        },
        { waitUntil: "load" },
    );

    const currentUrl = page.url();

    if (currentUrl.includes(createWorkspaceUrl)) {
        await expect(page).toHaveURL(createWorkspaceUrl);
        await expect(page.locator("h3")).toContainText("Create a new workspace");

        await page.locator('[name="workspaceName"]').fill("onboarded");
        await page.locator('[name="workspaceUrl"]').fill("onboarded");
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL(onboardingUrl);
        await expect(page).toHaveURL(onboardingUrl);
        await handleOnboardingSteps(page);
    } else if (surveyListUrl.test(currentUrl)) {
        await expect(page).toHaveURL(surveyListUrl);
    } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
    }
});

setup("authenticate as non onboarded user", async ({ page }) => {
    await authenticateUser(page, "test2@example.com", NON_ONBOARDED_USER_FILE);

    await page.waitForURL(
        (url) => {
            return onboardingUrl.test(url.pathname) || url.pathname === createWorkspaceUrl;
        },
        { waitUntil: "load" },
    );

    const currentUrl = page.url();

    if (currentUrl.includes(createWorkspaceUrl)) {
        await expect(page).toHaveURL(createWorkspaceUrl);
        await expect(page.locator("h3")).toContainText("Create a new workspace");

        await page.locator('[name="workspaceName"]').fill("test2");
        await page.locator('[name="workspaceUrl"]').fill("test2");
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL(onboardingUrl);
        await expect(page).toHaveURL(onboardingUrl);
        await expect(page.locator("h1").nth(0)).toContainText("Getting started");
    } else if (onboardingUrl.test(currentUrl)) {
        await expect(page).toHaveURL(onboardingUrl);
        await expect(page.locator("h1").nth(0)).toContainText("Getting started");
    } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
    }
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

    await page.waitForURL(/\/onboarded\/projects\/[\w-]+\/surveys/);
}
