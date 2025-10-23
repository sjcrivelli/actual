"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectSnapshotWithDiffer = expectSnapshotWithDiffer;
exports.getFixtures = getFixtures;
exports.debugDOM = debugDOM;
exports.patchFetchForSqlJS = patchFetchForSqlJS;
// @ts-strict-ignore
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = require("path");
const jest_diff_1 = require("jest-diff");
function expectSnapshotWithDiffer(initialValue, { onlyUpdates } = {}) {
    let currentValue = initialValue;
    if (!onlyUpdates) {
        expect(initialValue).toMatchSnapshot();
    }
    return {
        expectToMatchDiff: value => {
            expect((0, jest_diff_1.diff)(currentValue, value, {
                aAnnotation: 'First value',
                bAnnotation: 'Second value',
                contextLines: 5,
                expand: false,
            })).toMatchSnapshot();
            currentValue = value;
        },
    };
}
function getFixtures(filename) {
    (0, path_1.join)((0, path_1.dirname)(filename), '__fixtures__', (0, path_1.basename)(filename).replace(/\.[^.]+.js/, '.fixtures.js'));
}
function debugDOM(node) {
    function debugDOM(node, indent = 0) {
        let str = '';
        if (node) {
            str += ' '.repeat(indent);
            if (node.tagName) {
                str +=
                    node.tagName.toLowerCase() +
                        ' ' +
                        (node.tabIndex || '') +
                        (node.dataset['testid'] ? ' ' + node.dataset['testid'] : '') +
                        '\n';
            }
            else {
                str += node.textContent + '\n';
            }
            for (const child of node.childNodes) {
                str += debugDOM(child, indent + 2);
            }
        }
        return str;
    }
    return debugDOM(node);
}
function patchFetchForSqlJS(baseURL) {
    // Patch the global fetch to resolve to a file
    // This is a workaround for the fact that initSqlJS uses fetch to load the wasm file
    // and we can't use the file protocol directly in tests
    vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
        if (typeof url === 'string' && url.startsWith(baseURL)) {
            return new Response(new Uint8Array(await promises_1.default.readFile(url)), {
                status: 200,
                statusText: 'OK',
                headers: {
                    'Content-Type': 'application/wasm',
                },
            });
        }
        return Promise.reject(new Error(`fetch not mocked for ${url}`));
    });
}
//# sourceMappingURL=util.js.map