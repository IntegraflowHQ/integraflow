import test, { expect } from "@playwright/test";
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

        await createQuestion(page, "Text answer", { label: "Question two" }); //02

        await createQuestion(page, "Text answer", { label: "Question three" }); //03

        await createQuestion(page, "Text answer", { label: "Question four" }); //04

        await createQuestion(page, "Text answer", { label: "Question five" }); //04

        await createQuestion(page, "Thank you", { label: "Thank you. Question six" }); //05
    });
    test("should allow user to update question logic", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("question-trigger").nth(1).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "answer contains" }).click();
        await page.getByTestId("value-indicator").click();
        await page.locator(".react-select__input").focus();
        await page.locator(".react-select__input").fill("Hello");
        await page.keyboard.press("Enter");
        await page.getByText("Add logic").click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "question is not answered" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Thank you" }).click();

        await page.getByTestId("question-trigger").nth(2).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "answer does not contain" }).click();
        await page.getByTestId("value-indicator").click();
        await page.locator(".react-select__input").focus();
        await page.locator(".react-select__input").fill("Hello");
        await page.keyboard.press("Enter");
        await page.getByText("Add logic").click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Thank you" }).click();

        await page.getByTestId("question-trigger").nth(3).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "question is answered" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();
    });

    test("should verify ANSWER_CONTAINS logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("textarea-box").fill("hello there");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await expect(iframe.getByText("Question four")).toBeVisible();
    });

    test("should verify QUESTION_IS_NOT_ANSWERED logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await expect(iframe.getByText("Thank you")).toBeVisible();
    });

    test("should verify ANSWER_DOES_NOT_CONTAIN logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("textarea-box").fill("hey there");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("textarea-box").fill("hi there");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await expect(iframe.getByText("Thank you")).toBeVisible();
    });

    test("should verify QUESTION_IS_ANSWERED logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("textarea-box").fill("hey there");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("textarea-box").fill("hello there");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("textarea-box").fill("hello there");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await expect(iframe.getByText("Question one")).toBeVisible();
    });
});
