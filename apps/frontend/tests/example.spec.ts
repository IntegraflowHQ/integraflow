import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
    await page.goto("/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Integraflow/);
});

test.describe("Authentication Tests", () => {
    test("new user login", async ({ page }) => {
        // Set up your environment to use the e2e_test_token
        // process.env.E2E_TESTING = "true";
        const e2eTestToken = "e2e_test_token";

        // Navigate to the login page
        await page.goto("/");
        await page.getByPlaceholder("Enter your email").fill("test@example.com");
        await page.getByRole("button", { name: /Continue with email/i }).click();
        await page.waitForURL("/auth/magic-sign-in/?email=test%40example.com");
        await page.getByRole("button", { name: /enter code manually/i }).click();
        await page.fill('input[name="code"]', e2eTestToken);
        await page.getByRole("button", { name: /continue/i }).click();
        await page.waitForURL("/create-workspace");
        await expect(page.locator("h3")).toContainText("Create a new workspace");

        // await expect(page).toha

        // Fill in the email in the input field
        // await page.fill('input[name="email"]', "random@gmail.com");

        // Fill in the token in the magic code input field
        // await page.fill('input[name="magic_code"]', e2eTestToken);

        // Submit the form to log in
        // await page.click('button[type="submit"]');

        // Wait for navigation to the dashboard or any post-login page
        // await page.waitForURL('/dashboard');

        // Check if the dashboard page is loaded
        // await expect(page).toHaveURL('/dashboard');
        // await expect(page.locator('h1')).toContainText('Dashboard');
    });
});
