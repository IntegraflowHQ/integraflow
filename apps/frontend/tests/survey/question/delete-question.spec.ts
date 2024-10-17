import { expect, test } from "@playwright/test";
import { SurveyQuestionCreateInput } from "../../../../../packages/client/src/_generated_documents";
import { ROUTES } from "../../utils/constants";
import { waitForResponse } from "../../utils/helper";
import { setupQuestion } from "../../utils/helper/questionSetup";

test.describe.serial("Create questions", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow user to delete a question", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));

        await page.getByTestId("add-question").waitFor();

        await page.getByTestId("add-question").click();
        const parsedPostData = await waitForResponse(page, "SurveyQuestionCreate", async () => {
            await page
                .locator("div")
                .filter({ hasText: /^Multiple answer selection$/ })
                .click();
        });
        const newQuestionId = (parsedPostData.variables.input as SurveyQuestionCreateInput).id;

        const questionElement = page.locator(`[data-testid="${newQuestionId}"]`);

        await questionElement.locator('[data-testid="delete-question"]').click();

        await expect(questionElement).toBeHidden();
    });
});
