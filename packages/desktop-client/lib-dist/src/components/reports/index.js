import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { View } from '@actual-app/components/view';
import { LoadComponent } from '@desktop-client/components/util/LoadComponent';
export function Reports() {
    const { t } = useTranslation();
    return (_jsx(View, { style: { flex: 1 }, "data-testid": "reports-page", children: _jsx(LoadComponent, { name: "ReportRouter", message: t('Loading reports...'), importer: () => import(/* webpackChunkName: 'reports' */ './ReportRouter') }) }));
}
