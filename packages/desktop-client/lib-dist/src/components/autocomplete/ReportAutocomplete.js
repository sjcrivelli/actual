import { jsx as _jsx } from "react/jsx-runtime";
import { Autocomplete } from './Autocomplete';
import { ReportList } from './ReportList';
import { useReports } from '@desktop-client/hooks/useReports';
export function ReportAutocomplete({ embedded, ...props }) {
    const { data: reports } = useReports();
    return (_jsx(Autocomplete, { strict: true, highlightFirst: true, embedded: embedded, suggestions: reports, renderItems: (items, getItemProps, highlightedIndex) => (_jsx(ReportList, { items: items, getItemProps: getItemProps, highlightedIndex: highlightedIndex, embedded: embedded })), ...props }));
}
