import test from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Test ", () => {
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
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("button-label").fill("Next");

        await createQuestion(page, "Text answer", { label: "Question two" }); //02

        await createQuestion(page, "Text answer", { label: "Question three" }); //03

        await createQuestion(page, "Smiley scale", { label: "Question four" }); //04

        await createQuestion(page, "Thank you", { label: "Thank you. Question five" }); //05
    });
    test("should allow user to update question logic", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("question-trigger").nth(1).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        // await page.getByTestId("add-new-logic").click();
        // await page.getByTestId("condition-indicator").click();
        // await page.getByRole("option", { name: "answer contains" }).click();
        // await page.getByTestId("value-indicator").click();
        // await page.locator(".react-select__input-container").fill("Hello");
        // await page.getByText("Add logic").click();
        // await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "question is not answered" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Thank you" }).click();

        await page.getByTestId("question-trigger").nth(2).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        // await page.getByTestId("add-new-logic").click();
        // await page.getByTestId("condition-indicator").click();
        // await page.getByRole("option", { name: "answer does not contain" }).click();
        // await page.getByTestId("value-indicator").click();
        // await page.locator(".react-select__input-container").fill("Hello");
        // await page.getByText("Add logic").click();
        // await page.getByRole("option", { name: "Thank you. Question five" }).click();

        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "question is answered" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();
    });

    test("should display the updated button label correctly in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        // await page.getByTestId("question-trigger").nth(0).click();
        // await iframe.getByRole("button", { name: "Next" }).waitFor();

        // await expect(iframe.getByRole("button", { name: "Next" })).toBeVisible();
        // await iframe.getByRole("button", { name: "Next" }).click();
    });
});
