import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Button } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Stack } from '@actual-app/components/stack';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { send } from 'loot-core/platform/client/fetch';
import { Modal, ModalCloseButton, ModalHeader, } from '@desktop-client/components/common/Modal';
import { DisplayId } from '@desktop-client/components/util/DisplayId';
import { useFormatList } from '@desktop-client/hooks/useFormatList';
import { popModal } from '@desktop-client/modals/modalsSlice';
import { useDispatch } from '@desktop-client/redux';
export function PostsOfflineNotification() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const locationState = location.state;
    const payees = locationState && 'payees' in locationState
        ? locationState.payees
        : [];
    async function onPost() {
        await send('schedule/force-run-service');
        dispatch(popModal());
    }
    const payeesList = payees.map(id => (_jsx(Text, { style: { color: theme.pageTextPositive }, children: _jsx(DisplayId, { id: id, type: "payees" }) }, id)));
    const payeeNamesList = useFormatList(payeesList, i18n.language);
    return (_jsx(Modal, { name: "schedule-posts-offline-notification", children: ({ state: { close } }) => (_jsxs(_Fragment, { children: [_jsx(ModalHeader, { title: t('Post transactions?'), rightContent: _jsx(ModalCloseButton, { onPress: close }) }), _jsx(Paragraph, { children: _jsxs(Text, { children: [payees.length > 0 ? (_jsxs(Trans, { count: payees.length, children: ["The payees ", _jsx("span", { children: payeeNamesList }), " have schedules that are due today."] })) : (t('There are payees that have schedules that are due today.', {
                                count: payees.length,
                            })), ' ', _jsx(Trans, { children: "Usually we automatically post transactions for these, but you are offline or syncing failed. In order to avoid duplicate transactions, we let you choose whether or not to create transactions for these schedules." })] }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "Be aware that other devices may have already created these transactions. If you have multiple devices, make sure you only do this on one device or you will have duplicate transactions." }) }), _jsx(Paragraph, { children: _jsx(Trans, { children: "You can always manually post a transaction later for a due schedule by selecting the schedule and clicking \u201CPost transaction today\u201D in the action menu." }) }), _jsxs(Stack, { direction: "row", justify: "flex-end", style: { marginTop: 20 }, spacing: 2, children: [_jsx(Button, { onPress: close, children: _jsx(Trans, { children: "Decide later" }) }), _jsx(Button, { variant: "primary", autoFocus: true, onPress: () => {
                                onPost();
                                close();
                            }, children: _jsx(Trans, { children: "Post transactions" }) })] })] })) }));
}
