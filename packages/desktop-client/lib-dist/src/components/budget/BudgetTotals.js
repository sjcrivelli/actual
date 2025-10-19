import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgDotsHorizontalTriple } from '@actual-app/components/icons/v1';
import { SvgArrowButtonLeft1, SvgArrowButtonRight1, SvgArrowButtonSingleLeft1, } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { RenderMonths } from './RenderMonths';
import { getScrollbarWidth } from './util';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
export const BudgetTotals = memo(function BudgetTotals({ MonthComponent, toggleHiddenCategories, expandAllCategories, collapseAllCategories, }) {
    const { t } = useTranslation();
    const [categoryExpandedStatePref, setCategoryExpandedStatePref] = useGlobalPref('categoryExpandedState');
    const categoryExpandedState = categoryExpandedStatePref ?? 0;
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    const cycleExpandedState = () => {
        const nextState = (categoryExpandedState + 1) % 3;
        setCategoryExpandedStatePref(nextState);
    };
    const getExpandStateLabel = () => {
        switch (categoryExpandedState) {
            case 0:
                return t('Expand');
            case 1:
                return t('Fully Expand');
            case 2:
                return t('Collapse');
            default:
                return t('Expand');
        }
    };
    return (_jsxs(View, { "data-testid": "budget-totals", style: {
            backgroundColor: theme.tableBackground,
            flexDirection: 'row',
            flexShrink: 0,
            boxShadow: styles.cardShadow,
            marginLeft: 5,
            marginRight: 5 + getScrollbarWidth(),
            borderRadius: '4px 4px 0 0',
            borderBottom: '1px solid ' + theme.tableBorder,
            '& .hover-visible': {
                opacity: 0,
                transition: 'opacity .25s',
            },
            '&:hover .hover-visible': {
                opacity: 1,
            },
        }, children: [_jsxs(View, { style: {
                    width: 200 + 100 * categoryExpandedState,
                    color: theme.pageTextLight,
                    justifyContent: 'center',
                    paddingLeft: 5,
                    paddingRight: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }, children: [_jsx(Button, { variant: "bare", "aria-label": getExpandStateLabel(), onPress: cycleExpandedState, className: "hover-visible", style: {
                            color: 'currentColor',
                            padding: 3,
                            marginRight: 10,
                        }, children: categoryExpandedState === 0 ? (_jsx(SvgArrowButtonSingleLeft1, { style: {
                                width: 12,
                                height: 12,
                            } })) : categoryExpandedState === 1 ? (_jsx(SvgArrowButtonLeft1, { style: {
                                width: 12,
                                height: 12,
                            } })) : (_jsx(SvgArrowButtonRight1, { style: {
                                width: 12,
                                height: 12,
                            } })) }), _jsx(View, { style: { flexGrow: '1' }, children: _jsx(Trans, { children: "Category" }) }), _jsx(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Menu'), onPress: () => setMenuOpen(true), style: { color: 'currentColor', padding: 3 }, children: _jsx(SvgDotsHorizontalTriple, { width: 15, height: 15, style: { color: theme.pageTextLight } }) }), _jsx(Popover, { triggerRef: triggerRef, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), style: { width: 200 }, children: _jsx(Menu, { onMenuSelect: type => {
                                if (type === 'toggle-visibility') {
                                    toggleHiddenCategories();
                                }
                                else if (type === 'expandAllCategories') {
                                    expandAllCategories();
                                }
                                else if (type === 'collapseAllCategories') {
                                    collapseAllCategories();
                                }
                                setMenuOpen(false);
                            }, items: [
                                {
                                    name: 'toggle-visibility',
                                    text: t('Toggle hidden categories'),
                                },
                                {
                                    name: 'expandAllCategories',
                                    text: t('Expand all'),
                                },
                                {
                                    name: 'collapseAllCategories',
                                    text: t('Collapse all'),
                                },
                            ] }) })] }), _jsx(RenderMonths, { component: MonthComponent })] }));
});
