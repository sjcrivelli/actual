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
exports.ExportBudget = ExportBudget;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var date_fns_1 = require("date-fns");
var fetch_1 = require("loot-core/platform/client/fetch");
var UI_1 = require("./UI");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
function ExportBudget() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, react_1.useState)(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var budgetName = (0, useMetadataPref_1.useMetadataPref)('budgetName')[0];
    var encryptKeyId = (0, useMetadataPref_1.useMetadataPref)('encryptKeyId')[0];
    function onExport() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setIsLoading(true);
                        setError(null);
                        return [4 /*yield*/, (0, fetch_1.send)('export-budget')];
                    case 1:
                        response = _a.sent();
                        if ('error' in response && response.error) {
                            setError(response.error);
                            setIsLoading(false);
                            console.log('Export error code:', response.error);
                            return [2 /*return*/];
                        }
                        if (response.data) {
                            window.Actual.saveFile(response.data, "".concat((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd'), "-").concat(budgetName, ".zip"), t('Export budget'));
                        }
                        setIsLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<UI_1.Setting primaryAction={<>
          <button_1.ButtonWithLoading onPress={onExport} isLoading={isLoading}>
            <react_i18next_1.Trans>Export data</react_i18next_1.Trans>
          </button_1.ButtonWithLoading>
          {error && (<block_1.Block style={{ color: theme_1.theme.errorText, marginTop: 15 }}>
              {t('An unknown error occurred while exporting. Please report this as a new issue on GitHub.')}
            </block_1.Block>)}
        </>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Export</strong> your data as a zip file containing{' '}
          <code>db.sqlite</code> and <code>metadata.json</code> files. It can be
          imported into another Actual instance by closing an open file (if
          any), then clicking the “Import file” button, then choosing “Actual.”
        </react_i18next_1.Trans>
      </text_1.Text>
      {encryptKeyId ? (<text_1.Text>
          <react_i18next_1.Trans>
            Even though encryption is enabled, the exported zip file will not
            have any encryption.
          </react_i18next_1.Trans>
        </text_1.Text>) : null}
    </UI_1.Setting>);
}
