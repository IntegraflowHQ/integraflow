import test, { expect } from "@playwright/test";
import fs from "fs";
import { UserDetails } from "../types";
import { ONBOARDED_USER_FILE, ROUTES, userCredentials, userDetailsFile } from "../utils/constants";
import { authenticateUser, waitForResponse } from "../utils/helper";

test.describe.serial("Logout user", () => {
    let existingWorkspaceSlug;
    let existingProjectSlug;

    test.beforeAll(async () => {
        const details: UserDetails = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        existingWorkspaceSlug = details.workspaceSlug;
        existingProjectSlug = details.projectSlug;
    });

    test("should allow user to log out", async ({ page }) => {
        test.skip(!existingWorkspaceSlug || !existingProjectSlug, "Skipping because no user has authenticated yet");

        await page.goto(ROUTES.SURVEY.LIST(existingWorkspaceSlug, existingProjectSlug));

        await page.waitForURL((url) => {
            return ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname);
        });

        await page.getByTestId("profile-btn").waitFor();
        await page.getByTestId("profile-btn").click();

        await waitForResponse(page, "logout", async () => {
            await page.getByTestId("logout").click();
        });

        await page.waitForURL((url) => url.pathname === "/");
        await page.getByText(/Log in to Integraflow/i).waitFor();
        await page.context().storageState({ path: ONBOARDED_USER_FILE });
    });

    test("should login to previous workspace and project", async ({ page }) => {
        await authenticateUser(page, userCredentials.ONBOARDED_USER_EMAIL);

        const url = new URL(page.url());

        expect(url.pathname).toBe(ROUTES.SURVEY.LIST(existingWorkspaceSlug, existingProjectSlug));
        await page.context().storageState({ path: ONBOARDED_USER_FILE });
    });
});
