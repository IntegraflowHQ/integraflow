import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../../utils/helper";
import { setupQuestion } from "../../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE, viewport: { width: 1800, height: 1080 } });

test.describe.serial("Create survey and verify web-sdk position settings", () => {
    let workspaceSlug, projectSlug, surveySlug;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to edit and update question", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();
        await createQuestion(page, "Welcome message", { label: "Question one" });

        await page.getByTestId("Distribute-tab").click();
        await page.getByRole("tab", { name: "Web SDK" }).click();

        await page.waitForTimeout(1000);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).click();

        const surveyCard = iframe.locator("#integraflow-content-wrapper");

        await page.getByTestId("topRight-position").click();
        await page.waitForTimeout(1000);
        await expect(surveyCard).toHaveClass(/top-5 right-5/);

        await page.getByTestId("topLeft-position").click();
        await page.waitForTimeout(1000);
        await expect(surveyCard).toHaveClass(/top-5 left-5/);

        await page.getByTestId("center-position").click();
        await page.waitForTimeout(1000);
        await expect(surveyCard).toHaveClass(/left-1\/2 top-1\/2/);

        await page.getByTestId("bottomRight-position").click();
        await page.waitForTimeout(1000);
        await expect(surveyCard).toHaveClass(/bottom-5 right-5/);

        await page.getByTestId("bottomLeft-position").click();
        await page.waitForTimeout(1000);
        await expect(surveyCard).toHaveClass(/bottom-5 left-5/);
    });
});
