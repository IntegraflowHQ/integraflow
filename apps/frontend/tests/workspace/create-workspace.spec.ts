import { test } from "@playwright/test";
import { ONBOARDED_USER_FILE } from "../utils/constants";

test.describe("Create workspace", () => {
    test.use({ storageState: ONBOARDED_USER_FILE });

    test("should allow new user to create a new workspace", async ({ page }) => {
        await page.goto("/create-workspace");
    });
});
