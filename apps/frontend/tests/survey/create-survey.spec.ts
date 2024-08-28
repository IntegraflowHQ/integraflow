import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";

test.describe("Create survey", () => {
    test("should allow user to create a survey", async ({ page }) => {
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        const workspaceSlug = details.workspaceSlug;
        const projectSlug = details.projectSlug;

        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));
        await expect(page.getByRole("button", { name: /Create new survey/i }).last()).toBeVisible();
        await page
            .getByRole("button", { name: /Create new survey/i })
            .last()
            .click();

        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));
        await expect(page.getByRole("tab", { name: "Create" })).toBeVisible();
    });
});
