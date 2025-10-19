import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { send } from 'loot-core/platform/client/fetch';
import { Setting } from './UI';
import { resetSync } from '@desktop-client/app/appSlice';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
import { useDispatch } from '@desktop-client/redux';
export function ResetCache() {
    const [resetting, setResetting] = useState(false);
    async function onResetCache() {
        setResetting(true);
        await send('reset-budget-cache');
        setResetting(false);
    }
    return (_jsx(Setting, { primaryAction: _jsx(ButtonWithLoading, { isLoading: resetting, onPress: onResetCache, children: _jsx(Trans, { children: "Reset budget cache" }) }), children: _jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Reset budget cache" }), " will clear all cached values for the budget and recalculate the entire budget. All values in the budget are cached for performance reasons, and if there is a bug in the cache you won\u2019t see correct values. There is no danger in resetting the cache. Hopefully you never have to do this."] }) }) }));
}
export function ResetSync() {
    const [groupId] = useMetadataPref('groupId');
    const isEnabled = !!groupId;
    const dispatch = useDispatch();
    const [resetting, setResetting] = useState(false);
    async function onResetSync() {
        setResetting(true);
        await dispatch(resetSync());
        setResetting(false);
    }
    return (_jsx(Setting, { primaryAction: _jsx(ButtonWithLoading, { isLoading: resetting, isDisabled: !isEnabled, onPress: onResetSync, children: _jsx(Trans, { children: "Reset sync" }) }), children: isEnabled ? (_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Reset sync" }), " will remove all local data used to track changes for syncing, and create a fresh sync ID on the server. This file on other devices will have to be re-downloaded to use the new sync ID. Use this if there is a problem with syncing and you want to start fresh."] }) })) : (_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Reset sync" }), " is only available when syncing is enabled."] }) })) }));
}
