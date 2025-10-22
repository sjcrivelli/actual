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
exports.listen = listen;
exports.get = get;
var fs_1 = require("fs");
var path_1 = require("path");
var electron_1 = require("electron");
var getDataDir = function () {
    if (!process.env.ACTUAL_DATA_DIR) {
        throw new Error('ACTUAL_DATA_DIR is not set');
    }
    return process.env.ACTUAL_DATA_DIR;
};
function loadState() {
    return __awaiter(this, void 0, void 0, function () {
        var state;
        return __generator(this, function (_a) {
            state = undefined;
            try {
                state = JSON.parse(fs_1.default.readFileSync(path_1.default.join(getDataDir(), 'window.json'), 'utf8'));
            }
            catch (e) {
                console.log('Could not load window state');
            }
            return [2 /*return*/, validateState(state)];
        });
    });
}
function updateState(win, state) {
    var screen = electron_1.default.screen;
    var bounds = win.getBounds();
    if (!win.isMaximized() && !win.isMinimized() && !win.isFullScreen()) {
        state.width = bounds.width;
        state.height = bounds.height;
    }
    state.x = bounds.x;
    state.y = bounds.y;
    state.isMaximized = win.isMaximized();
    state.isFullScreen = win.isFullScreen();
    state.displayBounds = screen.getDisplayMatching(bounds).bounds;
}
function saveState(win, state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            updateState(win, state);
            fs_1.default.writeFileSync(path_1.default.join(getDataDir(), 'window.json'), JSON.stringify(state), 'utf8');
            return [2 /*return*/];
        });
    });
}
function listen(win, state) {
    if (state.isMaximized) {
        win.maximize();
    }
    if (state.isFullScreen) {
        win.setFullScreen(true);
    }
    var saver = saveState.bind(null, win, state);
    win.on('close', saver);
    return function () {
        win.removeListener('close', saver);
    };
}
function hasBounds(state) {
    return (Number.isInteger(state.x) &&
        Number.isInteger(state.y) &&
        Number.isInteger(state.width) &&
        state.width > 0 &&
        Number.isInteger(state.height) &&
        state.height > 0);
}
function validateState(state) {
    if (!state ||
        !(hasBounds(state) || state.isMaximized || state.isFullScreen)) {
        return {};
    }
    var newState = Object.assign({}, state);
    if (hasBounds(state) && state.displayBounds) {
        var screen_1 = electron_1.default.screen;
        // Check if the display where the window was last open is still available
        var displayBounds = screen_1.getDisplayMatching(state).bounds;
        if (state.displayBounds.x !== displayBounds.x ||
            state.displayBounds.y !== displayBounds.y ||
            state.displayBounds.width !== displayBounds.width ||
            state.displayBounds.height !== displayBounds.height) {
            if (displayBounds.width < state.displayBounds.width) {
                if (state.x > displayBounds.width) {
                    newState.x = 0;
                }
                if (state.width > displayBounds.width) {
                    newState.width = displayBounds.width;
                }
            }
            if (displayBounds.height < state.displayBounds.height) {
                if (state.y > displayBounds.height) {
                    newState.y = 0;
                }
                if (state.height > displayBounds.height) {
                    newState.height = displayBounds.height;
                }
            }
        }
    }
    return newState;
}
function get() {
    return __awaiter(this, void 0, void 0, function () {
        var screen, displayBounds, state, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (process.env.EXECUTION_CONTEXT === 'playwright') {
                        // For Playwright screenshots to be consistent across machine we need a fixed window size
                        return [2 /*return*/, {
                                x: 100,
                                y: 50,
                                width: 1300,
                                height: 800,
                            }];
                    }
                    screen = electron_1.default.screen;
                    displayBounds = screen.getPrimaryDisplay().bounds;
                    _b = (_a = Object).assign;
                    _c = [{
                            x: 100,
                            y: 50,
                            width: Math.min(1000, displayBounds.width - 100),
                            height: Math.min(700, displayBounds.width - 50),
                        }];
                    return [4 /*yield*/, loadState()];
                case 1:
                    state = _b.apply(_a, _c.concat([_d.sent()]));
                    return [2 /*return*/, state];
            }
        });
    });
}
