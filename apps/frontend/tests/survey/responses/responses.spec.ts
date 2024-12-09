import test, { expect } from "@playwright/test";
import fs from "fs";
import { RESPONSE_CHECKER_USER_FILE, ROUTES, surveyResponseDetailsFile } from "../../utils/constants";

test.use({ storageState: RESPONSE_CHECKER_USER_FILE, viewport: { width: 1800, height: 1080 } });

test.describe.serial("Create survey and verify web-sdk background", () => {
    let surveyUrl, workspaceSlug, projectSlug, surveySlug;
    let details = {};
    let responses = {};

    test.beforeAll(async () => {
        details = JSON.parse(fs.readFileSync(surveyResponseDetailsFile, "utf-8"));
        surveyUrl = details.surveyUrl;
        workspaceSlug = details.details.workspaceSlug;
        projectSlug = details.details.projectSlug;
        surveySlug = details.details.surveySlug;
    });

    test("should allow users to respond to questions", async ({ page }) => {
        console.log(details, "Initial Details");

        await page.goto(surveyUrl);
        await page.getByText("Powered").waitFor();

        await page.getByRole("button", { name: "Submit" }).click();
        responses[0] = "Action performed";

        await page.getByTestId("Toyota").click();
        responses[1] = "Toyota";

        await page.getByTestId("maroon").click();
        await page.getByTestId("Emerald").click();
        responses[2] = ["maroon", "Emerald"];
        await page.getByRole("button", { name: "Submit" }).click();

        await page.getByTestId("textarea-box").fill("None");
        responses[3] = "None";
        await page.getByRole("button", { name: "Submit" }).click();

        await page.getByRole("button").nth(3).click();
        responses[4] = "satisfied-emoji";

        await page.getByTestId("star").nth(4).click();
        responses[5] = "5";

        await page.getByRole("button", { name: "8" }).click();
        responses[6] = "8";

        await page.getByLabel("First name").fill("Jane");
        await page.getByLabel("Last name").fill("Doe");
        await page.getByLabel("Address").fill("Doe street");
        await page.getByLabel("Comment").fill("No comments");
        responses[7] = ["First name: Jane", "Last name: Doe", "Address 1: Doe street", "Comment: No comments"];
        await page.getByRole("button", { name: "Submit" }).click();

        await page.getByTestId("thumbs-up").click();
        responses[8] = "thumbs-up";

        await page.getByPlaceholder("DD").fill("15");
        await page.getByPlaceholder("MM").fill("05");
        await page.getByPlaceholder("YYYY").fill("2020");
        responses[9] = ["2020-05-15"];
        await page.getByRole("button", { name: "Submit" }).click();

        await page.getByRole("button", { name: "Submit" }).click();
        responses[10] = "Action performed";

        fs.writeFileSync(RESPONSE_CHECKER_USER_FILE, JSON.stringify({ ...details, responses }), "utf-8");

        await page.context().storageState({ path: RESPONSE_CHECKER_USER_FILE });

        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));
    });

    test("should verify responses in the Analyze tab", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.SINGLE(workspaceSlug, projectSlug, surveySlug));

        await page.getByRole("tab", { name: "Analyze" }).waitFor();
        await page.getByRole("tab", { name: "Analyze" }).click();
        await page.getByText("Overview").first().waitFor();

        await page.getByRole("tab", { name: "Responses" }).click();
        await page.getByText("Responses").first().waitFor();

        await page.getByTestId("response-card").nth(1).click();
        await page.getByText("Hello there").waitFor();

        for (let i = 0; i < Object.keys(responses).length; i++) {
            const answerElement = await page.getByTestId("answer").nth(i);

            // if (i == 0 || i == 10) {
            //     const displayedAnswer = await answerElement.textContent();
            //     const expectedAnswer = Array.isArray(responses[i]) ? responses[i].join(", ") : responses[i];
            //     await expect(expectedAnswer.trim()).toBe(displayedAnswer?.trim());
            //     continue;
            // }

            if (i === 4 || i === 8) {
                const expectedAnswer = responses[i];
                const emojiElement = await answerElement.locator("svg");
                const emojiTestId = await emojiElement.getAttribute("data-testid");
                await expect(expectedAnswer).toBe(emojiTestId);
                continue;
            }

            if (i === 5) {
                const filledIcons = await answerElement.locator('[data-testid="star"][fill="#9582C0"]').count();
                const unfilledIcons = await answerElement.locator('[data-testid="star"][fill="#2E2743"]').count();
                const totalIcons = filledIcons + unfilledIcons;
                const expectedRating = +responses[i];

                await expect(expectedRating).toBe(filledIcons);

                // if (filledIcons !== expectedRating) {
                //     throw new Error(
                //         `Mismatch at question ${i}: Expected ${expectedRating} filled icons, but got ${filledIcons}`,
                //     );
                // }

                // if (totalIcons !== 5) {
                //     throw new Error(`Mismatch at question ${i}: Expected total icons to be 5, but got ${totalIcons}`);
                // }

                continue; // Skip the general text validation for this question
            }

            if (i === 6) {
                continue;
            }
            if (i === 7) {
                const formFields = await answerElement.locator("div").allTextContents();

                const expectedFormData = responses[i];

                for (let j = 0; j < expectedFormData.length; j++) {
                    if (formFields[j]?.trim() !== expectedFormData[j]) {
                        throw new Error(
                            `Mismatch at question ${i}, field ${j}: Expected "${expectedFormData[j]}", but got "${formFields[j]}".`,
                        );
                    }
                }

                continue;
            }

            // General text validation for other questions
            const displayedAnswer = await answerElement.textContent();
            const expectedAnswer = Array.isArray(responses[i]) ? responses[i].join(", ") : responses[i];

            await expect(displayedAnswer).toBe(expectedAnswer);

            // if (displayedAnswer?.trim() !== expectedAnswer) {
            //     throw new Error(
            //         `Mismatch at question ${i}: Expected "Answer: ${expectedAnswer}", got "${displayedAnswer}"`,
            //     );
            // }
        }

        // console.log("All responses validated successfully!");
    });
});
