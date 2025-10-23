"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
/* eslint-disable no-empty-pattern */
/* eslint-disable react-hooks/rules-of-hooks */
const node_path_1 = __importDefault(require("node:path"));
const test_1 = require("@playwright/test");
const fs_extra_1 = require("fs-extra");
// Create the extended test with fixtures
exports.test = test_1.test.extend({
    electronApp: async ({}, use, testInfo) => {
        const uniqueTestId = testInfo.testId.replace(/[^\w-]/g, '-');
        const testDataDir = node_path_1.default.join('e2e/data/', uniqueTestId);
        await (0, fs_extra_1.remove)(testDataDir); // ensure any leftover test data is removed
        await (0, fs_extra_1.ensureDir)(testDataDir);
        const app = await test_1._electron.launch({
            args: ['.'],
            env: {
                ...process.env,
                ACTUAL_DOCUMENT_DIR: testDataDir,
                ACTUAL_DATA_DIR: testDataDir,
                EXECUTION_CONTEXT: 'playwright',
                NODE_ENV: 'development',
            },
        });
        await use(app);
        // Cleanup after tests
        await app.close();
        await (0, fs_extra_1.remove)(testDataDir);
    },
    electronPage: async ({ electronApp }, use) => {
        const page = await electronApp.firstWindow();
        await use(page);
    },
});
