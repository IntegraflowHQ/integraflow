import test, { expect } from "@playwright/test";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.describe.serial("should allow full question editing and settings management", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to edit the question", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Text answer");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("toggle-answer-length").click();
    });

    test("should allow users to update question settings: short answer", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await iframe.getByTestId("input-box").waitFor();

        await expect(iframe.getByTestId("input-box")).toBeVisible();
    });
});
