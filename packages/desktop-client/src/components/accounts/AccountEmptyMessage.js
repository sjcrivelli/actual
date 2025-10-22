"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountEmptyMessage = AccountEmptyMessage;
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
function AccountEmptyMessage(_a) {
    var onAdd = _a.onAdd;
    return (<view_1.View style={{
            color: theme_1.theme.tableText,
            backgroundColor: theme_1.theme.tableBackground,
            flex: 1,
            alignItems: 'center',
            borderTopWidth: 1,
            borderColor: theme_1.theme.tableBorder,
        }}>
      <view_1.View style={{
            width: 550,
            marginTop: 75,
            fontSize: 15,
            alignItems: 'center',
        }}>
        <text_1.Text style={{ textAlign: 'center', lineHeight: '1.4em' }}>
          <react_i18next_1.Trans>
            For Actual to be useful, you need to <strong>add an account</strong>
            . You can link an account to automatically download transactions, or
            manage it locally yourself.
          </react_i18next_1.Trans>
        </text_1.Text>

        <button_1.Button variant="primary" style={{ marginTop: 20 }} autoFocus onPress={onAdd}>
          <react_i18next_1.Trans>Add account</react_i18next_1.Trans>
        </button_1.Button>

        <view_1.View style={{ marginTop: 20, fontSize: 13, color: theme_1.theme.tableTextLight }}>
          <react_i18next_1.Trans>In the future, you can add accounts from the sidebar.</react_i18next_1.Trans>
        </view_1.View>
      </view_1.View>
    </view_1.View>);
}
