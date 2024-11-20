import { faker } from "@faker-js/faker";
import { expect, Page, test as setup } from "@playwright/test";
import {
    NEW_USER_FILE,
    NON_ONBOARDED_USER_FILE,
    ONBOARDED_USER_FILE,
    ROUTES,
    userCredentials,
} from "./utils/constants";
import { authenticateUser, saveUserDetails } from "./utils/helper";

setup("authenticate as new user", async ({ page }) => {
    await authenticateUser(page, userCredentials.NEW_USER_EMAIL);

    await page.waitForURL("/create-workspace");
    await expect(page).toHaveURL("/create-workspace");
    await expect(page.locator("h3")).toContainText("Create a new workspace");

    await page.context().storageState({ path: NEW_USER_FILE });
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

        await page.locator('[name="workspaceName"]').fill("onboarded");
        await page.locator('[name="workspaceUrl"]').fill("onboarded");
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL(ROUTES.PATTERNS.ONBOARDING_URL);
        await handleOnboardingSteps(page);
        await saveUserDetails(page, ONBOARDED_USER_FILE);
    } else if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        await handleOnboardingSteps(page);
        await saveUserDetails(page, ONBOARDED_USER_FILE);
    } else if (ROUTES.PATTERNS.SURVEY_LIST_URL.test(currentUrl)) {
        await saveUserDetails(page, ONBOARDED_USER_FILE);
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
        await saveUserDetails(page, NON_ONBOARDED_USER_FILE);
    } else if (ROUTES.PATTERNS.ONBOARDING_URL.test(currentUrl)) {
        await saveUserDetails(page, NON_ONBOARDED_USER_FILE);
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
