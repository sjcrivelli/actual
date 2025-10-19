import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-strict-ignore
import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import AutoSizer from 'react-virtualized-auto-sizer';
import { View } from '@actual-app/components/view';
import * as monthUtils from 'loot-core/shared/months';
import { useBudgetMonthCount } from './BudgetMonthCountContext';
import { BudgetPageHeader } from './BudgetPageHeader';
import { BudgetTable } from './BudgetTable';
import { useGlobalPref } from '@desktop-client/hooks/useGlobalPref';
function getNumPossibleMonths(width, categoryWidth) {
    const estimatedTableWidth = width - categoryWidth;
    if (estimatedTableWidth < 500) {
        return 1;
    }
    else if (estimatedTableWidth < 750) {
        return 2;
    }
    else if (estimatedTableWidth < 1000) {
        return 3;
    }
    else if (estimatedTableWidth < 1250) {
        return 4;
    }
    else if (estimatedTableWidth < 1500) {
        return 5;
    }
    return 6;
}
const DynamicBudgetTableInner = ({ type, width, height, prewarmStartMonth, startMonth, maxMonths = 3, monthBounds, onMonthSelect, ...props }) => {
    const { setDisplayMax } = useBudgetMonthCount();
    const [categoryExpandedStatePref] = useGlobalPref('categoryExpandedState');
    const categoryExpandedState = categoryExpandedStatePref ?? 0;
    const numPossible = getNumPossibleMonths(width, 200 + 100 * categoryExpandedState);
    const numMonths = Math.min(numPossible, maxMonths);
    const maxWidth = 200 + 100 * categoryExpandedState + 500 * numMonths;
    useEffect(() => {
        setDisplayMax(numPossible);
    }, [numPossible]);
    function getValidMonth(month) {
        const start = monthBounds.start;
        const end = monthUtils.subMonths(monthBounds.end, numMonths - 1);
        if (month < start) {
            return start;
        }
        else if (month > end) {
            return end;
        }
        return month;
    }
    function _onMonthSelect(month) {
        onMonthSelect(getValidMonth(month), numMonths);
    }
    useHotkeys('left', () => {
        _onMonthSelect(monthUtils.prevMonth(startMonth));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [_onMonthSelect, startMonth]);
    useHotkeys('right', () => {
        _onMonthSelect(monthUtils.nextMonth(startMonth));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [_onMonthSelect, startMonth]);
    useHotkeys('0', () => {
        _onMonthSelect(monthUtils.subMonths(monthUtils.currentMonth(), type === 'envelope'
            ? Math.floor((numMonths - 1) / 2)
            : numMonths === 2
                ? 1
                : Math.max(numMonths - 2, 0)));
    }, {
        preventDefault: true,
        scopes: ['app'],
    }, [_onMonthSelect, startMonth, numMonths]);
    return (_jsx(View, { style: {
            width,
            height,
            alignItems: 'center',
            opacity: width <= 0 || height <= 0 ? 0 : 1,
        }, children: _jsxs(View, { style: { width: '100%', maxWidth }, children: [_jsx(BudgetPageHeader, { startMonth: prewarmStartMonth, numMonths: numMonths, monthBounds: monthBounds, onMonthSelect: _onMonthSelect }), _jsx(BudgetTable, { type: type, prewarmStartMonth: prewarmStartMonth, startMonth: startMonth, numMonths: numMonths, monthBounds: monthBounds, ...props })] }) }));
};
DynamicBudgetTableInner.displayName = 'DynamicBudgetTableInner';
export const DynamicBudgetTable = (props) => {
    return (_jsx(AutoSizer, { children: ({ width, height }) => (_jsx(DynamicBudgetTableInner, { width: width, height: height, ...props })) }));
};
DynamicBudgetTable.displayName = 'DynamicBudgetTable';
