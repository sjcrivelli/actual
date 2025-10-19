import { jsx as _jsx } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
import { ReportCard } from '@desktop-client/components/reports/ReportCard';
export function MissingReportCard({ isEditing, onRemove, children, }) {
    return (_jsx(ReportCard, { isEditing: isEditing, menuItems: [
            {
                name: 'remove',
                text: 'Remove',
            },
        ], onMenuSelect: item => {
            switch (item) {
                case 'remove':
                    onRemove();
                    break;
            }
        }, children: _jsx(View, { style: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
            }, children: children }) }));
}
