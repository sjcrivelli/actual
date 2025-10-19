import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { Information } from '@desktop-client/components/alerts';
import { Modal, ModalButtons } from '@desktop-client/components/common/Modal';
import { usePayees } from '@desktop-client/hooks/usePayees';
import { replaceModal, } from '@desktop-client/modals/modalsSlice';
import { useSelector, useDispatch } from '@desktop-client/redux';
const highlightStyle = { color: theme.pageTextPositive };
export function MergeUnusedPayeesModal({ payeeIds, targetPayeeId, }) {
    const allPayees = usePayees();
    const modalStack = useSelector(state => state.modals.modalStack);
    const isEditingRule = !!modalStack.find(m => m.name === 'edit-rule');
    const dispatch = useDispatch();
    const [shouldCreateRule, setShouldCreateRule] = useState(true);
    const flashRef = useRef(null);
    useEffect(() => {
        // Flash the scrollbar
        if (flashRef.current) {
            const el = flashRef.current;
            const top = el.scrollTop;
            el.scrollTop = top + 1;
            el.scrollTop = top;
        }
    }, []);
    // We store the orphaned payees into state because when we merge it,
    // it will be deleted and this component will automatically
    // rerender. Is there a better pattern for live bindings?
    //
    // TODO: I think a custom `useSelector` hook that doesn't bind would
    // be nice
    const [payees] = useState(() => allPayees.filter(p => payeeIds.includes(p.id)));
    const onMerge = useCallback(async (targetPayee) => {
        await send('payees-merge', {
            targetId: targetPayee.id,
            mergeIds: payees.map(payee => payee.id),
        });
        let ruleId;
        if (shouldCreateRule && !isEditingRule) {
            const id = await send('rule-add-payee-rename', {
                fromNames: payees.map(payee => payee.name),
                to: targetPayee.id,
            });
            ruleId = id;
        }
        return ruleId;
    }, [shouldCreateRule, isEditingRule, payees]);
    const onMergeAndCreateRule = useCallback(async (targetPayee) => {
        const ruleId = await onMerge(targetPayee);
        if (ruleId) {
            const rule = await send('rule-get', { id: ruleId });
            if (!rule) {
                return;
            }
            dispatch(replaceModal({ modal: { name: 'edit-rule', options: { rule } } }));
        }
    }, [onMerge, dispatch]);
    const targetPayee = allPayees.find(p => p.id === targetPayeeId);
    if (!targetPayee) {
        return null;
    }
    return (_jsx(Modal, { name: "merge-unused-payees", children: ({ state: { close } }) => (_jsx(View, { style: { padding: 20, maxWidth: 500 }, children: _jsxs(View, { children: [_jsx(Paragraph, { style: { marginBottom: 10, fontWeight: 500 }, children: payees.length === 1 ? (_jsxs(Trans, { children: ["The payee", ' ', _jsx(Text, { style: highlightStyle, children: { previousPayee: payees[0].name } }), ' ', "is not used by transactions any more. Would you like to merge it with", ' ', _jsx(Text, { style: highlightStyle, children: { payee: targetPayee.name } }), "?"] })) : (_jsxs(_Fragment, { children: [_jsxs(Trans, { children: ["The following payees are not used by transactions any more. Would you like to merge them with", ' ', _jsx(Text, { style: highlightStyle, children: { payee: targetPayee.name } }), "?"] }), _jsx("ul", { ref: flashRef, style: {
                                        margin: 0,
                                        marginTop: 10,
                                        maxHeight: 140,
                                        overflow: 'auto',
                                    }, children: payees.map(payee => (_jsx("li", { children: _jsx(Text, { style: highlightStyle, children: payee.name }) }, payee.id))) })] })) }), _jsxs(Information, { children: [_jsx(Trans, { children: "Merging will remove the payee and transfer any existing rules to the new payee." }), !isEditingRule && (_jsxs(_Fragment, { children: [' ', _jsx(Trans, { children: "If checked below, a rule will be created to do this rename while importing transactions." })] }))] }), !isEditingRule && (_jsxs("label", { style: {
                            fontSize: 13,
                            marginTop: 10,
                            color: theme.pageTextLight,
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }, children: [_jsx("input", { type: "checkbox", checked: shouldCreateRule, onChange: e => setShouldCreateRule(e.target.checked) }), _jsx(Text, { style: { marginLeft: 3 }, children: _jsx(Trans, { count: payees.length, children: "Automatically rename these payees in the future" }) })] })), _jsxs(ModalButtons, { style: { marginTop: 20 }, focusButton: true, children: [_jsx(Button, { variant: "primary", autoFocus: true, style: { marginRight: 10 }, onPress: () => {
                                    onMerge(targetPayee);
                                    close();
                                }, children: _jsx(Trans, { children: "Merge" }) }), !isEditingRule && (_jsx(Button, { style: { marginRight: 10 }, onPress: () => {
                                    onMergeAndCreateRule(targetPayee);
                                    close();
                                }, children: _jsx(Trans, { children: "Merge and edit rule" }) })), _jsx(Button, { style: { marginRight: 10 }, onPress: close, children: _jsx(Trans, { children: "Do nothing" }) })] })] }) })) }));
}
