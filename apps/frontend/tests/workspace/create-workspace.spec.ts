import { faker } from "@faker-js/faker";
import fs from "fs";

import { expect, test } from "@playwright/test";
import { ROUTES, userDetailsFile } from "../utils/constants";

const word1 = faker.word.words(1);
const word2 = faker.word.words(1);
const workspaceUrl = `${word1}-${word2}`;

test.describe("Create workspace", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(ROUTES.WORKSPACE.CREATE);
        await page.waitForSelector("h3");
        await expect(page.locator("h3")).toContainText("Create a new workspace");
    });

    test("should allow user to create a new workspace", async ({ page }) => {
        await page.locator('[name="workspaceName"]').fill(faker.word.words(2));
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL((url) => {
            return ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname);
        });

        const url = new URL(page.url());

        const workspaceSlug = url.pathname.split("/")[1];
        const projectSlug = url.pathname.split("/")[3];
        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");

        await expect(page.locator("h1").nth(0)).toContainText(/Create your first survey/i);
    });

    test("should not allow repeating workspace URL", async ({ page }) => {
        await page.locator('[name="workspaceName"]').fill(faker.word.words(2));
        await page.locator('[name="workspaceUrl"]').fill(workspaceUrl);

        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.waitForURL((url) => {
            return ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname);
        });

        const url = new URL(page.url());

        const workspaceSlug = url.pathname.split("/")[1];
        const projectSlug = url.pathname.split("/")[3];
        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");

        await expect(page.locator("h1").nth(0)).toContainText(/Create your first survey/i);

        await page.goto(ROUTES.WORKSPACE.CREATE);
        await page.waitForSelector("h3");
        await page.locator('[name="workspaceName"]').fill(faker.word.words(2));
        await page.locator('[name="workspaceUrl"]').fill(workspaceUrl);
        await page.getByRole("button", { name: /Create Workspace/i }).click();

        await page.locator(".tremor-TextInput-errorMessage").waitFor({ state: "attached" });
        await expect(page.locator(".tremor-TextInput-errorMessage")).toBeVisible();
    });
});
