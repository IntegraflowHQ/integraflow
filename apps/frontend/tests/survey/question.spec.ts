import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";
import { waitForResponse } from "../utils/helper";
import { SurveyQuestionCreateInput } from "./../../../../packages/client/src/_generated_documents";

test.describe("Create questions", () => {
    let workspaceSlug;
    let projectSlug;
    let surveySlug;

    test.beforeAll(async ({ browser }) => {
        let details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;

        // Create survey in the first test
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.waitForURL((url) => {
            return ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname);
        });

        await page.getByTestId("create-survey").waitFor();

        await page.getByTestId("create-survey").click();

        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));

        const url = new URL(page.url());
        surveySlug = url.pathname.split("/")[5];

        details = { workspaceSlug, projectSlug, surveySlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");

        // Close the page and context after creation
        // await page.close();
        // await context.close();
    });

    test("should check for question settings", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));
        await page.waitForURL((url) => {
            return ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname);
        });

        await page.getByTestId("add-question").waitFor();
        await page.getByTestId("add-question").click();
        await page
            .locator("div")
            .filter({ hasText: /^Welcome message$/ })
            .click();
        waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.locator(".ql-editor").fill("Hello!");
        });

        await page.getByTestId("add-question").click();
        await page
            .locator("div")
            .filter({ hasText: /^Single answer selection$/ })
            .click();
        waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.locator(".ql-editor").fill("What is your favourite color?");
        });
        await expect(page.locator(".ql-editor")).toContainText("What is your favourite color?");
        await page.getByPlaceholder("Answer 1").fill(faker.color.human());
        await page.getByPlaceholder("Answer 2").fill(faker.color.human());
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("red");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill(faker.color.human());

        await page.getByTestId("add-question").click();
        await page
            .locator("div")
            .filter({ hasText: /^Multiple answer selection$/ })
            .click();
        waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.locator(".ql-editor").fill("What item do you want in red?");
        });
        await expect(page.locator(".ql-editor")).toContainText("What item do you want in red?");
        await page.getByPlaceholder("Answer 1").fill("shoes");
        await page.getByPlaceholder("Answer 2").fill("bowl");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 3").fill("car");
        await page.getByText("Add an answer at choice").click();
        await page.getByPlaceholder("Answer 4").fill("dresses");
        await page.getByTestId("add-question").click();
        await page
            .locator("div")
            .filter({ hasText: /^Thank you$/ })
            .click();
        waitForResponse(page, "SurveyQuestionUpdate", async () => {
            await page.locator(".ql-editor").fill("Thank you");
        });
        await expect(page.locator(".ql-editor")).toContainText("Thank you");

        // // Log the inner HTML of the text editor for each question
        await page.getByTestId("question-trigger").nth(0).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });

        await page.getByTestId("question-trigger").nth(1).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });

        await page.getByTestId("question-trigger").nth(2).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });

        await page.getByTestId("question-trigger").nth(3).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });

        await page.getByTestId("question-trigger").nth(0).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });
    });

    test("should allow user to delete a question", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));

        await page.getByTestId("add-question").waitFor();

        await page.getByTestId("add-question").click();
        const parsedPostData = await waitForResponse(page, "SurveyQuestionCreate", async () => {
            await page
                .locator("div")
                .filter({ hasText: /^Multiple answer selection$/ })
                .click();
        });
        const newQuestionId = (parsedPostData.variables.input as SurveyQuestionCreateInput).id;

        const questionElement = page.locator(`[data-testid="${newQuestionId}"]`);

        await waitForResponse(page, "SurveyQuestionDelete", async () => {
            await questionElement.locator('[data-testid="delete-question"]').click();
        });

        await expect(questionElement).toBeHidden();
    });
});
