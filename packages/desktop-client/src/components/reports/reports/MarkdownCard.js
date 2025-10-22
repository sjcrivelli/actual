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
exports.MarkdownCard = MarkdownCard;
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
var react_i18next_1 = require("react-i18next");
var react_markdown_1 = require("react-markdown");
var menu_1 = require("@actual-app/components/menu");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var rehype_external_links_1 = require("rehype-external-links");
var remark_gfm_1 = require("remark-gfm");
var constants_1 = require("@desktop-client/components/reports/constants");
var ReportCard_1 = require("@desktop-client/components/reports/ReportCard");
var markdown_1 = require("@desktop-client/util/markdown");
var remarkPlugins = [markdown_1.sequentialNewlinesPlugin, remark_gfm_1.default, markdown_1.remarkBreaks];
var markdownStyles = (0, css_1.css)(markdown_1.markdownBaseStyles, {
    paddingRight: 20,
    '& table': {
        display: 'inline-table',
        ':not(:last-child)': {
            marginBottom: '0.75rem',
        },
    },
});
function MarkdownCard(_a) {
    var isEditing = _a.isEditing, meta = _a.meta, onMetaChange = _a.onMetaChange, onRemove = _a.onRemove;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(false), isVisibleTextArea = _b[0], setIsVisibleTextArea = _b[1];
    return (<ReportCard_1.ReportCard isEditing={isEditing} disableClick={isVisibleTextArea} menuItems={[
            {
                type: menu_1.Menu.label,
                name: t('Text position:'),
                text: '',
            },
            {
                name: 'text-left',
                text: t('Left'),
            },
            {
                name: 'text-center',
                text: t('Center'),
            },
            {
                name: 'text-right',
                text: t('Right'),
            },
            menu_1.Menu.line,
            {
                name: 'edit',
                text: t('Edit content'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ]} onMenuSelect={function (item) {
            switch (item) {
                case 'text-left':
                    onMetaChange(__assign(__assign({}, meta), { text_align: 'left' }));
                    break;
                case 'text-center':
                    onMetaChange(__assign(__assign({}, meta), { text_align: 'center' }));
                    break;
                case 'text-right':
                    onMetaChange(__assign(__assign({}, meta), { text_align: 'right' }));
                    break;
                case 'edit':
                    setIsVisibleTextArea(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error("Unrecognized selection: ".concat(item));
            }
        }}>
      <view_1.View style={{
            flex: 1,
            paddingTop: 5,
            paddingLeft: 20,
            overflowY: 'auto',
            height: '100%',
            textAlign: meta.text_align,
        }}>
        {isVisibleTextArea ? (<react_aria_components_1.TextArea style={{
                height: '100%',
                border: 0,
                marginTop: 11,
                marginBottom: 11,
                marginRight: 20,
                color: theme_1.theme.formInputText,
                backgroundColor: theme_1.theme.tableBackground,
            }} className={constants_1.NON_DRAGGABLE_AREA_CLASS_NAME} autoFocus defaultValue={meta.content} onBlur={function (event) {
                onMetaChange(__assign(__assign({}, meta), { content: event.currentTarget.value }));
                setIsVisibleTextArea(false);
            }}/>) : (<text_1.Text className={markdownStyles}>
            <react_markdown_1.default remarkPlugins={remarkPlugins} rehypePlugins={[
                [
                    rehype_external_links_1.default,
                    { target: '_blank', rel: ['noopener', 'noreferrer'] },
                ],
            ]}>
              {meta.content}
            </react_markdown_1.default>
          </text_1.Text>)}
      </view_1.View>
    </ReportCard_1.ReportCard>);
}
