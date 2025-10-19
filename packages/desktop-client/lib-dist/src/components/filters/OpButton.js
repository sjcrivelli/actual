import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from '@actual-app/components/button';
import { theme } from '@actual-app/components/theme';
import { css } from '@emotion/css';
import { friendlyOp } from 'loot-core/shared/rules';
export function OpButton({ op, isSelected, style, onPress }) {
    return (_jsx(Button, { variant: "bare", style: style, className: css({
            backgroundColor: theme.pillBackground,
            marginBottom: 5,
            ...(isSelected && {
                color: theme.buttonNormalSelectedText,
                '&,:hover,:active': {
                    backgroundColor: theme.buttonNormalSelectedBackground,
                    color: theme.buttonNormalSelectedText,
                },
            }),
        }), onPress: onPress, children: friendlyOp(op) }));
}
