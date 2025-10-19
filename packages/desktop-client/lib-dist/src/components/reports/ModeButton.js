import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
export function ModeButton({ selected, children, style, onSelect, }) {
    return (_jsx(Button, { variant: "bare", className: css({
            padding: '5px 10px',
            backgroundColor: theme.menuBackground,
            fontSize: 'inherit',
            ...style,
            ...(selected && {
                backgroundColor: theme.buttonPrimaryBackground,
                color: theme.buttonPrimaryText,
                ':hover': {
                    backgroundColor: theme.buttonPrimaryBackgroundHover,
                    color: theme.buttonPrimaryTextHover,
                },
            }),
        }), onPress: onSelect, children: children }));
}
