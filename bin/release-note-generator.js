"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_process_1 = require("node:process");
var prompts_1 = require("prompts");
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var username, activePr, initialPrNumber, _a, result, fileContents, prNumber, filepath, confirm_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, execAsync(
                    // eslint-disable-next-line actual/typography
                    "gh api user --jq '.login'", 'To avoid having to enter your username, consider installing the official GitHub CLI (https://github.com/cli/cli) and logging in with `gh auth login`.')];
                case 1:
                    username = _c.sent();
                    return [4 /*yield*/, getActivePr(username)];
                case 2:
                    activePr = _c.sent();
                    if (activePr) {
                        console.log("Found potentially matching PR ".concat(activePr.number, ": ").concat(activePr.title));
                    }
                    if (!((_b = activePr === null || activePr === void 0 ? void 0 : activePr.number) !== null && _b !== void 0)) return [3 /*break*/, 3];
                    _a = _b;
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, getNextPrNumber()];
                case 4:
                    _a = (_c.sent());
                    _c.label = 5;
                case 5:
                    initialPrNumber = _a;
                    return [4 /*yield*/, (0, prompts_1.default)([
                            {
                                name: 'githubUsername',
                                message: 'Comma-separated GitHub username(s)',
                                type: 'text',
                                initial: username,
                            },
                            {
                                name: 'pullRequestNumber',
                                message: 'PR Number',
                                type: 'number',
                                initial: initialPrNumber,
                            },
                            {
                                name: 'releaseNoteType',
                                message: 'Release Note Type',
                                type: 'select',
                                choices: [
                                    { title: '✨ Features', value: 'Features' },
                                    { title: '👍 Enhancements', value: 'Enhancements' },
                                    { title: '🐛 Bugfix', value: 'Bugfix' },
                                    { title: '⚙️  Maintenance', value: 'Maintenance' },
                                ],
                            },
                            {
                                name: 'oneLineSummary',
                                message: 'Brief Summary',
                                type: 'text',
                                initial: activePr === null || activePr === void 0 ? void 0 : activePr.title,
                            },
                        ])];
                case 6:
                    result = _c.sent();
                    if (!result.githubUsername ||
                        !result.oneLineSummary ||
                        !result.releaseNoteType ||
                        !result.pullRequestNumber) {
                        console.log('All questions must be answered. Exiting');
                        (0, node_process_1.exit)(1);
                    }
                    fileContents = getFileContents(result.releaseNoteType, result.githubUsername, result.oneLineSummary);
                    prNumber = result.pullRequestNumber;
                    filepath = "./upcoming-release-notes/".concat(prNumber, ".md");
                    if (!(0, node_fs_1.existsSync)(filepath)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, prompts_1.default)({
                            name: 'confirm',
                            type: 'confirm',
                            message: "This will overwrite the existing release note ".concat(filepath, " Are you sure?"),
                        })];
                case 7:
                    confirm_1 = (_c.sent()).confirm;
                    if (!confirm_1) {
                        console.log('Exiting');
                        (0, node_process_1.exit)(1);
                    }
                    _c.label = 8;
                case 8:
                    (0, node_fs_1.writeFile)(filepath, fileContents, function (err) {
                        if (err) {
                            console.error('Failed to write release note file:', err);
                            (0, node_process_1.exit)(1);
                        }
                        else {
                            console.log("Release note generated successfully: ".concat(filepath));
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
// makes an attempt to find an existing open PR from <username>:<branch>
function getActivePr(username) {
    return __awaiter(this, void 0, void 0, function () {
        var branchName, forkHead;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!username) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, execAsync('git rev-parse --abbrev-ref HEAD')];
                case 1:
                    branchName = _a.sent();
                    if (!branchName) {
                        return [2 /*return*/, undefined];
                    }
                    forkHead = "".concat(username, ":").concat(branchName);
                    return [2 /*return*/, getPrNumberFromHead(forkHead)];
            }
        });
    });
}
function getPrNumberFromHead(head) {
    return __awaiter(this, void 0, void 0, function () {
        var resp, ghResponse, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://api.github.com/repos/actualbudget/actual/pulls?state=open&per_page=2&head=' +
                            head)];
                case 1:
                    resp = _a.sent();
                    if (!resp.ok) {
                        console.warn('error fetching from github pulls api:', resp.status);
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, resp.json()];
                case 2:
                    ghResponse = _a.sent();
                    if ((ghResponse === null || ghResponse === void 0 ? void 0 : ghResponse.length) === 1) {
                        return [2 /*return*/, ghResponse[0]];
                    }
                    else {
                        return [2 /*return*/, undefined];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.warn('error fetching from github pulls api:', e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getNextPrNumber() {
    return __awaiter(this, void 0, void 0, function () {
        var resp, ghResponse, latestPrNumber, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://api.github.com/repos/actualbudget/actual/issues?state=all&per_page=1')];
                case 1:
                    resp = _b.sent();
                    if (!resp.ok) {
                        throw new Error("API responded with status: ".concat(resp.status));
                    }
                    return [4 /*yield*/, resp.json()];
                case 2:
                    ghResponse = _b.sent();
                    latestPrNumber = (_a = ghResponse === null || ghResponse === void 0 ? void 0 : ghResponse[0]) === null || _a === void 0 ? void 0 : _a.number;
                    if (!latestPrNumber) {
                        console.error('Could not find latest issue number in GitHub API response', ghResponse);
                        (0, node_process_1.exit)(1);
                    }
                    return [2 /*return*/, latestPrNumber + 1];
                case 3:
                    error_1 = _b.sent();
                    console.error('Failed to fetch next PR number:', error_1);
                    (0, node_process_1.exit)(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getFileContents(type, username, summary) {
    return "---\ncategory: ".concat(type, "\nauthors: [").concat(username, "]\n---\n\n").concat(summary, "\n");
}
// simple exec that fails silently and returns an empty string on failure
function execAsync(cmd, errorLog) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (res) {
                    (0, node_child_process_1.exec)(cmd, function (error, stdout) {
                        if (error) {
                            console.log(errorLog);
                            res('');
                        }
                        else {
                            res(stdout.trim());
                        }
                    });
                })];
        });
    });
}
run();
