import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";

test.describe("Create survey", () => {
    let projectSlug;
    let workspaceSlug;
    test.beforeAll(async ({ browser }) => {
        // const context = await browser.newContext();
        // const page = await context.newPage();
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;
    });

    test("should allow user create a survey", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await expect(page.getByRole("button", { name: /Create new survey/i }).last()).toBeVisible();
        await page
            .getByRole("button", { name: /Create new survey/i })
            .last()
            .click();
        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));
        await page.locator('[name="title"]').fill(faker.word.noun(10));

        await expect(page.getByRole("tab", { name: "Create" })).toBeVisible();

        await expect(page.locator('[name="title"]')).toBeVisible();
    });
    test("should allow user to delete a survey", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page
            .getByRole("button", { name: /Create new survey/i })
            .last()
            .click();
        await page.locator('[name="title"]').fill(faker.word.noun(10));
        await expect(page.locator('[name="title"]')).toBeVisible();

        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));

        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        const initialCount = parseInt((await page.getByTestId("survey-count").textContent()) || "0", 10);

        await page.getByTestId("survey-dropdown-menu").first().click();
        await page.getByTestId("delete-survey").click();
        await page.getByTestId("confirm-delete-survey").click();

        const finalCount = parseInt((await page.getByTestId("survey-count").textContent()) || "0", 10);

        expect(finalCount).toBe(initialCount - 1);
    });
});
