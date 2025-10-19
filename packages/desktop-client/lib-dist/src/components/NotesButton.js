import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback, } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCustomNotesPaper } from '@actual-app/components/icons/v2';
import { Popover } from '@actual-app/components/popover';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';
import { css, cx } from '@emotion/css';
import { send } from 'loot-core/platform/client/fetch';
import { Notes } from './Notes';
import { useNotes } from '@desktop-client/hooks/useNotes';
export function NotesButton({ id, width = 12, height = 12, defaultColor = theme.buttonNormalText, tooltipPosition = 'bottom start', showPlaceholder = false, style, }) {
    const { t } = useTranslation();
    const triggerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const note = useNotes(id) || '';
    const hasNotes = note && note !== '';
    const [tempNotes, setTempNotes] = useState(note);
    useEffect(() => setTempNotes(note), [note, id]);
    const onOpenChange = useCallback(isOpen => {
        if (!isOpen) {
            if (tempNotes !== note) {
                void send('notes-save', { id, note: tempNotes });
            }
            setIsOpen(false);
        }
    }, [id, note, tempNotes]);
    return (_jsxs(Tooltip, { content: _jsx(Notes, { notes: note }), placement: tooltipPosition, triggerProps: {
            isDisabled: !hasNotes || isOpen,
        }, children: [_jsx(View, { style: { flexShrink: 0 }, children: _jsx(Button, { ref: triggerRef, variant: "bare", "aria-label": t('View notes'), className: cx(css({
                        color: defaultColor,
                        ...style,
                        ...(showPlaceholder && {
                            opacity: hasNotes || isOpen ? 1 : 0.3,
                        }),
                        ...(isOpen && { color: theme.buttonNormalText }),
                        '&:hover': { opacity: 1 },
                    }), !hasNotes && !isOpen && !showPlaceholder ? 'hover-visible' : ''), "data-placeholder": showPlaceholder, onPress: () => {
                        setIsOpen(true);
                    }, children: _jsx(SvgCustomNotesPaper, { style: { width, height, flexShrink: 0 } }) }) }), _jsx(Popover, { triggerRef: triggerRef, isOpen: isOpen, onOpenChange: onOpenChange, placement: tooltipPosition, style: { padding: 4 }, children: _jsx(Notes, { notes: tempNotes, editable: true, focused: true, onChange: setTempNotes }) })] }));
}
