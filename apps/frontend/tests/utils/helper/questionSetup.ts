import { Browser } from "@playwright/test";
import fs from "fs";
import { URL } from "url";
import { ROUTES, userDetailsFile } from "../constants";

export async function setupQuestion(browser: Browser) {
    let details = JSON.parse(fs.readFileSync(userDetailsFile, "utf-8"));
    const workspaceSlug = details.workspaceSlug;
    const projectSlug = details.projectSlug;
    let surveySlug = "";

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(ROUTES.SURVEY.LIST(workspaceSlug, projectSlug));

    await page.waitForURL((url: URL) => ROUTES.PATTERNS.SURVEY_LIST_URL.test(url.pathname));

    await page.getByTestId("create-survey").waitFor();
    await page.getByTestId("create-survey").click();

    await page.waitForURL((url: URL) => ROUTES.PATTERNS.SINGLE_SURVEY.test(url.pathname));

    const url = new URL(page.url());
    surveySlug = url.pathname.split("/")[5];

    details.surveySlug = surveySlug;

    fs.writeFileSync(userDetailsFile, JSON.stringify(details), "utf-8");

    await page.close();
    await context.close();

    return { workspaceSlug, projectSlug, surveySlug };
}
