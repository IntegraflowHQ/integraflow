import test from "@playwright/test";
import { SURVEY_MAKER_FILE } from "../../../utils/constants";
import { createQuestion, gotoSurvey } from "../../../utils/helper";
import { setupQuestion } from "../../../utils/helper/questionSetup";

test.use({ storageState: SURVEY_MAKER_FILE });

test.describe.serial("Edit questions and verify Multiple Answer Selection logic  ", () => {
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

        await createQuestion(page, "Multiple answer selection", { label: "Question two" });
        await page.getByPlaceholder("Answer 1").fill("green");
        await page.getByPlaceholder("Answer 2").fill("blue");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("red");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill("yellow");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 5").fill("white");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("randomize-answers").click();

        await createQuestion(page, "Boolean", { label: "Question two" }); //02

        await createQuestion(page, "Multiple answer selection", { label: "Question three" });
        await page.getByPlaceholder("Answer 1").fill("green");
        await page.getByPlaceholder("Answer 2").fill("blue");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("red");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill("yellow");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 5").fill("white");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("randomize-answers").click();

        await createQuestion(page, "Boolean", { label: "Question four" }); //02

        await createQuestion(page, "Multiple answer selection", { label: "Question five" });
        await page.getByPlaceholder("Answer 1").fill("green");
        await page.getByPlaceholder("Answer 2").fill("blue");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("red");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill("yellow");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 5").fill("white");
        await page.getByRole("tab", { name: "Settings" }).click();
        await page.getByTestId("randomize-answers").click();

        await createQuestion(page, "Boolean", { label: "Question six" }); //02

        await createQuestion(page, "Thank you", { label: "Thank you. Question seven" }); //05
    });

    test("should allow user to update question logic", async ({ page }) => {
        await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

        await page.getByTestId("question-trigger").nth(1).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "does not include any" }).click();
        await page.getByTestId("value-indicator").click();
        await page.getByRole("option", { name: "green" }).click();
        await page.getByRole("option", { name: "blue" }).click();
        await page.getByText("Add logic").click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("question-trigger").nth(2).click();
        await page.getByRole("tab", { name: "Logic" }).click();
        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "includes all" }).click();
        await page.getByTestId("value-indicator").click();
        await page.getByRole("option", { name: "green" }).click();
        await page.getByRole("option", { name: "blue" }).click();
        await page.getByText("Add logic").click();
        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "Question four" }).click();

        await page.getByTestId("add-new-logic").click();
        await page.getByTestId("condition-indicator").click();
        await page.getByRole("option", { name: "has any value" }).click();

        await page.getByTestId("destination-indicator").click();
        await page.getByRole("option", { name: "End survey" }).click();
    });

    // test("should verify DOES_NOT_INCLUDE_ANY logic in the survey preview", async ({ page }) => {
    //     await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

    //     const iframe = page.frameLocator('iframe[title="Survey preview"]');
    //     await iframe.getByRole("button", { name: "Submit" }).waitFor();

    //     await iframe.getByRole("button", { name: "Submit" }).click();

    //     await iframe.getByTestId("white").click();
    //     await expect(iframe.getByText("Question four")).toBeVisible();
    // });

    // test("should verify INCLUDES_ALL logic in the survey preview", async ({ page }) => {
    //     await gotoSurvey(page, workspaceSlug, projectSlug, surveySlug);

    //     const iframe = page.frameLocator('iframe[title="Survey preview"]');
    //     await iframe.getByRole("button", { name: "Submit" }).waitFor();

    //     await iframe.getByRole("button", { name: "Submit" }).click();
    //     await iframe.getByTestId("thumbs-up").click();
    //     await expect(iframe.getByText("Question one")).toBeVisible();
    // });
});
