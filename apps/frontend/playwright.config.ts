import { defineConfig, devices } from "@playwright/test";
import { ONBOARDED_USER_FILE } from "./tests/utils/constants";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: "./tests",
    timeout: 90000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    retries: 3,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? undefined : "80%",
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html",
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: "http://localhost:5173",

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "on-first-retry",
    },

    /* Configure projects for major browsers */
    projects: [
        { name: "setup", testMatch: /.*\.setup\.ts/ },

        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"], storageState: ONBOARDED_USER_FILE },
            dependencies: ["setup"],
        },

        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"], storageState: ONBOARDED_USER_FILE },
            dependencies: ["setup"],
        },

        {
            name: "webkit",
            use: { ...devices["Desktop Safari"], storageState: ONBOARDED_USER_FILE },
            dependencies: ["setup"],
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    webServer: [
        {
            command: "yarn preview",
            url: "http://localhost:5173",
            reuseExistingServer: true,
        },
        // {
        //     command: "yarn preview",
        //     url: "http://localhost:3000",
        //     reuseExistingServer: true,
        // },
    ],
});
