"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line no-restricted-imports -- fix me
const configuration_page_1 = require("@actual-app/web/e2e/page-models/configuration-page");
const test_1 = require("@playwright/test");
const fixtures_1 = require("./fixtures");
fixtures_1.test.describe('Onboarding', () => {
    let configurationPage;
    fixtures_1.test.beforeEach(async ({ electronPage }) => {
        configurationPage = new configuration_page_1.ConfigurationPage(electronPage);
    });
    (0, fixtures_1.test)('checks the page visuals', async ({ electronPage }) => {
        await (0, test_1.expect)(electronPage).toHaveScreenshot();
        await configurationPage.clickOnNoServer();
        await (0, test_1.expect)(electronPage).toHaveScreenshot();
    });
});
