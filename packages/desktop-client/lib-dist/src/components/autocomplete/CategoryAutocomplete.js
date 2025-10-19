import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useMemo, useCallback, } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgSplit } from '@actual-app/components/icons/v0';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { TextOneLine } from '@actual-app/components/text-one-line';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { css, cx } from '@emotion/css';
import { getNormalisedString } from 'loot-core/shared/normalisation';
import { integerToCurrency } from 'loot-core/shared/util';
import { Autocomplete, defaultFilterSuggestion } from './Autocomplete';
import { ItemHeader } from './ItemHeader';
import { useEnvelopeSheetValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { makeAmountFullStyle } from '@desktop-client/components/budget/util';
import { useCategories } from '@desktop-client/hooks/useCategories';
import { useSheetValue } from '@desktop-client/hooks/useSheetValue';
import { useSyncedPref } from '@desktop-client/hooks/useSyncedPref';
import { trackingBudget, envelopeBudget, } from '@desktop-client/spreadsheet/bindings';
function CategoryList({ items, getItemProps, highlightedIndex, embedded, footer, renderSplitTransactionButton = defaultRenderSplitTransactionButton, renderCategoryItemGroupHeader = defaultRenderCategoryItemGroupHeader, renderCategoryItem = defaultRenderCategoryItem, showHiddenItems, showBalances, }) {
    const { t } = useTranslation();
    const { splitTransaction, groupedCategories } = useMemo(() => {
        return items.reduce((acc, item, index) => {
            if (item.id === 'split') {
                acc.splitTransaction = { ...item, highlightedIndex: index };
                return acc;
            }
            const groupId = item.group?.id || '';
            const existing = acc.groupedCategories.find(x => x.group?.id === groupId);
            const itemWithIndex = {
                ...item,
                highlightedIndex: index,
            };
            if (!existing) {
                acc.groupedCategories.push({
                    group: item.group ?? null,
                    categories: [itemWithIndex],
                });
            }
            else {
                existing.categories.push(itemWithIndex);
            }
            return acc;
        }, {
            splitTransaction: null,
            groupedCategories: [],
        });
    }, [items]);
    return (_jsxs(View, { children: [_jsxs(View, { style: {
                    overflowY: 'auto',
                    willChange: 'transform',
                    padding: '5px 0',
                    ...(!embedded && { maxHeight: 175 }),
                }, children: [splitTransaction &&
                        renderSplitTransactionButton({
                            key: 'split',
                            ...(getItemProps ? getItemProps({ item: splitTransaction }) : {}),
                            highlighted: splitTransaction.highlightedIndex === highlightedIndex,
                            embedded,
                        }), groupedCategories.map(({ group, categories }) => {
                        if (!group) {
                            return null;
                        }
                        return (_jsxs(Fragment, { children: [renderCategoryItemGroupHeader({
                                    title: `${group.name}${group.hidden ? ` ${t('(hidden)')}` : ''}`,
                                    style: {
                                        ...(showHiddenItems &&
                                            group.hidden && { color: theme.pageTextSubdued }),
                                    },
                                }), categories.map(item => (_jsx(Fragment, { children: renderCategoryItem({
                                        ...(getItemProps ? getItemProps({ item }) : {}),
                                        item,
                                        highlighted: highlightedIndex === item.highlightedIndex,
                                        embedded,
                                        style: {
                                            ...(showHiddenItems &&
                                                (item.hidden || group.hidden) && {
                                                color: theme.pageTextSubdued,
                                            }),
                                        },
                                        showBalances,
                                    }) }, item.id)))] }, group.id));
                    })] }), footer] }));
}
function customSort(obj, value) {
    const name = getNormalisedString(obj.name);
    const groupName = obj.group ? getNormalisedString(obj.group.name) : '';
    if (obj.id === 'split') {
        return -2;
    }
    if (name.includes(value)) {
        return -1;
    }
    if (groupName.includes(value)) {
        return 0;
    }
    return 1;
}
export function CategoryAutocomplete({ categoryGroups, showBalances = true, showSplitOption, embedded, closeOnBlur, renderSplitTransactionButton, renderCategoryItemGroupHeader, renderCategoryItem, showHiddenCategories, ...props }) {
    const { grouped: defaultCategoryGroups = [] } = useCategories();
    const categorySuggestions = useMemo(() => {
        const allSuggestions = (categoryGroups || defaultCategoryGroups).reduce((list, group) => list.concat((group.categories || [])
            .filter(category => category.group === group.id)
            .map(category => ({
            ...category,
            group,
        }))), showSplitOption
            ? [{ id: 'split', name: '' }]
            : []);
        if (!showHiddenCategories) {
            return allSuggestions.filter(suggestion => suggestion.id === 'split' ||
                (!suggestion.hidden && !suggestion.group?.hidden));
        }
        return allSuggestions;
    }, [
        categoryGroups,
        defaultCategoryGroups,
        showSplitOption,
        showHiddenCategories,
    ]);
    const filterSuggestions = useCallback((suggestions, value) => {
        return suggestions
            .filter(suggestion => {
            if (suggestion.id === 'split') {
                return true;
            }
            if (suggestion.group) {
                return (getNormalisedString(suggestion.group.name).includes(getNormalisedString(value)) ||
                    getNormalisedString(suggestion.group.name + ' ' + suggestion.name).includes(getNormalisedString(value)));
            }
            return defaultFilterSuggestion(suggestion, value);
        })
            .sort((a, b) => customSort(a, getNormalisedString(value)) -
            customSort(b, getNormalisedString(value)));
    }, []);
    return (_jsx(Autocomplete, { strict: true, highlightFirst: true, embedded: embedded, closeOnBlur: closeOnBlur, getHighlightedIndex: suggestions => {
            if (suggestions.length === 0) {
                return null;
            }
            else if (suggestions[0].id === 'split') {
                // Highlight the first category since the split option is at index 0.
                return suggestions.length > 1 ? 1 : null;
            }
            return 0;
        }, filterSuggestions: filterSuggestions, suggestions: categorySuggestions, renderItems: (items, getItemProps, highlightedIndex) => (_jsx(CategoryList, { items: items, embedded: embedded, getItemProps: getItemProps, highlightedIndex: highlightedIndex, renderSplitTransactionButton: renderSplitTransactionButton, renderCategoryItemGroupHeader: renderCategoryItemGroupHeader, renderCategoryItem: renderCategoryItem, showHiddenItems: showHiddenCategories, showBalances: showBalances })), ...props }));
}
function defaultRenderCategoryItemGroupHeader(props) {
    return _jsx(ItemHeader, { ...props, type: "category" });
}
function SplitTransactionButton({ Icon, highlighted, embedded, style, ...props }) {
    return (_jsxs(View
    // Downshift calls `setTimeout(..., 250)` in the `onMouseMove`
    // event handler they set on this element. When this code runs
    // in WebKit on touch-enabled devices, taps on this element end
    // up not triggering the `onClick` event (and therefore delaying
    // response to user input) until after the `setTimeout` callback
    // finishes executing. This is caused by content observation code
    // that implements various strategies to prevent the user from
    // accidentally clicking content that changed as a result of code
    // run in the `onMouseMove` event.
    //
    // Long story short, we don't want any delay here between the user
    // tapping and the resulting action being performed. It turns out
    // there's some "fast path" logic that can be triggered in various
    // ways to force WebKit to bail on the content observation process.
    // One of those ways is setting `role="button"` (or a number of
    // other aria roles) on the element, which is what we're doing here.
    //
    // ref:
    // * https://github.com/WebKit/WebKit/blob/447d90b0c52b2951a69df78f06bb5e6b10262f4b/LayoutTests/fast/events/touch/ios/content-observation/400ms-hover-intent.html
    // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebCore/page/ios/ContentChangeObserver.cpp
    // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebKit/WebProcess/WebPage/ios/WebPageIOS.mm#L783
    , { 
        // Downshift calls `setTimeout(..., 250)` in the `onMouseMove`
        // event handler they set on this element. When this code runs
        // in WebKit on touch-enabled devices, taps on this element end
        // up not triggering the `onClick` event (and therefore delaying
        // response to user input) until after the `setTimeout` callback
        // finishes executing. This is caused by content observation code
        // that implements various strategies to prevent the user from
        // accidentally clicking content that changed as a result of code
        // run in the `onMouseMove` event.
        //
        // Long story short, we don't want any delay here between the user
        // tapping and the resulting action being performed. It turns out
        // there's some "fast path" logic that can be triggered in various
        // ways to force WebKit to bail on the content observation process.
        // One of those ways is setting `role="button"` (or a number of
        // other aria roles) on the element, which is what we're doing here.
        //
        // ref:
        // * https://github.com/WebKit/WebKit/blob/447d90b0c52b2951a69df78f06bb5e6b10262f4b/LayoutTests/fast/events/touch/ios/content-observation/400ms-hover-intent.html
        // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebCore/page/ios/ContentChangeObserver.cpp
        // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebKit/WebProcess/WebPage/ios/WebPageIOS.mm#L783
        role: "button", style: {
            backgroundColor: highlighted
                ? theme.menuAutoCompleteBackgroundHover
                : 'transparent',
            borderRadius: embedded ? 4 : 0,
            flexShrink: 0,
            flexDirection: 'row',
            alignItems: 'center',
            fontSize: 11,
            fontWeight: 500,
            color: theme.noticeTextMenu,
            padding: '6px 8px',
            ':active': {
                backgroundColor: 'rgba(100, 100, 100, .25)',
            },
            ...style,
        }, "data-testid": "split-transaction-button", ...props, children: [_jsx(Text, { style: { lineHeight: 0 }, children: Icon ? (_jsx(Icon, { style: { marginRight: 5 } })) : (_jsx(SvgSplit, { width: 10, height: 10, style: { marginRight: 5 } })) }), _jsx(Trans, { children: "Split Transaction" })] }));
}
function defaultRenderSplitTransactionButton(props) {
    return _jsx(SplitTransactionButton, { ...props });
}
function CategoryItem({ item, className, style, highlighted, embedded, showBalances, ...props }) {
    const { t } = useTranslation();
    const { isNarrowWidth } = useResponsive();
    const narrowStyle = isNarrowWidth
        ? {
            ...styles.mobileMenuItem,
            borderRadius: 0,
            borderTop: `1px solid ${theme.pillBorder}`,
        }
        : {};
    const [budgetType = 'envelope'] = useSyncedPref('budgetType');
    const balanceBinding = budgetType === 'envelope'
        ? envelopeBudget.catBalance(item.id)
        : trackingBudget.catBalance(item.id);
    const balance = useSheetValue(balanceBinding);
    const isToBudgetItem = item.id === 'to-budget';
    const toBudget = useEnvelopeSheetValue(envelopeBudget.toBudget);
    return (_jsx("div", { style: style, 
        // See comment above.
        role: "button", className: cx(className, css({
            backgroundColor: highlighted
                ? theme.menuAutoCompleteBackgroundHover
                : 'transparent',
            color: highlighted
                ? theme.menuAutoCompleteItemTextHover
                : theme.menuAutoCompleteItemText,
            padding: 4,
            paddingLeft: 20,
            borderRadius: embedded ? 4 : 0,
            ...narrowStyle,
        })), "data-testid": `${item.name}-category-item`, "data-highlighted": highlighted || undefined, ...props, children: _jsxs(View, { style: { flexDirection: 'row', justifyContent: 'space-between' }, children: [_jsxs(TextOneLine, { children: [item.name, item.hidden || item.group?.hidden ? ' ' + t('(hidden)') : ''] }), _jsx(TextOneLine, { style: {
                        display: !showBalances ? 'none' : undefined,
                        marginLeft: 5,
                        flexShrink: 0,
                        ...makeAmountFullStyle((isToBudgetItem ? toBudget : balance) || 0, {
                            positiveColor: theme.noticeTextMenu,
                            negativeColor: theme.errorTextMenu,
                        }),
                    }, children: isToBudgetItem
                        ? toBudget != null
                            ? ` ${integerToCurrency(toBudget || 0)}`
                            : null
                        : balance != null
                            ? ` ${integerToCurrency(balance || 0)}`
                            : null })] }) }));
}
function defaultRenderCategoryItem(props) {
    return _jsx(CategoryItem, { ...props });
}
