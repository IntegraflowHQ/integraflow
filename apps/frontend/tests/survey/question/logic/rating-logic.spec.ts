import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Edit questions and verify Rating logic  ", () => {
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

        await createQuestion(page, "Rating scale", { label: "Question two" }); //02

        await createQuestion(page, "Rating scale", { label: "Question three" }); //03

        await createQuestion(page, "Rating scale", { label: "Question four" }); //04

        await createQuestion(page, "Rating scale", { label: "Question five" }); //05

        await createQuestion(page, "Thank you", { label: "Thank you. Question six" }); //06
    });
    test("should allow user to update question logic", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("question-trigger").nth(1).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is", exact: true }).click();
        await page.getByTestId("value-indicator").click();
        await page.getByRole("option", { name: "1" }).click();
        await page.getByText("Add logic").click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is between" }).click();
        await page.getByTestId("min-indicator").click();
        await page.getByRole("option", { name: "2" }).click();
        await page.getByTestId("max-indicator").click();
        await page.getByRole("option", { name: "4" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();

        await page.getByTestId("question-trigger").nth(2).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "is not" }).click();
        await page.getByTestId("value-indicator").click();
        await page.getByRole("option", { name: "2" }).click();
        await page.getByText("Add logic").click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();

        await page.getByTestId("question-trigger").nth(3).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "has any value" }).click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();
    });

    test("should verify  IS logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await iframe.getByRole("button", { name: "Submit" }).waitFor();

        await iframe.getByRole("button", { name: "Submit" }).click();
        await iframe.getByTestId("star").nth(0).click();
        await expect(iframe.getByText("Question four")).toBeVisible();
    });

    test("should verify  IS_BETWEEN logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await page.waitForTimeout(3000);

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();

        await iframe.getByTestId("star").nth(2).click();
        await expect(iframe.getByText("Question one")).toBeVisible();
    });

    test("should verify  IS_NOT logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await page.waitForTimeout(3000);

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();

        await iframe.getByTestId("star").nth(4).click();
        await iframe.getByTestId("star").nth(0).click();
        await expect(iframe.getByText("Question one")).toBeVisible();
    });

    test("should verify  HAS_ANY_VALUE logic in the survey preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await page.waitForTimeout(3000);

        await iframe.getByRole("button", { name: "Submit" }).waitFor();
        await iframe.getByRole("button", { name: "Submit" }).click();

        await iframe.getByTestId("star").nth(4).click();
        await iframe.getByTestId("star").nth(1).click();
        await iframe.getByTestId("star").nth(1).click();
        await expect(iframe.getByText("Question one")).toBeVisible();
    });
});
