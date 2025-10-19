import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation, Trans } from 'react-i18next';
import { Select } from '@actual-app/components/select';
import { Text } from '@actual-app/components/text';
import { theme as themeStyle } from '@actual-app/components/theme';
import { tokens } from '@actual-app/components/tokens';
import { View } from '@actual-app/components/view';
import { css } from '@emotion/css';
import { Column, Setting } from './UI';
import { useSidebar } from '@desktop-client/components/sidebar/SidebarProvider';
import { themeOptions, useTheme, usePreferredDarkTheme, darkThemeOptions, } from '@desktop-client/style';
export function ThemeSettings() {
    const { t } = useTranslation();
    const sidebar = useSidebar();
    const [theme, switchTheme] = useTheme();
    const [darkTheme, switchDarkTheme] = usePreferredDarkTheme();
    return (_jsx(Setting, { primaryAction: _jsxs(View, { style: {
                flexDirection: 'column',
                gap: '1em',
                width: '100%',
                [`@media (min-width: ${sidebar.floating
                    ? tokens.breakpoint_small
                    : tokens.breakpoint_medium})`]: {
                    flexDirection: 'row',
                },
            }, children: [_jsx(Column, { title: t('Theme'), children: _jsx(Select, { onChange: value => {
                            switchTheme(value);
                        }, value: theme, options: themeOptions, className: css({
                            '&[data-hovered]': {
                                backgroundColor: themeStyle.buttonNormalBackgroundHover,
                            },
                        }) }) }), theme === 'auto' && (_jsx(Column, { title: t('Dark theme'), children: _jsx(Select, { onChange: value => {
                            switchDarkTheme(value);
                        }, value: darkTheme, options: darkThemeOptions, className: css({
                            '&[data-hovered]': {
                                backgroundColor: themeStyle.buttonNormalBackgroundHover,
                            },
                        }) }) }))] }), children: _jsx(Text, { children: _jsxs(Trans, { children: [_jsx("strong", { children: "Themes" }), " change the user interface colors."] }) }) }));
}
