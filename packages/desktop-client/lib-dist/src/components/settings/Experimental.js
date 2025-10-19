import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { Setting } from './UI';
import { Link } from '@desktop-client/components/common/Link';
import { Checkbox } from '@desktop-client/components/forms';
import { useFeatureFlag } from '@desktop-client/hooks/useFeatureFlag';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
function FeatureToggle({ flag: flagName, disableToggle = false, feedbackLink, error, children, }) {
    const enabled = useFeatureFlag(flagName);
    const [_, setFlagPref] = useSyncedPref(`flags.${flagName}`);
    return (_jsxs("label", { style: { display: 'flex' }, children: [_jsx(Checkbox, { checked: enabled, onChange: () => {
                    setFlagPref(String(!enabled));
                }, disabled: disableToggle }), _jsxs(View, { style: { color: disableToggle ? theme.pageTextSubdued : 'inherit' }, children: [_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 5 }, children: [children, feedbackLink && (_jsx(Link, { variant: "external", to: feedbackLink, children: _jsx(Trans, { children: "(give feedback)" }) }))] }), disableToggle && (_jsx(Text, { style: {
                            color: theme.errorText,
                            fontWeight: 500,
                        }, children: error }))] })] }));
}
function GlobalFeatureToggle({ prefName, disableToggle = false, feedbackLink, error, children, }) {
    const [enabled, setEnabled] = useSyncedPref(prefName, { isGlobal: true });
    return (_jsxs("label", { style: { display: 'flex' }, children: [_jsx(Checkbox, { checked: enabled === 'true', onChange: () => {
                    setEnabled(enabled === 'true' ? 'false' : 'true');
                }, disabled: disableToggle }), _jsxs(View, { style: { color: disableToggle ? theme.pageTextSubdued : 'inherit' }, children: [_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 5 }, children: [children, feedbackLink && (_jsx(Link, { variant: "external", to: feedbackLink, children: _jsx(Trans, { children: "(give feedback)" }) }))] }), disableToggle && (_jsx(Text, { style: {
                            color: theme.errorText,
                            fontWeight: 500,
                        }, children: error }))] })] }));
}
export function ExperimentalFeatures() {
    const [expanded, setExpanded] = useState(false);
    const goalTemplatesEnabled = useFeatureFlag('goalTemplatesEnabled');
    const goalTemplatesUIEnabled = useFeatureFlag('goalTemplatesUIEnabled');
    const showGoalTemplatesUI = goalTemplatesUIEnabled ||
        (goalTemplatesEnabled &&
            localStorage.getItem('devEnableGoalTemplatesUI') === 'true');
    return (_jsx(Setting, { primaryAction: expanded ? (_jsxs(View, { style: { gap: '1em' }, children: [_jsx(FeatureToggle, { flag: "goalTemplatesEnabled", children: _jsx(Trans, { children: "Goal templates" }) }), showGoalTemplatesUI && (_jsx(View, { style: { paddingLeft: 22 }, children: _jsx(FeatureToggle, { flag: "goalTemplatesUIEnabled", children: _jsx(Trans, { children: "Subfeature: Budget automations UI" }) }) })), _jsx(FeatureToggle, { flag: "actionTemplating", feedbackLink: "https://github.com/actualbudget/actual/issues/3606", children: _jsx(Trans, { children: "Rule action templating" }) }), _jsx(FeatureToggle, { flag: "currency", feedbackLink: "https://github.com/actualbudget/actual/issues/5191", children: _jsx(Trans, { children: "Currency support" }) }), _jsx(GlobalFeatureToggle, { prefName: "plugins", disableToggle: true, feedbackLink: "https://github.com/actualbudget/actual/pull/4049", children: _jsx(Trans, { children: "Client-Side plugins (soon)" }) })] })) : (_jsx(Link, { variant: "text", onClick: () => setExpanded(true), "data-testid": "experimental-settings", style: {
                flexShrink: 0,
                alignSelf: 'flex-start',
                color: theme.pageTextPositive,
            }, children: _jsx(Trans, { children: "I understand the risks, show experimental features" }) })), children: _jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Experimental features." }), " These features are not fully tested and may not work as expected. THEY MAY CAUSE IRRECOVERABLE DATA LOSS. They may do nothing at all. Only enable them if you know what you are doing."] }) }) }));
}
