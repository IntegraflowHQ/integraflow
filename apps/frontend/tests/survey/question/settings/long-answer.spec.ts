import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });
test.describe.serial("Text answer length settings ", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to create and edit a text answer question", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();
        await createQuestion(page, "Text answer");
    });

    test("should display the long answer input box for a text answer question", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByTestId("textarea-box").waitFor();
        await expect(iframe.getByTestId("textarea-box")).toBeVisible();
    });
});
