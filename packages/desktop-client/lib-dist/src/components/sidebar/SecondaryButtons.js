import { jsx as _jsx } from "react/jsx-runtime";
import { View } from '@actual-app/components/view';
import { SecondaryItem } from './SecondaryItem';
export function SecondaryButtons({ buttons }) {
    return (_jsx(View, { style: {
            flexShrink: 0,
            padding: '5px 0',
        }, children: buttons.map(item => (_jsx(SecondaryItem, { title: item.title, Icon: item.Icon, onClick: item.onClick }, item.title))) }));
}
