import test, { expect, Page } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

async function getAnswersOrder(page: Page) {
    const iframe = page.frameLocator('iframe[title="Survey preview"]');
    await iframe.locator("label").first().waitFor();
    const answers = await iframe.locator("label").allInnerTexts();
    return answers;
}

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Question editing and randomized settings management", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to create a multiple-answer question and randomize answers except last answer", async ({
        page,
    }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Multiple answer selection");
        await page.getByPlaceholder("Answer 1").fill("green");
        await page.getByPlaceholder("Answer 2").fill("blue");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("red");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill("yellow");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 5").fill("white");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("randomize-except-last").click();
    });

    test("should randomize answers except the last one", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const firstRunOrder = await getAnswersOrder(page);

        await page.reload();

        const secondRunOrder = await getAnswersOrder(page);

        const firstRunLast = firstRunOrder[firstRunOrder.length - 1];
        const secondRunLast = secondRunOrder[secondRunOrder.length - 1];

        // Verify that the last answer remains the same
        expect(firstRunLast).toEqual(secondRunLast);
    });
});
