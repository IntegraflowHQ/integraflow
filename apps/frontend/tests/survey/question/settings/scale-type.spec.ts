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

    test("should allow users to edit and update question settings", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Rating scale"); //01

        await createQuestion(page, "Rating scale"); //02
        await page.getByTestId("scale-style-indicator").click();
        await page.getByRole("option", { name: "numerical" }).click();

        await createQuestion(page, "Rating scale"); //03
        await page.getByTestId("scale-style-indicator").click();
        await page.getByRole("option", { name: "classic csat" }).click();

        await createQuestion(page, "Rating scale"); //04
        await page.getByTestId("scale-style-indicator").click();
        await page.getByRole("option", { name: "ces" }).click();
    });

    test("should verify question settings: scale style", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);
        await page.getByTestId("add-question").waitFor();

        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await expect(iframe.getByTestId("star").first()).toBeVisible();

        await page.getByTestId("question-trigger").nth(1).click();
        await expect(iframe.getByText("2")).toBeVisible();

        await page.getByTestId("question-trigger").nth(2).click();
        await expect(iframe.getByText("Very unsatisfied")).toBeVisible();

        await page.getByTestId("question-trigger").nth(3).click();
        await expect(iframe.getByText("Strongly disagree")).toBeVisible();
    });
});
