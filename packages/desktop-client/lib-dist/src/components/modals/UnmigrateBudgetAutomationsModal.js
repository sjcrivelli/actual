import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { AnimatedLoading } from '@actual-app/components/icons/AnimatedLoading';
import { Stack } from '@actual-app/components/stack';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { Link } from '@desktop-client/components/common/Link';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Notes } from '@desktop-client/components/Notes';
import { useCategory } from '@desktop-client/hooks/useCategory';
import { useNotes } from '@desktop-client/hooks/useNotes';
export function UnmigrateBudgetAutomationsModal({ categoryId, templates, }) {
    const { t } = useTranslation();
    const category = useCategory(categoryId);
    const existingNotes = useNotes(categoryId) || '';
    const [editedNotes, setEditedNotes] = useState('');
    const [rendered, setRendered] = useState(null);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const text = await send('budget/render-note-templates', templates);
                if (mounted)
                    setRendered(text);
            }
            catch (e) {
                if (mounted)
                    setRendered('');
            }
        })();
        return () => {
            mounted = false;
        };
    }, [templates]);
    // Seed editable notes once templates rendered
    useEffect(() => {
        if (rendered !== null) {
            const base = existingNotes.trimEnd();
            if (!rendered) {
                setEditedNotes(base);
                return;
            }
            const existingLineSet = new Set(base
                .split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0));
            const renderedLines = rendered
                .split('\n')
                .map(l => l.trimEnd())
                .filter(l => l.length > 0);
            const newLines = [];
            for (const line of renderedLines) {
                if (!existingLineSet.has(line.trim())) {
                    newLines.push(line);
                }
            }
            if (newLines.length === 0) {
                setEditedNotes(base);
            }
            else {
                const needsNewline = base && !base.endsWith('\n') ? '\n' : '';
                setEditedNotes(base +
                    needsNewline +
                    '\nExport from automations UI:\n' +
                    newLines.join('\n'));
            }
        }
    }, [rendered, existingNotes]);
    async function onSave(close) {
        setSaving(true);
        await send('notes-save-undoable', { id: categoryId, note: editedNotes });
        await send('budget/set-category-automations', {
            categoriesWithTemplates: [{ id: categoryId, templates }],
            source: 'notes',
        });
        setSaving(false);
        close();
    }
    return (_jsx(Modal, { name: "category-automations-unmigrate", containerProps: {
            style: { width: 850, height: 650, paddingBottom: 20 },
        }, children: ({ state: { close } }) => (_jsxs(Stack, { direction: "column", style: { height: '100%' }, spacing: 3, children: [_jsx(ModalHeader, { title: t('Un-migrate automations: {{category}}', {
                        category: category?.name,
                    }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), rendered === null ? (_jsx(View, { style: {
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }, children: _jsx(AnimatedLoading, { style: { width: 20, height: 20 } }) })) : (_jsxs(Stack, { spacing: 3, style: { overflowY: 'auto', flex: 1 }, children: [_jsx(View, { style: { display: 'inline-block', minHeight: 'unset' }, children: _jsxs(Trans, { children: ["If the automation UI isn't working for you, you can temporarily switch back to notes-based automations. Please let us know your feedback about what's not working on the", ' ', _jsx(Link, { variant: "external", to: "https://github.com/actualbudget/actual/issues/", children: "feedback issue" }), "."] }) }), _jsx(View, { children: _jsx(Trans, { children: "We have merged your existing automations with the notes for this category. Please review and edit as needed." }) }), _jsx(Notes, { notes: editedNotes, editable: true, focused: true, getStyle: () => ({
                                flex: 1,
                                borderRadius: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                resize: 'none',
                            }), onChange: setEditedNotes })] })), _jsxs(Stack, { direction: "row", justify: "flex-end", spacing: 2, children: [_jsx(Button, { onPress: () => close(), children: _jsx(Trans, { children: "Cancel" }) }), _jsxs(Button, { variant: "primary", onPress: () => onSave(close), isDisabled: saving, children: [saving && (_jsx(AnimatedLoading, { style: { width: 16, height: 16, marginRight: 6 } })), _jsx(Trans, { children: "Save notes & un-migrate" })] })] })] })) }));
}
