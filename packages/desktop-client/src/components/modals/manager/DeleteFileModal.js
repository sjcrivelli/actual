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
exports.DeleteFileModal = DeleteFileModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useSyncServerStatus_1 = require("@desktop-client/hooks/useSyncServerStatus");
var redux_1 = require("@desktop-client/redux");
function DeleteFileModal(_a) {
    var _this = this;
    var file = _a.file;
    var t = (0, react_i18next_1.useTranslation)().t;
    // If the state is "broken" that means it was created by another
    // user. The current user should be able to delete the local file,
    // but not the remote one
    var isCloudFile = 'cloudFileId' in file && file.state !== 'broken';
    var serverStatus = (0, useSyncServerStatus_1.useSyncServerStatus)();
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(null), loadingState = _b[0], setLoadingState = _b[1];
    return (<Modal_1.Modal name="delete-budget">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Delete {{fileName}}', { fileName: file.name })} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    padding: 15,
                    gap: 15,
                    paddingTop: 0,
                    paddingBottom: 25,
                    maxWidth: 512,
                    lineHeight: '1.5em',
                }}>
            {isCloudFile && (<>
                <text_1.Text>
                  <react_i18next_1.Trans>
                    This is a <strong>hosted file</strong> which means it is
                    stored on your server to make it available for download on
                    any device. You can delete it from the server, which will
                    also remove it from all of your devices.
                  </react_i18next_1.Trans>
                </text_1.Text>

                {serverStatus === 'online' ? (<button_1.ButtonWithLoading variant="primary" isLoading={loadingState === 'cloud'} style={{
                            backgroundColor: theme_1.theme.errorText,
                            alignSelf: 'center',
                            border: 0,
                            padding: '10px 30px',
                            fontSize: 14,
                        }} onPress={function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        setLoadingState('cloud');
                                        return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.deleteBudget)({
                                                id: 'id' in file ? file.id : undefined,
                                                cloudFileId: file.cloudFileId,
                                            }))];
                                    case 1:
                                        _a.sent();
                                        setLoadingState(null);
                                        close();
                                        return [2 /*return*/];
                                }
                            });
                        }); }}>
                    <react_i18next_1.Trans>Delete file from all devices</react_i18next_1.Trans>
                  </button_1.ButtonWithLoading>) : (<button_1.Button isDisabled style={{
                            alignSelf: 'center',
                            padding: '10px 30px',
                            fontSize: 14,
                        }}>
                    <react_i18next_1.Trans>Server is not available</react_i18next_1.Trans>
                  </button_1.Button>)}
              </>)}

            {'id' in file && (<>
                {isCloudFile ? (<text_1.Text>
                    <react_i18next_1.Trans>
                      You can also delete just the local copy. This will remove
                      all local data and the file will be listed as available
                      for download.
                    </react_i18next_1.Trans>
                  </text_1.Text>) : (<text_1.Text>
                    {file.state === 'broken' ? (<react_i18next_1.Trans>
                        This is a <strong>hosted file</strong> but it was
                        created by another user. You can only delete the local
                        copy.
                      </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
                        This a <strong>local file</strong> which is not stored
                        on a server.
                      </react_i18next_1.Trans>)}{' '}
                    <react_i18next_1.Trans>
                      Deleting it will remove it and all of its backups
                      permanently.
                    </react_i18next_1.Trans>
                  </text_1.Text>)}

                <button_1.ButtonWithLoading variant={isCloudFile ? 'normal' : 'primary'} isLoading={loadingState === 'local'} style={__assign({ alignSelf: 'center', marginTop: 10, padding: '10px 30px', fontSize: 14 }, (isCloudFile
                        ? {
                            color: theme_1.theme.errorText,
                            borderColor: theme_1.theme.errorText,
                        }
                        : {
                            border: 0,
                            backgroundColor: theme_1.theme.errorText,
                        }))} onPress={function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    setLoadingState('local');
                                    return [4 /*yield*/, dispatch((0, budgetfilesSlice_1.deleteBudget)({ id: file.id }))];
                                case 1:
                                    _a.sent();
                                    setLoadingState(null);
                                    close();
                                    return [2 /*return*/];
                            }
                        });
                    }); }}>
                  <react_i18next_1.Trans>Delete file locally</react_i18next_1.Trans>
                </button_1.ButtonWithLoading>
              </>)}
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
