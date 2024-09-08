import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";

test.describe("Create survey", () => {
    let workspaceSlug;
    let projectSlug;
    let surveySlug;

    test.beforeAll(async ({ browser }) => {
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;

        // Create survey in the first test
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

        await page.waitForURL((url) => {
            console.log(ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));
            return ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname);
        });

        await page
            .getByRole("button", { name: /Create new survey/i })
            .last()
            .click();
        await page.waitForURL((url) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));

        const url = new URL(page.url());
        surveySlug = url.pathname.split("/")[5];

        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));

        await page.locator('[name="title"]').fill(faker.word.noun(3));

        // await page.getByRole("button", { name: /add your first question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Welcome message$/ })
        //     .click();
        // await page.getByRole("button", { name: /add your next question/i }).click();

        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Single answer selection$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Dropdown list$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Multiple answer selection$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Text answer$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Smiley scale$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Rating scale$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^NPS®$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Contact form$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Boolean$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Birthday$/ })
        //     .click();

        // await page.getByRole("button", { name: /add your next question/i }).click();
        // await page
        //     .locator("div")
        //     .filter({ hasText: /^Thank you$/ })
        //     .click();

        // Close the page and context after creation
        // await page.close();
        // await context.close();
    });

    test("should check for question settings", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));
        await page.waitForURL((url) => {
            console.log(ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));
            return ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname);
        });

        await page.getByTestId("add-question").click();

        await page
            .locator("div")
            .filter({ hasText: /^Single answer selection$/ })
            .click();

        await page.locator(".ql-editor").fill("What is your favourite color?");
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

        await page.locator(".ql-editor").fill("What item do you want in red?");
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
        await page.locator(".ql-editor").fill("Thank you");
        await expect(page.locator(".ql-editor")).toContainText("Thank you");

        // Log the inner HTML of the text editor for each question
        await page.getByTestId("question-trigger").nth(0).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });
        console.log("Question 1 HTML:", await page.locator(".ql-editor").evaluate((el) => el.innerHTML));

        await page.getByTestId("question-trigger").nth(1).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });
        console.log("Question 2 HTML:", await page.locator(".ql-editor").evaluate((el) => el.innerHTML));

        await page.getByTestId("question-trigger").nth(2).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });
        console.log("Question 3 HTML:", await page.locator(".ql-editor").evaluate((el) => el.innerHTML));

        // Log the first question's input value in plain text
        await page.getByTestId("question-trigger").nth(0).click();
        await page.waitForSelector(".ql-editor", { state: "attached" });
        console.log(
            "First Question Input Value (plain text):",
            await page.locator(".ql-editor").evaluate((el) => el.textContent),
        );
    });

    // test("should check for question settings", async ({ page }) => {
    //     await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));

    //     // await page.getByTestId("add-question").click();
    //     // await page
    //     //     .locator("div")
    //     //     .filter({ hasText: /^Single answer selection$/ })
    //     //     .click();

    //     // await page.getByRole("tab", { name: "Edit" }).click();

    //     // await page.locator(".ql-editor").fill("Hello");
    //     // await expect(page.locator(".ql-editor")).toContainText("Hello");
    //     // await page.getByPlaceholder("Answer 1").fill(faker.color.human());
    //     // await page.getByPlaceholder("Answer 2").fill(faker.color.human());

    //     // await page.getByRole("tab", { name: "Settings" }).click();

    //     // await expect(page.getByRole("tab", { name: "Settings" })).toBeVisible();

    //     // await page.getByTestId("base-input").fill("Next");

    //     await page.getByTestId("add-question").click();

    //     await page
    //         .locator("div")
    //         .filter({ hasText: /^Single answer selection$/ })
    //         .click();

    //     await page.locator(".ql-editor").fill("What is your favourite color?");
    //     await expect(page.locator(".ql-editor")).toContainText("What is your favourite color?");
    //     await page.getByPlaceholder("Answer 1").fill(faker.color.human());
    //     await page.getByPlaceholder("Answer 2").fill(faker.color.human());
    //     await page.getByText("Add an answer at choice").click();
    //     await page.getByPlaceholder("Answer 3").fill("red");
    //     await page.getByText("Add an answer at choice").click();
    //     await page.getByPlaceholder("Answer 4").fill(faker.color.human());

    //     await page.getByTestId("add-question").click();

    //     await page
    //         .locator("div")
    //         .filter({ hasText: /^Multiple answer selection$/ })
    //         .click();

    //     await page.locator(".ql-editor").fill("What item do you want in red?");
    //     await expect(page.locator(".ql-editor")).toContainText("What item do you want in red?");
    //     await page.getByPlaceholder("Answer 1").fill("shoes");
    //     await page.getByPlaceholder("Answer 2").fill("bowl");
    //     await page.getByText("Add an answer at choice").click();
    //     await page.getByPlaceholder("Answer 3").fill("car");
    //     await page.getByText("Add an answer at choice").click();
    //     await page.getByPlaceholder("Answer 4").fill("dresses");

    //     // await page.getByTestId("add-question").click();
    //     // await page
    //     //     .locator("div")
    //     //     .filter({ hasText: /^Welcome message$/ })
    //     //     .click();

    //     // await page.getByRole("tab", { name: "Edit" }).click();

    //     // await page.locator(".ql-editor").fill("Hello");
    //     // await expect(page.locator(".ql-editor")).toContainText("Hello");

    //     await page.getByTestId("add-question").click();
    //     await page
    //         .locator("div")
    //         .filter({ hasText: /^Thank you$/ })
    //         .click();
    //     await page.locator(".ql-editor").fill("Thank you");
    //     await expect(page.locator(".ql-editor")).toContainText("Thank you");

    //     // await page.getByTestId("question-trigger").nth(1).click();
    //     // await expect(page.getByRole("tab", { name: "Settings" })).toBeVisible();

    //     // await page.getByRole("tab", { name: "Logic" }).click();

    //     // await expect(page.getByText("Add logic")).toBeVisible();

    //     // await page.getByTestId("add-new-logic").click();
    //     // await expect(page.getByText("If answer")).toBeVisible();

    //     // await page.locator(".react-select__indicator").click();
    //     // await page.getByRole("option", { name: "is", exact: true }).click();

    //     // await page.locator(".react-select__indicator").nth(1).click();
    //     // await page.getByRole("option", { name: "red" }).first().click();

    //     // await page.getByRole("heading", { name: "Add logic" }).click();
    //     // await page
    //     //     .locator("div")
    //     //     .filter({ hasText: /^thenSelect\.\.\.$/ })
    //     //     .locator("svg")
    //     //     .click();

    //     // await expect(page.getByText("Add logic")).toBeVisible();

    //     await page.getByTestId("question-trigger").nth(0).click();
    //     console.log("02", page.locator(".ql-editor").allTextContents());

    //     // await page.getByTestId("question-trigger").nth().click();
    //     // console.log("03", page.locator(".ql-editor").allTextContents());

    //     await page.getByTestId("question-trigger").nth(1).click();
    //     console.log("00", page.locator(".ql-editor").allTextContents());

    //     await page.getByTestId("question-trigger").nth(2).click();
    //     // await page.getByTestId("question-trigger").nth(3).click();
    //     console.log("01", page.locator(".ql-editor").allTextContents());

    //     await page.getByTestId("question-trigger").nth(0).click();
    //     console.log("02", page.locator(".ql-editor").inputValue());

    //     // await page.getByTestId("question-trigger").nth(2).click();
    //     // console.log("02", page.locator(".ql-editor").allTextContents());

    //     await expect(page.locator('[name="title"]')).toBeVisible();
    // });

    test("should allow user to delete a question", async ({ page }) => {
        // Navigate to the specific survey page

        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));

        await page.getByTestId("add-question").click();
        await page
            .locator("div")
            .filter({ hasText: /^Birthday$/ })
            .click();

        const initialCount = await page.getByTestId("question").count();
        console.log(`Initial number of questions: ${initialCount}`);

        // await expect(page.getByTestId("question").last()).toBeVisible();

        await page.getByTestId("delete-question").click();

        const finalCount = await page.getByTestId("question").count();
        console.log(`Number of questions after deletion: ${finalCount}`);

        expect(finalCount).toBe(initialCount - 1);
    });
});
