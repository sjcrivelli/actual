import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-strict-ignore
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgCheck } from '@actual-app/components/icons/v2';
import { View } from '@actual-app/components/view';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { Notes } from '@desktop-client/components/Notes';
import { useNotes } from '@desktop-client/hooks/useNotes';
export function NotesModal({ id, name, onSave }) {
    const { t } = useTranslation();
    const originalNotes = useNotes(id);
    const [notes, setNotes] = useState(originalNotes);
    useEffect(() => setNotes(originalNotes), [originalNotes]);
    function _onSave() {
        if (notes !== originalNotes) {
            onSave?.(id, notes);
        }
    }
    return (_jsx(Modal, { name: "notes", containerProps: {
            style: { height: '50vh' },
        }, children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Notes: {{name}}', { name }), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsxs(View, { style: {
                        flex: 1,
                        flexDirection: 'column',
                    }, children: [_jsx(Notes, { notes: notes, editable: true, focused: true, getStyle: () => ({
                                borderRadius: 6,
                                flex: 1,
                                minWidth: 0,
                            }), onChange: setNotes }), _jsx(View, { style: {
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyItems: 'center',
                                width: '100%',
                                paddingTop: 10,
                            }, children: _jsxs(Button, { variant: "primary", style: {
                                    fontSize: 17,
                                    fontWeight: 400,
                                    width: '100%',
                                }, onPress: () => {
                                    _onSave();
                                    close();
                                }, children: [_jsx(SvgCheck, { width: 17, height: 17, style: { paddingRight: 5 } }), _jsx(Trans, { children: "Save notes" })] }) })] })] })) }));
}
