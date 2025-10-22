"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveReportName = SaveReportName;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var forms_1 = require("@desktop-client/components/forms");
function SaveReportName(_a) {
    var menuItem = _a.menuItem, name = _a.name, setName = _a.setName, inputRef = _a.inputRef, onAddUpdate = _a.onAddUpdate, err = _a.err, report = _a.report;
    var t = (0, react_i18next_1.useTranslation)().t;
    (0, react_1.useEffect)(function () {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (<>
      {menuItem !== 'update-report' && (<react_aria_components_1.Form onSubmit={function (e) {
                e.preventDefault();
                onAddUpdate({
                    menuChoice: menuItem !== null && menuItem !== void 0 ? menuItem : undefined,
                    reportData: report !== null && report !== void 0 ? report : undefined,
                });
            }}>
          <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ padding: 15 }}>
            <forms_1.FormField style={{ flex: 1 }}>
              <forms_1.FormLabel title={t('Report Name')} htmlFor="name-field" style={{ userSelect: 'none' }}/>
              <input_1.Input value={name} id="name-field" ref={inputRef} onChangeValue={setName} style={{ marginTop: 10 }}/>
            </forms_1.FormField>
            <button_1.Button variant="primary" type="submit" style={{ marginTop: 30 }}>
              {menuItem === 'save-report' ? t('Add') : t('Update')}
            </button_1.Button>
          </stack_1.Stack>
        </react_aria_components_1.Form>)}
      {err !== '' ? (<stack_1.Stack direction="row" align="center" style={{ padding: 10 }}>
          <text_1.Text style={{ color: theme_1.theme.errorText }}>{err}</text_1.Text>
        </stack_1.Stack>) : (<view_1.View />)}
    </>);
}
