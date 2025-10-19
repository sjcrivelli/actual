import { jsx as _jsx } from "react/jsx-runtime";
import { Autocomplete } from './Autocomplete';
import { FilterList } from './FilterList';
import { useTransactionFilters } from '@desktop-client/hooks/useTransactionFilters';
export function FilterAutocomplete({ embedded, ...props }) {
    const filters = useTransactionFilters() || [];
    return (_jsx(Autocomplete, { strict: true, highlightFirst: true, embedded: embedded, suggestions: filters, renderItems: (items, getItemProps, highlightedIndex) => (_jsx(FilterList, { items: items, getItemProps: getItemProps, highlightedIndex: highlightedIndex, embedded: embedded })), ...props }));
}
