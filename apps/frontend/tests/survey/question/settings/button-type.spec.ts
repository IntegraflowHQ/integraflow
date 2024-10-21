import test, { expect } from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey, waitForResponse } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Survey button type settings", () => {
    let workspaceSlug: string, projectSlug: string, surveySlug: string;

    test.beforeAll(async ({ browser }) => {
        const setup = await setupQuestion(browser);
        workspaceSlug = setup.workspaceSlug;
        projectSlug = setup.projectSlug;
        surveySlug = setup.surveySlug;
    });

    test("should allow creating and editing the first question to hide the submit button", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await createQuestion(page, "Thank you");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("button-type-indicator").click();
        await page.getByRole("option", { name: "hidden" }).click();
    });

    test("should hide the submit button when 'button type' is set to hidden", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();
        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        await expect(iframe.getByRole("button", { name: "Submit" })).toBeHidden();
    });

    test("should allow creating and editing the second question to set 'button type' as link", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();

        await page.getByTestId("delete-question").click();

        await createQuestion(page, "Thank you");

        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("button-type-indicator").click();
        await page.getByRole("option", { name: "link" }).click();
        await waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.getByTestId("button-link").fill("https://youtube.com/");
        });
    });

    test("should open the correct link when 'button type' is set to link", async ({ page }) => {
        gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("add-question").waitFor();
        const iframe = page.frameLocator('iframe[title="Survey preview"]');

        const popupPromise = page.waitForEvent("popup");
        await iframe.getByRole("button", { name: "Submit" }).click();
        const popup = await popupPromise;
        expect(popup.url()).toBe("https://www.youtube.com/");
    });
});
