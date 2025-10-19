import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { Trans } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { CategoryTransactions } from './CategoryTransactions';
import { UncategorizedTransactions } from './UncategorizedTransactions';
import { MobileBackButton } from '@desktop-client/components/mobile/MobileBackButton';
import { AddTransactionButton } from '@desktop-client/components/mobile/transactions/AddTransactionButton';
import { MobilePageHeader, Page } from '@desktop-client/components/Page';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useLocale } from '@desktop-client/hooks/useLocale';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
export function CategoryPage() {
    const locale = useLocale();
    const [_numberFormat] = useSyncedPref('numberFormat');
    const numberFormat = _numberFormat || 'comma-dot';
    const [hideFraction] = useSyncedPref('hideFraction');
    const { id: categoryIdParam } = useParams();
    const [searchParams] = useSearchParams();
    const month = searchParams.get('month') || monthUtils.currentMonth();
    const { list: categories } = useCategories();
    const category = categories.find(c => c.id === categoryIdParam);
    return (_jsx(Page, { header: _jsx(MobilePageHeader, { title: category ? (_jsxs(View, { children: [_jsx(TextOneLine, { children: category.name }), _jsxs(TextOneLine, { children: ["(", monthUtils.format(month, 'MMMM ‘yy', locale), ")"] })] })) : (_jsx(TextOneLine, { children: _jsx(Trans, { children: "Uncategorized" }) })), leftContent: _jsx(MobileBackButton, {}), rightContent: _jsx(AddTransactionButton, { categoryId: category?.id }) }), padding: 0, children: _jsx(Fragment, { children: category ? (_jsx(CategoryTransactions, { category: category, month: month })) : (_jsx(UncategorizedTransactions, {})) }, numberFormat + hideFraction) }));
}
