import test from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";
import { waitForResponse } from "../utils/helper";

test.describe("Manage workspace", () => {
    let workspaceSlug;
    let projectSlug;

    test.beforeEach(async () => {
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;
    });
    test("should redirect user to new workspace invitation", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.getByTestId("invite-team-btn").waitFor();
        await page.getByTestId("invite-team-btn").click();

        await page.getByTestId("toggle-invite-type").click();

        await page.getByTestId("invite-link").waitFor();
        const url = await page.getByTestId("invite-link").inputValue();

        await waitForResponse(page, "organizationInviteDetails", async () => {
            await page.goto(url);
        });

        await page.getByRole("button", { name: "Accept" }).waitFor();
    });
});
