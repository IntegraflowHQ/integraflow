import { test } from "@playwright/test";

test.describe("Create workspace", () => {
    test("should allow new user to create a new workspace", async ({ page }) => {
        await page.goto("/create-workspace");
    });
});
