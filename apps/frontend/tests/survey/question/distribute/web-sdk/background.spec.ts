import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../../utils/helper";
import { setupQuestion } from "../../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE, viewport: { width: 1800, height: 1080 } });

test.describe.serial("Create survey and verify web-sdk background", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to edit and update question", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Welcome message", { label: "Question one" }); //01

        await page.getByTestId("Distribute-tab").click();
        await page.getByRole("tab", { name: "Web SDK" }).click();

        await page.waitForTimeout(3000);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).waitFor();

        await page.getByTestId("Light-overlay").click();
        await expect(iframe.locator("#light-overlay")).toBeVisible();

        await page.getByTestId("Dark-overlay").click();
        await expect(iframe.locator("#dark-overlay")).toBeVisible();

        await page.getByTestId("None-overlay").click();
        await expect(iframe.locator("#dark-overlay")).toBeHidden();
    });
});
