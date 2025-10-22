"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveReportChoose = SaveReportChoose;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var GenericInput_1 = require("@desktop-client/components/util/GenericInput");
function SaveReportChoose(_a) {
    var onApply = _a.onApply;
    var inputRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)(''), err = _b[0], setErr = _b[1];
    var _c = (0, react_1.useState)(''), value = _c[0], setValue = _c[1];
    (0, react_1.useEffect)(function () {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (<>
      <react_aria_components_1.Form onSubmit={function (e) {
            e.preventDefault();
            if (!value) {
                setErr('Invalid report entered');
                return;
            }
            onApply(value);
        }}>
        <view_1.View style={{ flexDirection: 'row', align: 'center' }}>
          <text_1.Text style={{ userSelect: 'none', flex: 1 }}>
            <react_i18next_1.Trans>Choose Report</react_i18next_1.Trans>
          </text_1.Text>
          <view_1.View style={{ flex: 1 }}/>
        </view_1.View>
        <GenericInput_1.GenericInput ref={inputRef} field="report" subfield={null} type="saved" value={value} multi={false} style={{ marginTop: 10 }} onChange={function (v) { return setValue(v); }}/>

        <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ marginTop: 15 }}>
          <view_1.View style={{ flex: 1 }}/>
          <button_1.Button variant="primary" type="submit">
            <react_i18next_1.Trans>Apply</react_i18next_1.Trans>
          </button_1.Button>
        </stack_1.Stack>
      </react_aria_components_1.Form>
      {err !== '' ? (<stack_1.Stack direction="row" align="center" style={{ padding: 10 }}>
          <text_1.Text style={{ color: theme_1.theme.errorText }}>{err}</text_1.Text>
        </stack_1.Stack>) : (<view_1.View />)}
    </>);
}
