import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@actual-app/components/button';
import { styles } from '@actual-app/components/styles';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { Tooltip } from '@actual-app/components/tooltip';
export const GraphButton = ({ selected, children, onSelect, title, style, disabled, }) => {
    return (_jsx(Tooltip, { placement: "bottom start", content: _jsx(Text, { children: title }), style: { ...styles.tooltip, lineHeight: 1.5, padding: '6px 10px' }, children: _jsx(Button, { variant: "bare", style: {
                ...(selected && {
                    backgroundColor: theme.buttonBareBackgroundHover,
                }),
                ...style,
            }, onPress: onSelect, isDisabled: disabled, "aria-label": title, children: children }) }));
};
