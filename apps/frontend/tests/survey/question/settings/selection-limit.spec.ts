import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });
test.describe.serial("should allow full question editing and settings management", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to edit the question and update question settings", async ({ page }) => {
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
        await page.getByTestId("min-indicator").click();
        await page.getByRole("option", { name: "2" }).click();
        await page.getByTestId("max-indicator").click();
        await page.getByRole("option", { name: "3" }).click();
    });

    test("should verify question settings: selection limit", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);
        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await page.getByTestId("add-question").waitFor();

        // Verify that user cannot submit if they have selected less than 2 options
        await iframe.locator("label").filter({ hasText: "blue" }).click(); //first option

        // Check that the submit button is disabled when less than 2 options selected
        const submitButton = iframe.getByRole("button", { name: "Submit" });
        await expect(submitButton).toBeDisabled();

        // Select a second option to meet the lower limit of 2
        await iframe.locator("label").filter({ hasText: "white" }).click();

        // Verify that the submit button is now enabled when 2 options are selected
        await expect(submitButton).toBeEnabled();

        await iframe.locator("label").filter({ hasText: "green" }).click(); // Third option

        // Verify the submit button remains enabled with the valid number of selections
        await expect(submitButton).toBeEnabled();

        // Attempt to select more than the allowed limit (there is a limit of 3)
        await iframe.locator("label").filter({ hasText: "red" }).click(); // Fourth option

        // Verify that no more than 3 options can be selected
        await expect(submitButton).toBeDisabled();
    });
});
