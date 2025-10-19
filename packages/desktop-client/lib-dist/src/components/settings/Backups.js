import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trans } from 'react-i18next';
import { Text } from '@actual-app/components/text';
import { Setting } from './UI';
export function Backups() {
    const BACKUP_FREQUENCY_MINS = 15;
    const MAX_BACKUPS = 10;
    return (_jsx(Setting, { children: _jsxs(Text, { children: [_jsx("strong", { children: _jsx(Trans, { children: "Backups" }) }), _jsx("p", { children: _jsxs(Trans, { children: ["Backups are taken every ", { BACKUP_FREQUENCY_MINS }, " minutes and stored in", ' ', _jsx("strong", { children: _jsx("i", { children: "Actual\u2019s data directory" }) }), ". Actual retains a maximum of ", { MAX_BACKUPS }, " backups at any time."] }) })] }) }));
}
