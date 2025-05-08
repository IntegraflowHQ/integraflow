import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });
test.describe.serial("should allow button label edit", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should edit the question and update settings", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Boolean");

        await createQuestion(page, "Boolean");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("shape-indicator").click();
        await page.getByRole("option", { name: "Button" }).click();
    });

    test("should verify question settings: shape", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        const iframe = page.frameLocator('iframe[title="Survey preview"]');
        await page.getByTestId("add-question").waitFor();

        await iframe.getByTestId("thumbs-up").first().waitFor();
        await expect(iframe.getByTestId("thumbs-up").first()).toBeVisible();
        await expect(iframe.getByTestId("thumbs-down").first()).toBeVisible();

        await page.getByTestId("question-trigger").nth(1).click();
        await iframe.getByText("Good").waitFor();
        await expect(iframe.getByText("Good")).toBeVisible();
        await expect(iframe.getByText("Bad")).toBeVisible();
    });
});
