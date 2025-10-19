import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@actual-app/components/button';
import { useResponsive } from '@actual-app/components/hooks/useResponsive';
import { SvgMoonStars, SvgSun, SvgSystem, } from '@actual-app/components/icons/v2';
import { Menu } from '@actual-app/components/menu';
import { Popover } from '@actual-app/components/popover';
import { themeOptions, useTheme } from '@desktop-client/style';
export function ThemeSelector({ style }) {
    const [theme, switchTheme] = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const triggerRef = useRef(null);
    const { isNarrowWidth } = useResponsive();
    const { t } = useTranslation();
    const themeIcons = {
        light: SvgSun,
        dark: SvgMoonStars,
        auto: SvgSystem,
        midnight: SvgMoonStars,
        development: SvgMoonStars,
    };
    function onMenuSelect(newTheme) {
        setMenuOpen(false);
        switchTheme(newTheme);
    }
    const Icon = themeIcons[theme] || SvgSun;
    if (isNarrowWidth) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(Button, { ref: triggerRef, variant: "bare", "aria-label": t('Switch theme'), onPress: () => setMenuOpen(true), style: style, children: _jsx(Icon, { style: { width: 13, height: 13, color: 'inherit' } }) }), _jsx(Popover, { offset: 8, triggerRef: triggerRef, isOpen: menuOpen, onOpenChange: () => setMenuOpen(false), children: _jsx(Menu, { onMenuSelect: onMenuSelect, items: themeOptions.map(([name, text]) => ({ name, text })) }) })] }));
}
