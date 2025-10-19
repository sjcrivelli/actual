import { jsx as _jsx } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { SvgPin } from '@actual-app/components/icons/v1';
import { SvgArrowButtonLeft1 } from '@actual-app/components/icons/v2';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
export function ToggleButton({ style, isFloating, onFloat, }) {
    const { t } = useTranslation();
    return (_jsx(View, { className: "float", style: { ...style, flexShrink: 0 }, children: _jsx(Button, { variant: "bare", "aria-label": isFloating ? t('Pin sidebar') : t('Unpin sidebar'), onPress: onFloat, style: { color: theme.buttonMenuBorder }, children: isFloating ? (_jsx(SvgPin, { style: {
                    margin: -2,
                    width: 15,
                    height: 15,
                    transform: 'rotate(45deg)',
                } })) : (_jsx(SvgArrowButtonLeft1, { style: { width: 13, height: 13 } })) }) }));
}
