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
exports.DuplicateFileModal = DuplicateFileModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var form_error_1 = require("@actual-app/components/form-error");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var inline_field_1 = require("@actual-app/components/inline-field");
var input_1 = require("@actual-app/components/input");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var notificationsSlice_1 = require("@desktop-client/notifications/notificationsSlice");
var redux_1 = require("@desktop-client/redux");
function DuplicateFileModal(_a) {
    var _this = this;
    var file = _a.file, managePage = _a.managePage, _b = _a.loadBudget, loadBudget = _b === void 0 ? 'none' : _b, onComplete = _a.onComplete;
    var t = (0, react_i18next_1.useTranslation)().t;
    var fileEndingTranslation = ' - ' + t('copy');
    var _c = (0, react_1.useState)(file.name + fileEndingTranslation), newName = _c[0], setNewName = _c[1];
    var _d = (0, react_1.useState)(null), nameError = _d[0], setNameError = _d[1];
    // If the state is "broken" that means it was created by another user.
    var isCloudFile = 'cloudFileId' in file && file.state !== 'broken';
    var isLocalFile = 'id' in file;
    var dispatch = (0, redux_1.useDispatch)();
    var _e = (0, react_1.useState)(null), loadingState = _e[0], setLoadingState = _e[1];
    (0, react_1.useEffect)(function () {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = setNewName;
                        return [4 /*yield*/, uniqueBudgetName(file.name + fileEndingTranslation)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]);
                        return [2 /*return*/];
                }
            });
        }); })();
    }, [file.name, fileEndingTranslation]);
    var validateAndSetName = function (name) { return __awaiter(_this, void 0, void 0, function () {
        var trimmedName, _a, valid, message;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedName = name.trim();
                    return [4 /*yield*/, validateBudgetName(trimmedName)];
                case 1:
                    _a = _b.sent(), valid = _a.valid, message = _a.message;
                    if (valid) {
                        setNewName(trimmedName);
                        setNameError(null);
                    }
                    else {
                        // The "Unknown error" should never happen, but this satifies type checking
                        setNameError(message !== null && message !== void 0 ? message : t('Unknown error with budget name'));
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDuplicate = function (sync) { return __awaiter(_this, void 0, void 0, function () {
        var _a, valid, message, e_1, newError, failError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, validateBudgetName(newName)];
                case 1:
                    _a = _b.sent(), valid = _a.valid, message = _a.message;
                    if (!valid) return [3 /*break*/, 7];
                    setLoadingState(sync === 'cloudSync' ? 'cloud' : 'local');
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, 5, 6]);
                    return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.duplicateBudget)({
                            id: 'id' in file ? file.id : undefined,
                            oldName: file.name,
                            newName: newName,
                            cloudSync: sync === 'cloudSync',
                            managePage: managePage,
                            loadBudget: loadBudget,
                        }))];
                case 3:
                    _b.sent();
                    dispatch((0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'message',
                            message: t('Duplicate file “{{newName}}” created.', { newName: newName }),
                        },
                    }));
                    if (onComplete)
                        onComplete({ status: 'success' });
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _b.sent();
                    newError = new Error(t('Failed to duplicate budget file'));
                    if (onComplete)
                        onComplete({ status: 'failed', error: newError });
                    else
                        console.error('Failed to duplicate budget file:', e_1);
                    dispatch((0, notificationsSlice_1.addNotification)({
                        notification: {
                            type: 'error',
                            message: t('Failed to duplicate budget file.'),
                        },
                    }));
                    return [3 /*break*/, 6];
                case 5:
                    setLoadingState(null);
                    return [7 /*endfinally*/];
                case 6: return [3 /*break*/, 8];
                case 7:
                    failError = new Error(message !== null && message !== void 0 ? message : t('Unknown error with budget name'));
                    if (onComplete)
                        onComplete({ status: 'failed', error: failError });
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<Modal_1.Modal name="duplicate-budget">
      {function (_a) {
            var close = _a.state.close;
            return (<view_1.View style={{ maxWidth: 700 }}>
          <Modal_1.ModalHeader title={t('Duplicate “{{fileName}}”', { fileName: file.name })} rightContent={<Modal_1.ModalCloseButton onPress={function () {
                        close();
                        if (onComplete)
                            onComplete({ status: 'canceled' });
                    }}/>}/>

          <view_1.View style={{
                    padding: 15,
                    gap: 15,
                    paddingTop: 0,
                    paddingBottom: 25,
                    lineHeight: '1.5em',
                }}>
            <inline_field_1.InlineField label={t('New Budget Name')} width="100%" labelWidth={150}>
              <initial_focus_1.InitialFocus>
                <input_1.Input name="name" value={newName} aria-label={t('New Budget Name')} aria-invalid={nameError ? 'true' : 'false'} onChangeValue={setNewName} onUpdate={validateAndSetName} style={{ flex: 1 }}/>
              </initial_focus_1.InitialFocus>
            </inline_field_1.InlineField>
            {nameError && (<form_error_1.FormError style={{ marginLeft: 150, color: theme_1.theme.warningText }}>
                {nameError}
              </form_error_1.FormError>)}

            {isLocalFile ? (isCloudFile && (<text_1.Text>
                  <react_i18next_1.Trans>
                    Your budget is hosted on a server, making it accessible for
                    download on your devices.
                    <br />
                    Would you like to duplicate this budget for all your devices
                    or keep it stored locally on this device?
                  </react_i18next_1.Trans>
                </text_1.Text>)) : (<text_1.Text>
                <react_i18next_1.Trans>
                  Unable to duplicate a budget that is not located on your
                  device.
                  <br />
                  Please download the budget from the server before duplicating.
                </react_i18next_1.Trans>
              </text_1.Text>)}
            <Modal_1.ModalButtons>
              <button_1.Button onPress={function () {
                    close();
                    if (onComplete)
                        onComplete({ status: 'canceled' });
                }}>
                <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
              </button_1.Button>
              {isLocalFile && isCloudFile && (<button_1.ButtonWithLoading variant={loadingState !== null ? 'bare' : 'primary'} isLoading={loadingState === 'cloud'} style={{
                        marginLeft: 10,
                    }} onPress={function () { return handleDuplicate('cloudSync'); }}>
                  <react_i18next_1.Trans>Duplicate for all devices</react_i18next_1.Trans>
                </button_1.ButtonWithLoading>)}
              {isLocalFile && (<button_1.ButtonWithLoading variant={loadingState !== null
                        ? 'bare'
                        : isCloudFile
                            ? 'normal'
                            : 'primary'} isLoading={loadingState === 'local'} style={{
                        marginLeft: 10,
                    }} onPress={function () { return handleDuplicate('localOnly'); }}>
                  {isCloudFile ? (<react_i18next_1.Trans>Duplicate locally</react_i18next_1.Trans>) : (<react_i18next_1.Trans>Duplicate</react_i18next_1.Trans>)}
                </button_1.ButtonWithLoading>)}
            </Modal_1.ModalButtons>
          </view_1.View>
        </view_1.View>);
        }}
    </Modal_1.Modal>);
}
function validateBudgetName(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetch_1.send)('validate-budget-name', { name: name })];
        });
    });
}
function uniqueBudgetName(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, fetch_1.send)('unique-budget-name', { name: name })];
        });
    });
}
