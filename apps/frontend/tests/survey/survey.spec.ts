import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";
import { waitForResponse } from "../utils/helper";

test.describe("Create survey", () => {
    let projectSlug;
    let workspaceSlug;
    test.beforeEach(async () => {
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;
    });

    test("should allow user create a survey", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.getByTestId("create-survey").waitFor();
        await page.getByTestId("create-survey").click();
        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));
        await page.locator('[name="title"]').waitFor();
        await page.locator('[name="title"]').fill(faker.word.noun(10));

        await expect(page.getByRole("tab", { name: "Create" })).toBeVisible();
    });

    test("should allow user to delete a survey", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        const surveyTitle = faker.word.noun(10);

        await page.getByTestId("create-survey").waitFor();
        await page.getByTestId("create-survey").click();
        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));
        await page.locator('[name="title"]').waitFor();
        await page.locator('[name="title"]').fill(surveyTitle);

        await waitForResponse(page, "SurveyUpdate", async () => {
            await page.locator('[name="title"]').fill(surveyTitle);
        });

        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.waitForURL((url) => ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));

        await page.getByTestId(surveyTitle).waitFor();

        const surveyElement = page.locator(`[data-testid="${surveyTitle}"]`);
        await surveyElement.locator('[data-testid="survey-dropdown-menu"]').click();

        await page.getByTestId("delete-survey").click();

        await waitForResponse(page, "SurveyDelete", async () => {
            await page.getByTestId("confirm-delete-survey").click();
        });

        await page.getByTestId("create-survey").waitFor();

        await expect(surveyElement).toBeHidden();
    });
});
