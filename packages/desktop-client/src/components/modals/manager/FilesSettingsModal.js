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
exports.FilesSettingsModal = FilesSettingsModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function FileLocationSettings() {
    var _a = (0, useGlobalPref_1.useGlobalPref)('documentDir'), documentDir = _a[0], _setDocumentDirPref = _a[1];
    var _b = (0, react_1.useState)(false), _documentDirChanged = _b[0], setDirChanged = _b[1];
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    function onChooseDocumentDir() {
        return __awaiter(this, void 0, void 0, function () {
            var chosenDirectory;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, window.Actual.openFileDialog({
                            properties: ['openDirectory'],
                        })];
                    case 1:
                        chosenDirectory = _a.sent();
                        if (chosenDirectory && documentDir && chosenDirectory[0] !== documentDir) {
                            setDirChanged(true);
                            dispatch((0, modalsSlice_1.pushModal)({
                                modal: {
                                    name: 'confirm-change-document-dir',
                                    options: {
                                        currentBudgetDirectory: documentDir,
                                        newDirectory: chosenDirectory[0],
                                    },
                                },
                            }));
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    return (<view_1.View style={{
            gap: 15,
            backgroundColor: theme_1.theme.pillBackground,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            padding: 15,
            borderRadius: 4,
            border: '1px solid ' + theme_1.theme.pillBorderDark,
            width: '100%',
        }}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Actual’s data directory</strong>{' '}
          <small style={{ marginLeft: '0.5rem' }}>
            <i>where your files are stored</i>
          </small>
        </react_i18next_1.Trans>
      </text_1.Text>
      <view_1.View style={{ flexDirection: 'row', gap: '0.5rem', width: '100%' }}>
        <text_1.Text title={documentDir} style={__assign(__assign({ backgroundColor: theme_1.theme.pageBackground, padding: '5px 10px', borderRadius: 4, overflow: 'auto', whiteSpace: 'nowrap', width: '100%' }, styles_1.styles.horizontalScrollbar), { '::-webkit-scrollbar': {
                height: '8px',
            } })}>
          {documentDir}
        </text_1.Text>
        <button_1.Button onPress={onChooseDocumentDir} aria-label={t('Change location')}>
          <v2_1.SvgPencil1 style={{
            width: 11,
            height: 11,
        }}/>
        </button_1.Button>
      </view_1.View>
    </view_1.View>);
}
function SelfSignedCertLocationSettings() {
    var _a = (0, useGlobalPref_1.useGlobalPref)('serverSelfSignedCert'), serverSelfSignedCertPref = _a[0], _setServerSelfSignedCertPref = _a[1];
    if (!serverSelfSignedCertPref) {
        return null;
    }
    return (<view_1.View style={{
            gap: 15,
            backgroundColor: theme_1.theme.pillBackground,
            alignSelf: 'flex-start',
            alignItems: 'flex-start',
            padding: 15,
            borderRadius: 4,
            border: '1px solid ' + theme_1.theme.pillBorderDark,
            width: '100%',
        }}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Server self-signed certificate</strong>{' '}
          <small style={{ marginLeft: '0.5rem' }}>
            <i>enables a secure connection</i>
          </small>
        </react_i18next_1.Trans>
      </text_1.Text>
      <view_1.View style={{ flexDirection: 'row', gap: '0.5rem', width: '100%' }}>
        <text_1.Text title={serverSelfSignedCertPref} style={__assign(__assign({ backgroundColor: theme_1.theme.pageBackground, padding: '5px 10px', borderRadius: 4, overflow: 'auto', whiteSpace: 'nowrap', width: '100%' }, styles_1.styles.horizontalScrollbar), { '::-webkit-scrollbar': {
                height: '8px',
            } })}>
          {serverSelfSignedCertPref}
        </text_1.Text>
      </view_1.View>
    </view_1.View>);
}
function FilesSettingsModal() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    function closeModal(close) {
        dispatch((0, budgetfilesSlice_1.loadAllFiles)());
        close();
    }
    return (<Modal_1.Modal name="files-settings">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Settings')} rightContent={<Modal_1.ModalCloseButton onPress={function () { return closeModal(close); }}/>}/>
          <view_1.View style={{
                    padding: 15,
                    gap: 15,
                    paddingTop: 0,
                    paddingBottom: 25,
                    maxWidth: 550,
                    lineHeight: '1.5em',
                }}>
            <FileLocationSettings />
            <SelfSignedCertLocationSettings />
            <button_1.Button variant="primary" style={{
                    padding: '10px 30px',
                    fontSize: 14,
                    alignSelf: 'center',
                }} onPress={function () { return closeModal(close); }}>
              <react_i18next_1.Trans>OK</react_i18next_1.Trans>
            </button_1.Button>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
