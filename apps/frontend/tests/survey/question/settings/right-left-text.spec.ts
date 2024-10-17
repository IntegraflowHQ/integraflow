import test, { expect } from "@playwright/test";
import { createQuestion, gotoSurvey, waitForResponse } from "../../../utils/helper";
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

        await createQuestion(page, "Smiley scale");

        await page.getByRole("tab", { name: "Settings" }).click();

        await waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.getByTestId("left-text").fill("Negative");
        });

        await waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.getByTestId("right-text").fill("Positive");
        });
    });

    test("should allow users to update question settings: right text and left text", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByText("Positive").waitFor();
        await expect(iframe.getByText("Positive")).toBeVisible();
        await expect(iframe.getByText("Negative")).toBeVisible();
        await iframe.getByText("Positive").click();
        await iframe.getByText("Negative").click();
    });
});
