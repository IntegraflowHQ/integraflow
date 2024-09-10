import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import fs from "fs";
import { ROUTES, userDetailsFile } from "../utils/constants";

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

        // await expect(page.getByRole("button", { name: /Create new survey/i }).last()).toBeVisible();
        await page.getByText(/invite team/i).waitFor();

        await page.getByTestId("project-dropdown").waitFor();
        await page.getByTestId("project-dropdown").click();
        await page.getByTestId("create-new-project").click();
        await page.getByText(/Create new project/i).waitFor();

        await page.getByPlaceholder(/Project name/i).fill(newProject);

        await page.getByRole("button", { name: /Create project/i }).click();

        // await expect(page.getByRole("button", { name: /Create new survey/i }).last()).toBeVisible();
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
        // expect(newProjectName).toContain(newProject.replace(/\s+/g, "-").toLowerCase());

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

        // find the one with the 'active' class
        for (let i = 0; i < projectButtons.length; i++) {
            const isActive = await projectButtons[i].evaluate((el) => {
                return (el as HTMLElement).classList.contains("active");
            });
            if (isActive) {
                activeIndex = i;
                break;
            }
        }

        console.log("Active button index:", activeIndex);

        if (projectButtons.length === 1) {
            // Only one project, click it if it's not active
            if (activeIndex === -1) {
                activeIndex = 0;
                await projectButtons[activeIndex].click();
            }
            console.log("has only one project");
        } else if (activeIndex !== -1 && activeIndex < projectButtons.length - 1) {
            console.log(activeIndex, "has clicked the next index");
            console.log(activeIndex + 1);
            activeIndex = activeIndex + 1;
            // Click the next button if there's more than one project and we're not at the last project
            await projectButtons[activeIndex].click();
        } else if (activeIndex !== -1 && activeIndex === projectButtons.length - 1) {
            // If it's the last button, click the first one
            console.log(activeIndex, "I am last so i clicked first");
            activeIndex = 0;

            await projectButtons[activeIndex].click();
        } else if (activeIndex === -1) {
            console.log(activeIndex, "no project found");
            activeIndex = 0;
            // If no active button is found, click the first one as a fallback
            await projectButtons[activeIndex].click();
        }

        console.log("new active index", activeIndex);

        // Capture the new URL and verify project change
        const url = new URL(page.url());
        const newUrl = url.pathname;

        // Extract project names from the old and new URLs
        const extractProjectNameFromUrl = (url) => {
            const match = url.match(/projects\/([\w-]+)\//);
            return match ? match[1] : null;
        };

        const oldProjectName = extractProjectNameFromUrl(oldUrl);
        const newProjectName = extractProjectNameFromUrl(newUrl);
        console.log({ oldProjectName }, { newProjectName });

        // Assert that the project name in the new URL is different
        expect(newProjectName).not.toEqual(oldProjectName);

        // Save the new project slug for later tests
        projectSlug = url.pathname.split("/")[3];

        const details = { workspaceSlug, projectSlug };

        fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");
    });
});
