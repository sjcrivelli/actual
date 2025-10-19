import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Block } from '@actual-app/components/block';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { format } from 'date-fns';
import { send } from 'loot-core/platform/client/fetch';
import { Setting } from './UI';
import { useMetadataPref } from '@desktop-client/hooks/useMetadataPref';
export function ExportBudget() {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [budgetName] = useMetadataPref('budgetName');
    const [encryptKeyId] = useMetadataPref('encryptKeyId');
    async function onExport() {
        setIsLoading(true);
        setError(null);
        const response = await send('export-budget');
        if ('error' in response && response.error) {
            setError(response.error);
            setIsLoading(false);
            console.log('Export error code:', response.error);
            return;
        }
        if (response.data) {
            window.Actual.saveFile(response.data, `${format(new Date(), 'yyyy-MM-dd')}-${budgetName}.zip`, t('Export budget'));
        }
        setIsLoading(false);
    }
    return (_jsxs(Setting, { primaryAction: _jsxs(_Fragment, { children: [_jsx(ButtonWithLoading, { onPress: onExport, isLoading: isLoading, children: _jsx(Trans, { children: "Export data" }) }), error && (_jsx(Block, { style: { color: theme.errorText, marginTop: 15 }, children: t('An unknown error occurred while exporting. Please report this as a new issue on GitHub.') }))] }), children: [_jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Export" }), " your data as a zip file containing", ' ', _jsx("code", { children: "db.sqlite" }), " and ", _jsx("code", { children: "metadata.json" }), " files. It can be imported into another Actual instance by closing an open file (if any), then clicking the \u201CImport file\u201D button, then choosing \u201CActual.\u201D"] }) }), encryptKeyId ? (_jsx(Text, { children: _jsx(Trans, { children: "Even though encryption is enabled, the exported zip file will not have any encryption." }) })) : null] }));
}
