import { faker } from "@faker-js/faker";
import test, { expect } from "@playwright/test";
import fs from "fs";
import slugify from "slugify";
import { ONBOARDED_USER_FILE, ROUTES, userDetailsFile } from "../utils/constants";
import { saveUserDetails, waitForResponse } from "./../utils/helper";

test.describe("Update workspace", () => {
    let projectSlug;
    let workspaceSlug;
    test.beforeEach(async () => {
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;
    });

    test("should allow user to update Workspace fields", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.getByTestId("profile-btn").waitFor();
        await page.getByTestId("profile-btn").click();

        await page.getByTestId("workspace-settings-btn").click();

        await page.waitForURL((url) => ROUTES.PATTERNS.WORKSPACE_SETTINGS.test(url.pathname));

        const prevName = await page.getByTestId("workspace-name").inputValue();
        const prevUrl = await page.getByTestId("workspace-url").inputValue();

        await page.getByTestId("workspace-name").fill(faker.company.buzzAdjective());
        await page.getByTestId("workspace-url").fill(slugify(faker.food.dish()).toLocaleLowerCase());

        await waitForResponse(page, "organizationUpdate", async () => {
            await page.getByRole("button", { name: "Update" }).click();
        });

        await page.reload();

        const url = new URL(page.url());

        await saveUserDetails(page, ONBOARDED_USER_FILE, url);
        await page.getByTestId("workspace-name").waitFor();

        const newName = await page.getByTestId("workspace-name").inputValue();
        const newUrl = await page.getByTestId("workspace-url").inputValue();
        expect(prevName).not.toBe(newName);
        expect(prevUrl).not.toBe(newUrl);
    });
    test("should allow user to refresh workspace invite link", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.getByTestId("invite-team-btn").waitFor();
        await page.getByTestId("invite-team-btn").click();

        await page.getByTestId("toggle-invite-type").click();

        await page.getByTestId("invite-link").waitFor();
        const prevLink = await page.getByTestId("invite-link").inputValue();

        await waitForResponse(page, "organizationInviteLinkReset", async () => {
            await page.getByTestId("refresh-invite-link").click();
        });

        const newLink = await page.getByTestId("invite-link").inputValue();
        expect(prevLink).not.toBe(newLink);
    });
});
