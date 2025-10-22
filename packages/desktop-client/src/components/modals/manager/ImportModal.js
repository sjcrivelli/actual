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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportModal = ImportModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function ImportModal() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var error = (0, react_1.useState)(false)[0];
    function onSelectType(type) {
        switch (type) {
            case 'ynab4':
                dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'import-ynab4' } }));
                break;
            case 'ynab5':
                dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'import-ynab5' } }));
                break;
            case 'actual':
                dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'import-actual' } }));
                break;
            default:
        }
    }
    function getErrorMessage(error) {
        switch (error) {
            case 'not-ynab4':
                return t('This file is not valid. Please select a .ynab4 file');
            default:
                return t('An unknown error occurred while importing. Please report this as a new issue on GitHub.');
        }
    }
    var itemStyle = {
        padding: 10,
        border: '1px solid ' + theme_1.theme.tableBorder,
        borderRadius: 6,
        marginBottom: 10,
        display: 'block',
    };
    return (<Modal_1.Modal name="import" containerProps={{ style: { width: 400 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Import From')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={__assign(__assign({}, styles_1.styles.smallText), { lineHeight: 1.5 })}>
            {error && (<block_1.Block style={{ color: theme_1.theme.errorText, marginBottom: 15 }}>
                {getErrorMessage(error)}
              </block_1.Block>)}

            <text_1.Text style={{ marginBottom: 15 }}>
              <react_i18next_1.Trans>
                Select an app to import from, and we’ll guide you through the
                process.
              </react_i18next_1.Trans>
            </text_1.Text>

            <button_1.Button style={itemStyle} onPress={function () { return onSelectType('ynab4'); }}>
              <span style={{ fontWeight: 700 }}>YNAB4</span>
              <view_1.View style={{ color: theme_1.theme.pageTextLight }}>
                <react_i18next_1.Trans>The old unsupported desktop app</react_i18next_1.Trans>
              </view_1.View>
            </button_1.Button>
            <button_1.Button style={itemStyle} onPress={function () { return onSelectType('ynab5'); }}>
              <span style={{ fontWeight: 700 }}>nYNAB</span>
              <view_1.View style={{ color: theme_1.theme.pageTextLight }}>
                <div>
                  <react_i18next_1.Trans>The newer web app</react_i18next_1.Trans>
                </div>
              </view_1.View>
            </button_1.Button>
            <button_1.Button style={itemStyle} onPress={function () { return onSelectType('actual'); }}>
              <span style={{ fontWeight: 700 }}>Actual</span>
              <view_1.View style={{ color: theme_1.theme.pageTextLight }}>
                <div>
                  <react_i18next_1.Trans>Import a file exported from Actual</react_i18next_1.Trans>
                </div>
              </view_1.View>
            </button_1.Button>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
