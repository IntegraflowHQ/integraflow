import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";
import { waitForResponse } from "./../utils/helper";

test.describe("Create workspace", () => {
    let projectSlug;
    let workspaceSlug;
    test.beforeAll(async () => {
        const details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
        workspaceSlug = details.workspaceSlug;
        projectSlug = details.projectSlug;
    });

    test("should allow user to create a new Project", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));
        await page.waitForURL(ROUTES.PATTERNS.SURVEY_LIST_URL);

        const oldUrl = page.url();

        const newProject = faker.company.name();
        await page.getByText(/invite team/i).waitFor();

        await page.getByTestId("project-dropdown").waitFor();
        await page.getByTestId("project-dropdown").click();
        await page.getByTestId("create-new-project").click();
        await page.getByText(/Create new project/i).waitFor();

        await page.getByPlaceholder(/Project name/i).fill(newProject);

        await page.getByRole("button", { name: /Create project/i }).click();
        await expect(page.locator("div").filter({ hasText: "Success!Project created" }).nth(3)).toBeVisible();
        await page.waitForURL((url) => ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));

        await page.getByTestId("project-dropdown").click();

        const url = new URL(page.url());
        const newUrl = url.pathname;

        const extractProjectNameFromUrl = (url) => {
            const match = url.match(/projects\/([\w-]+)\//);
            return match ? match[1] : null;
        };

        const oldProjectName = extractProjectNameFromUrl(oldUrl);
        const newProjectName = extractProjectNameFromUrl(newUrl);

        expect(newProjectName).not.toEqual(oldProjectName);

        projectSlug = url.pathname.split("/")[3];

        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");
    });

    test("should allow user to switch to another Project", async ({ page }) => {
        await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));
        await page.waitForURL(ROUTES.PATTERNS.SURVEY_LIST_URL);

        const oldUrl = page.url();

        // Open the dropdown and wait for it to be visible
        await page.getByTestId("project-dropdown").waitFor();
        await page.getByTestId("project-dropdown").click();

        const projectButtons = await page.locator('[data-testid="project-btn"]').elementHandles();

        if (projectButtons.length === 0) {
            throw new Error("No projects found in the dropdown.");
        }

        let activeIndex = -1;

        for (let i = 0; i < projectButtons.length; i++) {
            const isActive = await projectButtons[i].evaluate((el) => {
                return (el as HTMLElement).classList.contains("active");
            });
            if (isActive) {
                activeIndex = i;
                break;
            }
        }

        if (projectButtons.length === 1) {
            if (activeIndex === -1) {
                activeIndex = 0;
                await projectButtons[activeIndex].click();
            }
        } else if (activeIndex !== -1 && activeIndex < projectButtons.length - 1) {
            activeIndex = activeIndex + 1;
            await projectButtons[activeIndex].click();
        } else if (activeIndex !== -1 && activeIndex === projectButtons.length - 1) {
            activeIndex = 0;

            await projectButtons[activeIndex].click();
        } else if (activeIndex === -1) {
            activeIndex = 0;
            await projectButtons[activeIndex].click();
        }

        const url = new URL(page.url());
        const newUrl = url.pathname;

        const extractProjectNameFromUrl = (url) => {
            const match = url.match(/projects\/([\w-]+)\//);
            return match ? match[1] : null;
        };

        const oldProjectName = extractProjectNameFromUrl(oldUrl);
        const newProjectName = extractProjectNameFromUrl(newUrl);

        if (projectButtons.length === 1) {
            expect(newProjectName).toEqual(oldProjectName);
        } else {
            expect(newProjectName).not.toEqual(oldProjectName);
        }

        projectSlug = url.pathname.split("/")[3];

        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");
    });

    test("should allow user to update Project", async ({ page }) => {
        await page.goto(ROUTES.PROJECT.SETTINGS(workspaceSlug, projectSlug));
        await page.getByText(/Manage your Integraflow Project/i).waitFor();
        const prevName = await page.getByTestId("project-name").inputValue();

        await page.getByTestId("project-name").fill(faker.company.buzzAdjective());
        await waitForResponse(page, "projectUpdate", async () => {
            await page.getByRole("button", { name: "Update" }).click();
        });

        await page.reload();
        await page.getByTestId("project-name").waitFor();

        const newName = await page.getByTestId("project-name").inputValue();
        expect(prevName).not.toBe(newName);
    });
    test("should allow user to refresh Project key", async ({ page }) => {
        await page.goto(ROUTES.PROJECT.SETTINGS(workspaceSlug, projectSlug));
        await page.getByText(/Manage your Integraflow Project/i).waitFor();

        const previousKey = await page.getByTestId("project-key").inputValue();

        await waitForResponse(page, "projectTokenReset", async () => {
            await page.getByTestId("refresh-project-key").click();
        });

        await page.reload();
        await page.getByTestId("project-key").waitFor();

        const newKey = await page.getByTestId("project-key").inputValue();
        expect(previousKey).not.toBe(newKey);
    });

    test("should allow user to copy Project key", async ({ page, context, browserName }) => {
        if (browserName === "firefox" || browserName === "webkit") {
            test.skip();
        }

        await page.goto(ROUTES.PROJECT.SETTINGS(workspaceSlug, projectSlug));
        await context.grantPermissions(["clipboard-read", "clipboard-write"]);
        await page.getByText(/Manage your Integraflow Project/i).waitFor();

        const projectKey = await page.getByTestId("project-key").inputValue();
        await page.getByTestId("copy-project-key").click();
        const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
        const clipboardContent = await handle.jsonValue();

        expect(clipboardContent).toBe(projectKey);
    });
});
