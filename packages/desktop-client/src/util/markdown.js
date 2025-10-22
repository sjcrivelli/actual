"use strict";
// @ts-strict-ignore
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownBaseStyles = void 0;
exports.sequentialNewlinesPlugin = sequentialNewlinesPlugin;
exports.remarkBreaks = remarkBreaks;
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var css_1 = require("@emotion/css");
var mdast_util_newline_to_break_1 = require("mdast-util-newline-to-break");
function sequentialNewlinesPlugin() {
    // Adapted from https://codesandbox.io/s/create-react-app-forked-h3rmcy?file=/src/sequentialNewlinePlugin.js:0-774
    var data = this.data();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function add(field, value) {
        var list = data[field] ? data[field] : (data[field] = []);
        list.push(value);
    }
    add('fromMarkdownExtensions', {
        enter: {
            lineEndingBlank: function enterLineEndingBlank(token) {
                this.enter({
                    type: 'break',
                    value: '',
                    data: {},
                    children: [],
                }, token);
            },
        },
        exit: {
            lineEndingBlank: function exitLineEndingBlank(token) {
                this.exit(token);
            },
        },
    });
}
function remarkBreaks() {
    return mdast_util_newline_to_break_1.newlineToBreak;
}
exports.markdownBaseStyles = (0, css_1.css)({
    overflowWrap: 'break-word',
    '& p': {
        margin: 0,
        ':not(:first-child)': {
            marginTop: '0.25rem',
        },
    },
    '& ul, & ol': {
        listStylePosition: 'inside',
        margin: 0,
        paddingLeft: 0,
    },
    '&>* ul, &>* ol': {
        marginLeft: '1.5rem',
    },
    '& li>p': {
        display: 'contents',
    },
    '& blockquote': {
        paddingLeft: '0.75rem',
        borderLeft: '3px solid ' + theme_1.theme.markdownDark,
        margin: 0,
    },
    '& hr': {
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid ' + theme_1.theme.markdownNormal,
    },
    '& code': {
        backgroundColor: theme_1.theme.markdownLight,
        padding: '0.1rem 0.5rem',
        borderRadius: '0.25rem',
    },
    '& pre': {
        padding: '0.5rem',
        backgroundColor: theme_1.theme.markdownLight,
        textAlign: 'left',
        borderRadius: '0.5rem',
        margin: 0,
        ':not(:first-child)': {
            marginTop: '0.25rem',
        },
        '& code': {
            background: 'inherit',
            padding: 0,
            borderRadius: 0,
        },
    },
    '& table, & th, & td': {
        border: '1px solid ' + theme_1.theme.markdownNormal,
    },
    '& table': {
        borderCollapse: 'collapse',
        wordBreak: 'break-word',
    },
    '& td': {
        padding: '0.25rem 0.75rem',
    },
    '& h3': styles_1.styles.mediumText,
});
