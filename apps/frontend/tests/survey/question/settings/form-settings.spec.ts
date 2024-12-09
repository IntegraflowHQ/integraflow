import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Survey question editing and settings update", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow users to create and edit a question with consent and disclaimer settings", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Contact form");
        await page.getByTestId("add-next-field-btn").click();
        await page.getByTestId("form-type-indicator").last().click();
        await page.getByRole("option", { name: "Email" }).click();

        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("toggle-disclaimer").click();
        await page.getByTestId("disclaimer-content").fill("This is a disclaimer");
        await page.getByTestId("toggle-consent-box").click();
        await page.getByTestId("consent-label").fill("This is a consent text");
    });

    test("should display and interact with the consent checkbox in the preview", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await page.getByTestId("add-question").waitFor();
        await expect(iframe.getByRole("checkbox", { name: "This is a consent text" })).toBeVisible();
        await iframe.getByRole("checkbox", { name: "This is a consent text" }).click();
    });
});
