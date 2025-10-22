"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
// eslint-disable-next-line import/no-default-export
exports.default = (0, test_1.defineConfig)({
    timeout: 60000, // 60 seconds
    retries: 1,
    testDir: 'e2e/',
    reporter: !process.env.CI ? [['html', { open: 'never' }]] : undefined,
    use: {
        userAgent: 'playwright',
        screenshot: 'on',
        browserName: 'chromium',
        baseURL: (_a = process.env.E2E_START_URL) !== null && _a !== void 0 ? _a : 'http://localhost:3001',
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
    },
    expect: {
        toHaveScreenshot: { maxDiffPixels: 5 },
    },
});
