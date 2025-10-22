"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveReportDelete = SaveReportDelete;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
function SaveReportDelete(_a) {
    var onDelete = _a.onDelete, onClose = _a.onClose, name = _a.name;
    return (<>
      <view_1.View style={{ align: 'center' }}>
        <text_1.Text style={{ color: theme_1.theme.errorText, marginBottom: 5 }}>
          <react_i18next_1.Trans>
            Are you sure you want to delete the report named{' ‘'}
            <text_1.Text style={{ display: 'inline' }}>
              {{ name: name }}
            </text_1.Text>
            ’?
          </react_i18next_1.Trans>
        </text_1.Text>
      </view_1.View>

      <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ marginTop: 15 }}>
        <view_1.View style={{ flex: 1 }}/>
        <button_1.Button variant="primary" autoFocus onPress={onDelete}>
          <react_i18next_1.Trans>Yes</react_i18next_1.Trans>
        </button_1.Button>
        <button_1.Button variant="primary" onPress={onClose}>
          <react_i18next_1.Trans>No</react_i18next_1.Trans>
        </button_1.Button>
      </stack_1.Stack>
    </>);
}
