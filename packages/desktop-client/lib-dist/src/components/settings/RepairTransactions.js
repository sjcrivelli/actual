import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ButtonWithLoading } from '@actual-app/components/button';
import { Paragraph } from '@actual-app/components/paragraph';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import { send } from 'loot-core/platform/client/fetch';
import { Setting } from './UI';
function useRenderResults() {
    const { t } = useTranslation();
    function renderResults(results) {
        const { numBlankPayees, numCleared, numDeleted, numTransfersFixed, mismatchedSplits, numNonParentErrorsFixed, numParentTransactionsWithCategoryFixed, } = results;
        const result = [];
        if (numBlankPayees === 0 &&
            numCleared === 0 &&
            numDeleted === 0 &&
            numTransfersFixed === 0 &&
            numNonParentErrorsFixed === 0 &&
            mismatchedSplits.length === 0 &&
            numParentTransactionsWithCategoryFixed === 0) {
            result.push(t('No split transactions found needing repair.'));
        }
        else {
            if (numBlankPayees > 0) {
                result.push(t('Fixed {{count}} splits with a blank payee.', {
                    count: numBlankPayees,
                }));
            }
            if (numCleared > 0) {
                result.push(t('Fixed {{count}} splits with the wrong cleared flag.', {
                    count: numCleared,
                }));
            }
            if (numDeleted > 0) {
                result.push(t('Fixed {{count}} splits that weren’t properly deleted.', {
                    count: numDeleted,
                }));
            }
            if (numNonParentErrorsFixed > 0) {
                result.push(t('Fixed {{count}} non-split transactions with split errors.', {
                    count: numNonParentErrorsFixed,
                }));
            }
            if (numTransfersFixed > 0) {
                result.push(t('Fixed {{count}} transfers.', {
                    count: numTransfersFixed,
                }));
            }
            if (mismatchedSplits.length > 0) {
                const mismatchedSplitInfo = mismatchedSplits
                    .map(t => `- ${t.date}`)
                    .join('\n');
                result.push(t('Found {{count}} split transactions with mismatched amounts on the below dates. Please review them manually:', { count: mismatchedSplits.length }) + `\n${mismatchedSplitInfo}`);
            }
            if (numParentTransactionsWithCategoryFixed > 0) {
                result.push(t('Fixed {{count}} split transactions with non-null category.', {
                    count: numParentTransactionsWithCategoryFixed,
                }));
            }
        }
        return (_jsx(Paragraph, { style: {
                color: mismatchedSplits.length === 0
                    ? theme.noticeTextLight
                    : theme.errorText,
                whiteSpace: 'pre-wrap',
            }, children: result.join('\n') }));
    }
    return { renderResults };
}
export function RepairTransactions() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const { renderResults } = useRenderResults();
    async function onFix() {
        setLoading(true);
        const res = await send('tools/fix-split-transactions');
        setResults(res);
        setLoading(false);
    }
    return (_jsx(Setting, { primaryAction: _jsxs(View, { style: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '1em',
            }, children: [_jsx(ButtonWithLoading, { isLoading: loading, onPress: onFix, children: _jsx(Trans, { children: "Repair transactions" }) }), results && renderResults(results)] }), children: _jsxs(Trans, { children: [_jsxs(Text, { children: [_jsx("strong", { children: "Repair transactions" }), " if you are experiencing bugs relating to split transactions or transfers and the \u201CReset budget cache\u201D button above does not help, this tool may fix them. Some examples of bugs include seeing blank payees on splits or incorrect account balances. This tool does four things:"] }), _jsxs("ul", { style: { margin: 0, paddingLeft: '1.5em' }, children: [_jsx("li", { style: { marginBottom: '0.5em' }, children: "Ensures that deleted split transactions are fully deleted. In previous versions of the app, certain split transactions may appear deleted but not all of them are actually deleted. This causes the transactions list to look correct, but certain balances may be incorrect when filtering." }), _jsx("li", { children: "Sync the payee and cleared flag of a split transaction to the main or \u201Cparent\u201D transaction, if appropriate. The payee will only be set if it currently doesn\u2019t have one." }), _jsx("li", { children: "Checks that the sum of all child transactions adds up to the total amount. If not, these will be flagged below to allow you to easily locate and fix the amounts." }), _jsx("li", { children: "Checks for any non-split transactions with erroneous split errors and removes the errors if found." }), _jsx("li", { children: "Check if you have any budget transfers that erroneous contain a category, and remove the category." }), _jsx("li", { children: "Checks for any parent transactions with a category and removes the category if found." })] })] }) }));
}
