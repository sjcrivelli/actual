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
exports.Notes = Notes;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_markdown_1 = require("react-markdown");
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var rehype_external_links_1 = require("rehype-external-links");
var remark_gfm_1 = require("remark-gfm");
var markdown_1 = require("@desktop-client/util/markdown");
var remarkPlugins = [markdown_1.sequentialNewlinesPlugin, remark_gfm_1.default, markdown_1.remarkBreaks];
var markdownStyles = (0, css_1.css)(markdown_1.markdownBaseStyles, {
    display: 'block',
    maxWidth: 350,
    padding: 8,
});
function Notes(_a) {
    var notes = _a.notes, editable = _a.editable, focused = _a.focused, onChange = _a.onChange, onBlur = _a.onBlur, getStyle = _a.getStyle;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    var t = (0, react_i18next_1.useTranslation)().t;
    var textAreaRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (focused && editable) {
            textAreaRef.current.focus();
        }
    }, [focused, editable]);
    return editable ? (<textarea ref={textAreaRef} className={(0, css_1.css)(__assign(__assign(__assign({ border: '1px solid ' + theme_1.theme.buttonNormalBorder, padding: 7 }, (!isNarrowWidth && { minWidth: 350, minHeight: 120 })), { outline: 'none', backgroundColor: theme_1.theme.tableBackground, color: theme_1.theme.tableText }), getStyle === null || getStyle === void 0 ? void 0 : getStyle(editable)))} value={notes || ''} onChange={function (e) { return onChange === null || onChange === void 0 ? void 0 : onChange(e.target.value); }} onBlur={function (e) { return onBlur === null || onBlur === void 0 ? void 0 : onBlur(e.target.value); }} placeholder={t('Notes (markdown supported)')}/>) : (<text_1.Text className={(0, css_1.css)([markdownStyles, getStyle === null || getStyle === void 0 ? void 0 : getStyle(editable)])}>
      <react_markdown_1.default remarkPlugins={remarkPlugins} rehypePlugins={[
            [
                rehype_external_links_1.default,
                { target: '_blank', rel: ['noopener', 'noreferrer'] },
            ],
        ]}>
        {notes}
      </react_markdown_1.default>
    </text_1.Text>);
}
