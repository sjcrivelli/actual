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
exports.BudgetTypeSettings = BudgetTypeSettings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var fetch_1 = require("loot-core/platform/client/fetch");
var UI_1 = require("./UI");
var Link_1 = require("@desktop-client/components/common/Link");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function BudgetTypeSettings() {
    var _a = (0, useSyncedPref_1.useSyncedPref)('budgetType'), _b = _a[0], budgetType = _b === void 0 ? 'envelope' : _b, setBudgetType = _a[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    function onSwitchType() {
        return __awaiter(this, void 0, void 0, function () {
            var newBudgetType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 3, 4]);
                        newBudgetType = budgetType === 'envelope' ? 'tracking' : 'envelope';
                        setBudgetType(newBudgetType);
                        // Reset the budget cache to ensure the server-side budget system is recalculated
                        return [4 /*yield*/, (0, fetch_1.send)('reset-budget-cache')];
                    case 2:
                        // Reset the budget cache to ensure the server-side budget system is recalculated
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return (<UI_1.Setting primaryAction={<button_1.ButtonWithLoading onPress={onSwitchType} isLoading={isLoading}>
          {budgetType === 'tracking' ? (<react_i18next_1.Trans>Switch to envelope budgeting</react_i18next_1.Trans>) : (<react_i18next_1.Trans>Switch to tracking budgeting</react_i18next_1.Trans>)}
        </button_1.ButtonWithLoading>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Envelope budgeting</strong> (recommended) digitally mimics
          physical envelope budgeting system by allocating funds into virtual
          envelopes for different expenses. It helps track spending and ensure
          you don‘t overspend in any category.
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/envelope-budgeting" linkColor="purple">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>
      <text_1.Text>
        <react_i18next_1.Trans>
          With <strong>tracking budgeting</strong>, category balances reset each
          month, and funds are managed using a “Saved” metric instead of “To Be
          Budgeted.” Income is forecasted to plan future spending, rather than
          relying on current available funds.
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/tracking-budget" linkColor="purple">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>
    </UI_1.Setting>);
}
