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
exports.Checkbox = exports.FormField = exports.FormTextLabel = exports.FormLabel = exports.SectionLabel = void 0;
var react_1 = require("react");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var SectionLabel = function (_a) {
    var title = _a.title, style = _a.style;
    return (<view_1.View style={__assign({ fontWeight: 500, textTransform: 'uppercase', color: theme_1.theme.formLabelText, marginBottom: 5, lineHeight: '1em' }, style)}>
      {title}
    </view_1.View>);
};
exports.SectionLabel = SectionLabel;
var defaultLabelStyle = {
    fontSize: 13,
    marginBottom: 3,
    color: theme_1.theme.tableText,
};
var FormLabel = function (_a) {
    var style = _a.style, title = _a.title, id = _a.id, htmlFor = _a.htmlFor;
    return (<text_1.Text style={__assign(__assign({}, defaultLabelStyle), style)}>
      <label htmlFor={htmlFor} id={id}>
        {title}
      </label>
    </text_1.Text>);
};
exports.FormLabel = FormLabel;
var FormTextLabel = function (_a) {
    var style = _a.style, title = _a.title, id = _a.id;
    return (<text_1.Text style={__assign(__assign(__assign({}, defaultLabelStyle), { cursor: 'default' }), style)}>
      <span id={id}>{title}</span>
    </text_1.Text>);
};
exports.FormTextLabel = FormTextLabel;
var FormField = function (_a) {
    var style = _a.style, children = _a.children;
    return <view_1.View style={style}>{children}</view_1.View>;
};
exports.FormField = FormField;
var Checkbox = function (props) {
    return (<input type="checkbox" {...props} className={(0, css_1.css)([
            {
                position: 'relative',
                margin: 0,
                flexShrink: 0,
                marginRight: 6,
                width: 15,
                height: 15,
                appearance: 'none',
                outline: 0,
                border: '1px solid ' + theme_1.theme.formInputBorder,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme_1.theme.checkboxText,
                backgroundColor: theme_1.theme.tableBackground,
                ':checked': {
                    border: '1px solid ' + theme_1.theme.checkboxBorderSelected,
                    backgroundColor: theme_1.theme.checkboxBackgroundSelected,
                    '::after': {
                        display: 'block',
                        background: theme_1.theme.checkboxBackgroundSelected +
                            // eslint-disable-next-line actual/typography
                            ' url(\'data:image/svg+xml; utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill="white" d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>\') 9px 9px',
                        width: 9,
                        height: 9,
                        // eslint-disable-next-line actual/typography
                        content: '" "',
                    },
                },
                ':disabled': {
                    border: '1px solid ' + theme_1.theme.buttonNormalDisabledBorder,
                    backgroundColor: theme_1.theme.buttonNormalDisabledBorder,
                },
                ':checked:disabled': {
                    border: '1px solid ' + theme_1.theme.buttonNormalDisabledBorder,
                    backgroundColor: theme_1.theme.buttonNormalDisabledBorder,
                    '::after': {
                        backgroundColor: theme_1.theme.buttonNormalDisabledBorder,
                    },
                },
                '&:focus-visible': {
                    '::before': {
                        position: 'absolute',
                        top: -5,
                        bottom: -5,
                        left: -5,
                        right: -5,
                        border: '2px solid ' + theme_1.theme.checkboxBorderSelected,
                        borderRadius: 6,
                        // eslint-disable-next-line actual/typography
                        content: '" "',
                    },
                },
            },
            props.style,
        ])}/>);
};
exports.Checkbox = Checkbox;
