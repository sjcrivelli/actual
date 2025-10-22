"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameFilter = NameFilter;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var input_1 = require("@actual-app/components/input");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var forms_1 = require("@desktop-client/components/forms");
function NameFilter(_a) {
    var menuItem = _a.menuItem, name = _a.name, setName = _a.setName, adding = _a.adding, onAddUpdate = _a.onAddUpdate, err = _a.err;
    var t = (0, react_i18next_1.useTranslation)().t;
    var inputRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    return (<>
      {menuItem !== 'update-filter' && (<react_aria_components_1.Form onSubmit={function (e) {
                e.preventDefault();
                onAddUpdate();
            }}>
          <stack_1.Stack direction="row" justify="flex-end" align="center" style={{ padding: 10 }}>
            <forms_1.FormField style={{ flex: 1 }}>
              <forms_1.FormLabel title={t('Filter name')} htmlFor="name-field" style={{ userSelect: 'none' }}/>
              <input_1.Input id="name-field" ref={inputRef} defaultValue={name || ''} onChangeValue={setName}/>
            </forms_1.FormField>
            <button_1.Button variant="primary" type="submit" style={{ marginTop: 18 }}>
              {adding ? t('Add') : t('Update')}
            </button_1.Button>
          </stack_1.Stack>
        </react_aria_components_1.Form>)}
      {err && (<stack_1.Stack direction="row" align="center" style={{ padding: 10 }}>
          <text_1.Text style={{ color: theme_1.theme.errorText }}>{err}</text_1.Text>
        </stack_1.Stack>)}
    </>);
}
