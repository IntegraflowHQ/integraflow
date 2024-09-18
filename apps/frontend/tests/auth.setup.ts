import { faker } from "@faker-js/faker";
import { expect, Page, test as setup } from "@playwright/test";
import fs from "fs";
import {
    NEW_USER_FILE,
    NON_ONBOARDED_USER_FILE,
    ONBOARDED_USER_FILE,
    ROUTES,
    userDetailsFile,
} from "./utils/constants";

const e2eTestToken = "e2e_test_token";

async function authenticateUser(page: Page, email: string) {
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

setup("authenticate as new user", async ({ page }) => {
    await authenticateUser(page, "new-user@example.com");

    await page.waitForURL("/create-workspace");
    await expect(page).toHaveURL("/create-workspace");
    await expect(page.locator("h3")).toContainText("Create a new workspace");

    await page.context().storageState({ path: NEW_USER_FILE });
});

setup("authenticate as onboarded user", async ({ page }) => {
    await authenticateUser(page, "onboarded22@example.com");

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
        await expect(page).toHaveURL(ROUTES.PATTERNS.ONBOARDING_URL);
        await handleOnboardingSteps(page);

        await expect(page).toHaveURL(ROUTES.PATTERNS.SURVEY_LIST_URL);
        await expect(page.getByRole("button", { name: /Create new survey/i }).last()).toBeVisible();

        const url = new URL(page.url());

        const workspaceSlug = url.pathname.split("/")[1];
        const projectSlug = url.pathname.split("/")[3];
        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");
        await page.context().storageState({ path: ONBOARDED_USER_FILE });
    } else if (ROUTES.PATTERNS.SURVEY_LIST_URL.test(currentUrl)) {
        await expect(page).toHaveURL(ROUTES.PATTERNS.SURVEY_LIST_URL);
        await expect(page.getByRole("button", { name: /Create new survey/i }).last()).toBeVisible();

        const url = new URL(page.url());

        const workspaceSlug = url.pathname.split("/")[1];
        const projectSlug = url.pathname.split("/")[3];
        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");
        await page.context().storageState({ path: ONBOARDED_USER_FILE });
    } else {
        throw new Error(`Unexpected URL: ${currentUrl}`);
    }
});

setup("authenticate as non onboarded user", async ({ page }) => {
    await authenticateUser(page, "test2@example.com");

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

        await page.waitForURL((url) => ROUTES.PATTERNS.ONBOARDING_URL.test(url.pathname));
        await expect(page).toHaveURL(ROUTES.PATTERNS.ONBOARDING_URL);

        await expect(page.locator("h1").nth(0)).toContainText("Getting started");
        await page.context().storageState({ path: NON_ONBOARDED_USER_FILE });
    } else if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        await expect(page).toHaveURL(ROUTES.PATTERNS.ONBOARDING_URL);
        await expect(page.locator("h1").nth(0)).toContainText("Getting started");
        await page.context().storageState({ path: NON_ONBOARDED_USER_FILE });
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

    await page.waitForURL((url) => ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));
}
