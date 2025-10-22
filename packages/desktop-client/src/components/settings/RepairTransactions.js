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
exports.RepairTransactions = RepairTransactions;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var UI_1 = require("./UI");
function useRenderResults() {
    var t = (0, react_i18next_1.useTranslation)().t;
    function renderResults(results) {
        var numBlankPayees = results.numBlankPayees, numCleared = results.numCleared, numDeleted = results.numDeleted, numTransfersFixed = results.numTransfersFixed, mismatchedSplits = results.mismatchedSplits, numNonParentErrorsFixed = results.numNonParentErrorsFixed, numParentTransactionsWithCategoryFixed = results.numParentTransactionsWithCategoryFixed;
        var result = [];
        if (numBlankPayees === 0 &&
            numCleared === 0 &&
            numDeleted === 0 &&
            numTransfersFixed === 0 &&
            numNonParentErrorsFixed === 0 &&
            mismatchedSplits.length === 0 &&
            numParentTransactionsWithCategoryFixed === 0) {
            result.push(t('No split transactions found needing repair.'));
        }
        else {
            if (numBlankPayees > 0) {
                result.push(t('Fixed {{count}} splits with a blank payee.', {
                    count: numBlankPayees,
                }));
            }
            if (numCleared > 0) {
                result.push(t('Fixed {{count}} splits with the wrong cleared flag.', {
                    count: numCleared,
                }));
            }
            if (numDeleted > 0) {
                result.push(t('Fixed {{count}} splits that weren’t properly deleted.', {
                    count: numDeleted,
                }));
            }
            if (numNonParentErrorsFixed > 0) {
                result.push(t('Fixed {{count}} non-split transactions with split errors.', {
                    count: numNonParentErrorsFixed,
                }));
            }
            if (numTransfersFixed > 0) {
                result.push(t('Fixed {{count}} transfers.', {
                    count: numTransfersFixed,
                }));
            }
            if (mismatchedSplits.length > 0) {
                var mismatchedSplitInfo = mismatchedSplits
                    .map(function (t) { return "- ".concat(t.date); })
                    .join('\n');
                result.push(t('Found {{count}} split transactions with mismatched amounts on the below dates. Please review them manually:', { count: mismatchedSplits.length }) + "\n".concat(mismatchedSplitInfo));
            }
            if (numParentTransactionsWithCategoryFixed > 0) {
                result.push(t('Fixed {{count}} split transactions with non-null category.', {
                    count: numParentTransactionsWithCategoryFixed,
                }));
            }
        }
        return (<paragraph_1.Paragraph style={{
                color: mismatchedSplits.length === 0
                    ? theme_1.theme.noticeTextLight
                    : theme_1.theme.errorText,
                whiteSpace: 'pre-wrap',
            }}>
        {result.join('\n')}
      </paragraph_1.Paragraph>);
    }
    return { renderResults: renderResults };
}
function RepairTransactions() {
    var _a = (0, react_1.useState)(false), loading = _a[0], setLoading = _a[1];
    var _b = (0, react_1.useState)(null), results = _b[0], setResults = _b[1];
    var renderResults = useRenderResults().renderResults;
    function onFix() {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        return [4 /*yield*/, (0, fetch_1.send)('tools/fix-split-transactions')];
                    case 1:
                        res = _a.sent();
                        setResults(res);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<UI_1.Setting primaryAction={<view_1.View style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1em',
            }}>
          <button_1.ButtonWithLoading isLoading={loading} onPress={onFix}>
            <react_i18next_1.Trans>Repair transactions</react_i18next_1.Trans>
          </button_1.ButtonWithLoading>
          {results && renderResults(results)}
        </view_1.View>}>
      <react_i18next_1.Trans>
        <text_1.Text>
          <strong>Repair transactions</strong> if you are experiencing bugs
          relating to split transactions or transfers and the “Reset budget
          cache” button above does not help, this tool may fix them. Some
          examples of bugs include seeing blank payees on splits or incorrect
          account balances. This tool does four things:
        </text_1.Text>
        <ul style={{ margin: 0, paddingLeft: '1.5em' }}>
          <li style={{ marginBottom: '0.5em' }}>
            Ensures that deleted split transactions are fully deleted. In
            previous versions of the app, certain split transactions may appear
            deleted but not all of them are actually deleted. This causes the
            transactions list to look correct, but certain balances may be
            incorrect when filtering.
          </li>
          <li>
            Sync the payee and cleared flag of a split transaction to the main
            or “parent” transaction, if appropriate. The payee will only be set
            if it currently doesn’t have one.
          </li>
          <li>
            Checks that the sum of all child transactions adds up to the total
            amount. If not, these will be flagged below to allow you to easily
            locate and fix the amounts.
          </li>
          <li>
            Checks for any non-split transactions with erroneous split errors
            and removes the errors if found.
          </li>
          <li>
            Check if you have any budget transfers that erroneous contain a
            category, and remove the category.
          </li>
          <li>
            Checks for any parent transactions with a category and removes the
            category if found.
          </li>
        </ul>
      </react_i18next_1.Trans>
    </UI_1.Setting>);
}
