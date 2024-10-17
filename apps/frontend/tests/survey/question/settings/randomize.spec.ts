import test, { expect } from "@playwright/test";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

async function getAnswersOrder(page) {
    const iframe = page.frameLocator('iframe[title="Survey preview"]');

    await iframe.locator("label").first().waitFor();

    const answers = await iframe.locator("label").allInnerTexts();
    return answers;
}

test.describe.serial("should allow full question editing and settings management", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to edit a single answer selection question and enable randomization", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Single answer selection");
        await page.getByPlaceholder("Answer 1").fill("green");
        await page.getByPlaceholder("Answer 2").fill("blue");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("red");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill("yellow");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 5").fill("white");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("randomize-answers").click();
    });

    test("should randomize answers when 'randomize answers' setting is enabled", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const firstRunOrder = await getAnswersOrder(page);

        await page.reload();

        const secondRunOrder = await getAnswersOrder(page);

        expect(firstRunOrder).not.toEqual(secondRunOrder);
    });
});
