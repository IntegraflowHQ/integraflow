import { expect, test } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../utils/constants";
import { gotoSurvey, waitForResponse } from "../../utils/helper";
import { setupQuestion } from "../../utils/helper/questionSetup";
import { SurveyQuestionCreateInput } from "./../../../../../packages/client/dist/_generated_documents.d";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Create questions", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        test.setTimeout(120000);

        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow user to delete a question", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await page.getByTestId("add-question").click();
        const parsedPostData = await waitForResponse(page, "SurveyQuestionCreate", async () => {
            await page.getByTestId("Multiple answer selection").click();
        });
        const newQuestionId = (parsedPostData.variables.input as SurveyQuestionCreateInput).id;

        const questionElement = page.locator(`[data-testid="${newQuestionId}"]`);

        await questionElement.locator('[data-testid="delete-question"]').click();

        await expect(questionElement).toBeHidden();
    });
});
