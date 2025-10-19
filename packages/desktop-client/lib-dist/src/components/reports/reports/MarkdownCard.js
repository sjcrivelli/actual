import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { TextArea } from 'react-aria-components';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Menu } from '@actual-app/components/menu';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import { NON_DRAGGABLE_AREA_CLASS_NAME } from '@desktop-client/components/reports/constants';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
import { remarkBreaks, sequentialNewlinesPlugin, markdownBaseStyles, } from '@desktop-client/util/markdown';
const remarkPlugins = [sequentialNewlinesPlugin, remarkGfm, remarkBreaks];
const markdownStyles = css(markdownBaseStyles, {
    paddingRight: 20,
    '& table': {
        display: 'inline-table',
        ':not(:last-child)': {
            marginBottom: '0.75rem',
        },
    },
});
export function MarkdownCard({ isEditing, meta, onMetaChange, onRemove, }) {
    const { t } = useTranslation();
    const [isVisibleTextArea, setIsVisibleTextArea] = useState(false);
    return (_jsx(ReportCard, { isEditing: isEditing, disableClick: isVisibleTextArea, menuItems: [
            {
                type: Menu.label,
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
            Menu.line,
            {
                name: 'edit',
                text: t('Edit content'),
            },
            {
                name: 'remove',
                text: t('Remove'),
            },
        ], onMenuSelect: item => {
            switch (item) {
                case 'text-left':
                    onMetaChange({
                        ...meta,
                        text_align: 'left',
                    });
                    break;
                case 'text-center':
                    onMetaChange({
                        ...meta,
                        text_align: 'center',
                    });
                    break;
                case 'text-right':
                    onMetaChange({
                        ...meta,
                        text_align: 'right',
                    });
                    break;
                case 'edit':
                    setIsVisibleTextArea(true);
                    break;
                case 'remove':
                    onRemove();
                    break;
                default:
                    throw new Error(`Unrecognized selection: ${item}`);
            }
        }, children: _jsx(View, { style: {
                flex: 1,
                paddingTop: 5,
                paddingLeft: 20,
                overflowY: 'auto',
                height: '100%',
                textAlign: meta.text_align,
            }, children: isVisibleTextArea ? (_jsx(TextArea, { style: {
                    height: '100%',
                    border: 0,
                    marginTop: 11,
                    marginBottom: 11,
                    marginRight: 20,
                    color: theme.formInputText,
                    backgroundColor: theme.tableBackground,
                }, className: NON_DRAGGABLE_AREA_CLASS_NAME, autoFocus: true, defaultValue: meta.content, onBlur: event => {
                    onMetaChange({
                        ...meta,
                        content: event.currentTarget.value,
                    });
                    setIsVisibleTextArea(false);
                } })) : (_jsx(Text, { className: markdownStyles, children: _jsx(ReactMarkdown, { remarkPlugins: remarkPlugins, rehypePlugins: [
                        [
                            rehypeExternalLinks,
                            { target: '_blank', rel: ['noopener', 'noreferrer'] },
                        ],
                    ], children: meta.content }) })) }) }));
}
