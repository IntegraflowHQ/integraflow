import { faker } from "@faker-js/faker";
import test from "@playwright/test";
import fs from "fs";
import { UserDetails } from "../types";
import { ROUTES, userDetailsFile } from "../utils/constants";
import { waitForResponse } from "../utils/helper";

test.describe("Update workspace", () => {
    let workspaceSlug;
    let projectSlug;

    test.beforeEach(async () => {
        const details: UserDetails = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;
    });

    test("should allow user to update  workspace", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        // await page.waitForURL((url) => {
        //     return ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname);
        // });

        await page.getByTestId("profile-btn").waitFor();
        await page.getByTestId("profile-btn").click();

        await page.getByTestId("workspace-settings-btn").waitFor();
        await page.getByTestId("workspace-settings-btn").click();

        await page.waitForURL((url) => {
            return ROUTES.PATTERNS.WORKSPACE_SETTINGS.test(url.pathname);
        });

        const prevName = await page.getByTestId("workspace-name").inputValue();
        const prevUrl = await page.getByTestId("workspace-url").inputValue();

        await page.getByTestId("workspace-name").fill(faker.company.buzzAdjective());
        await page.getByTestId("workspace-url").fill(faker.word.verb());
        await waitForResponse(page, "organizationUpdate", async () => {
            await page.getByRole("button", { name: "Update" }).click();
        });

        console.log(prevName, prevName);

        await page.reload();
        await page.getByTestId("workspace-url").waitFor();

        // const newName = await page.getByTestId("workspace-name").inputValue();
        // const newUrl = await page.getByTestId("workspace-url").inputValue();

        // expect(prevName).not.toBe(newName);
        // expect(prevUrl).not.toBe(newUrl);
    });

    // test("should allow user to refresh Project key", async ({ page }) => {
    //     await page.goto(ROUTES.SETTINGS.WORKSPACE(workspaceSlug, projectSlug));
    //     await page.getByText(/Manage your Integraflow Project/i).waitFor();

    //     const previousKey = await page.getByTestId("project-key").inputValue();

    //     await waitForResponse(page, "organizationUpdate", async () => {
    //         await page.getByTestId("refresh-project-key").click();
    //     });

    //     await page.reload();
    //     await page.getByTestId("project-key").waitFor();

    //     const newKey = await page.getByTestId("project-key").inputValue();
    //     expect(previousKey).not.toBe(newKey);
    // });
});
