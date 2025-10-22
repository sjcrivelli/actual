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
exports.ResetCache = ResetCache;
exports.ResetSync = ResetSync;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var fetch_1 = require("loot-core/platform/client/fetch");
var UI_1 = require("./UI");
var appSlice_1 = require("@desktop-client/app/appSlice");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var redux_1 = require("@desktop-client/redux");
function ResetCache() {
    var _a = (0, react_1.useState)(false), resetting = _a[0], setResetting = _a[1];
    function onResetCache() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setResetting(true);
                        return [4 /*yield*/, (0, fetch_1.send)('reset-budget-cache')];
                    case 1:
                        _a.sent();
                        setResetting(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<UI_1.Setting primaryAction={<button_1.ButtonWithLoading isLoading={resetting} onPress={onResetCache}>
          <react_i18next_1.Trans>Reset budget cache</react_i18next_1.Trans>
        </button_1.ButtonWithLoading>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Reset budget cache</strong> will clear all cached values for
          the budget and recalculate the entire budget. All values in the budget
          are cached for performance reasons, and if there is a bug in the cache
          you won’t see correct values. There is no danger in resetting the
          cache. Hopefully you never have to do this.
        </react_i18next_1.Trans>
      </text_1.Text>
    </UI_1.Setting>);
}
function ResetSync() {
    var groupId = (0, useMetadataPref_1.useMetadataPref)('groupId')[0];
    var isEnabled = !!groupId;
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, react_1.useState)(false), resetting = _a[0], setResetting = _a[1];
    function onResetSync() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setResetting(true);
                        return [4 /*yield*/, dispatch((0, appSlice_1.resetSync)())];
                    case 1:
                        _a.sent();
                        setResetting(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<UI_1.Setting primaryAction={<button_1.ButtonWithLoading isLoading={resetting} isDisabled={!isEnabled} onPress={onResetSync}>
          <react_i18next_1.Trans>Reset sync</react_i18next_1.Trans>
        </button_1.ButtonWithLoading>}>
      {isEnabled ? (<text_1.Text>
          <react_i18next_1.Trans>
            <strong>Reset sync</strong> will remove all local data used to track
            changes for syncing, and create a fresh sync ID on the server. This
            file on other devices will have to be re-downloaded to use the new
            sync ID. Use this if there is a problem with syncing and you want to
            start fresh.
          </react_i18next_1.Trans>
        </text_1.Text>) : (<text_1.Text>
          <react_i18next_1.Trans>
            <strong>Reset sync</strong> is only available when syncing is
            enabled.
          </react_i18next_1.Trans>
        </text_1.Text>)}
    </UI_1.Setting>);
}
