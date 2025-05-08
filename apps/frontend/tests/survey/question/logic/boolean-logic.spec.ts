import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Edit questions and verify Boolean logic  ", () => {
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

        await createQuestion(page, "Boolean", { label: "Question two" }); //02

        await createQuestion(page, "Boolean", { label: "Question three" }); //03

        await createQuestion(page, "Thank you", { label: "Thank you. Question four" }); //04
    });
    test("should allow user to update question logic", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("question-trigger").nth(1).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is false" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is true" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();
    });

    test("should verify  IS_FALSE logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).waitFor();

        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("thumbs-down").click();
        await expect(iframe.getByText("Question four")).toBeVisible();
    });

    test("should verify  IS_TRUE logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).waitFor();

        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("thumbs-up").click();
        await expect(iframe.getByText("Question one")).toBeVisible();
    });
});
