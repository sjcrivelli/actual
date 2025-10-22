"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ImportActualModal = ImportActualModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var redux_1 = require("@desktop-client/redux");
function ImportActualModal() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var navigate = (0, useNavigate_1.useNavigate)();
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, react_1.useState)(null), error = _a[0], setError = _a[1];
    var _b = (0, react_1.useState)(false), importing = _b[0], setImporting = _b[1];
    function getErrorMessage(error) {
        switch (error) {
            case 'parse-error':
                return t('Unable to parse file. Please select a JSON file exported from nYNAB.');
            case 'not-ynab5':
                return t('This file is not valid. Please select a JSON file exported from nYNAB.');
            case 'not-zip-file':
                return t('This file is not valid. Please select an unencrypted archive of Actual data.');
            case 'invalid-zip-file':
                return t('This archive is not a valid Actual export file.');
            case 'invalid-metadata-file':
                return t('The metadata file in the given archive is corrupted.');
            default:
                return t('An unknown error occurred while importing. Please report this as a new issue on GitHub.');
        }
    }
    function onImport() {
        return __awaiter(this, void 0, void 0, function () {
            var res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, window.Actual.openFileDialog({
                            properties: ['openFile'],
                            filters: [{ name: 'actual', extensions: ['zip', 'blob'] }],
                        })];
                    case 1:
                        res = _a.sent();
                        if (!res) return [3 /*break*/, 6];
                        setImporting(true);
                        setError(null);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 6]);
                        return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.importBudget)({ filepath: res[0], type: 'actual' }))];
                    case 3:
                        _a.sent();
                        navigate('/budget');
                        return [3 /*break*/, 6];
                    case 4:
                        err_1 = _a.sent();
                        setError(err_1.message);
                        return [3 /*break*/, 6];
                    case 5:
                        setImporting(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    return (<Modal_1.Modal name="import-actual" containerProps={{ style: { width: 400 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Import from Actual export')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={__assign(__assign({}, styles_1.styles.smallText), { lineHeight: 1.5, marginTop: 20 })}>
            {error && (<block_1.Block style={{ color: theme_1.theme.errorText, marginBottom: 15 }}>
                {getErrorMessage(error)}
              </block_1.Block>)}

            <view_1.View style={{ '& > div': { lineHeight: '1.7em' } }}>
              <paragraph_1.Paragraph>
                <react_i18next_1.Trans>
                  You can import data from another Actual account or instance.
                  First export your data from a different account, and it will
                  give you a compressed file. This file is a simple zip file
                  that contains the <code>db.sqlite</code> and{' '}
                  <code>metadata.json</code> files.
                </react_i18next_1.Trans>
              </paragraph_1.Paragraph>

              <paragraph_1.Paragraph>
                <react_i18next_1.Trans>
                  Select one of these compressed files and import it here.
                </react_i18next_1.Trans>
              </paragraph_1.Paragraph>

              <view_1.View style={{ alignSelf: 'center' }}>
                <button_1.ButtonWithLoading variant="primary" autoFocus isLoading={importing} onPress={onImport}>
                  <react_i18next_1.Trans>Select file...</react_i18next_1.Trans>
                </button_1.ButtonWithLoading>
              </view_1.View>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
