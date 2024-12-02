import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Edit questions and verify Form logic  ", () => {
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

        await createQuestion(page, "Contact form", { label: "Question two" }); //02

        await createQuestion(page, "Contact form", { label: "Question three" }); //03

        await createQuestion(page, "Contact form", { label: "Question four" }); //04

        await createQuestion(page, "Thank you", { label: "Thank you. Question five" }); //05
    });
    test("should allow user to update question logic", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("question-trigger").nth(1).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("value-indicator").click();
        await page.getByRole("option", { name: "First name" }).click();
        await page.getByRole("option", { name: "Last name" }).click();
        await page.getByText("Add logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is filled in" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("question-trigger").nth(2).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("value-indicator").click();
        await page.getByRole("option", { name: "First name" }).click();
        await page.getByRole("option", { name: "Last name" }).click();
        await page.getByText("Add logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is not filled in" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();
    });

    test("should verify  IS_FILLED_IN logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).waitFor();

        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByLabel("First name").fill("integra");
        await iframe.getByLabel("Last name").fill("flow");
        await iframe.getByRole("button", { name: "Submit" }).click();
        await expect(iframe.getByText("Question four")).toBeVisible();
    });

    test("should verify  IS_NOT_FILLED_IN logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).waitFor();

        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByRole("button", { name: "Submit" }).click();
        await expect(iframe.getByText("Question one")).toBeVisible();
    });
});
