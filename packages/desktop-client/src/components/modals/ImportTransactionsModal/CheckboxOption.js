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
exports.CheckboxOption = CheckboxOption;
var react_1 = require("react");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var forms_1 = require("@desktop-client/components/forms");
function CheckboxOption(_a) {
    var id = _a.id, checked = _a.checked, disabled = _a.disabled, onChange = _a.onChange, children = _a.children, style = _a.style;
    return (<view_1.View style={__assign({ flex: 1, flexDirection: 'row', alignItems: 'center', userSelect: 'none', minHeight: 28 }, style)}>
      <forms_1.Checkbox id={id} checked={checked} disabled={disabled} onChange={onChange}/>
      <label htmlFor={id} style={{
            userSelect: 'none',
            color: disabled ? theme_1.theme.pageTextSubdued : undefined,
        }}>
        {children}
      </label>
    </view_1.View>);
}
