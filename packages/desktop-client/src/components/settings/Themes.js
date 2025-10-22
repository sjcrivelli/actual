"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeSettings = ThemeSettings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var select_1 = require("@actual-app/components/select");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var tokens_1 = require("@actual-app/components/tokens");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var UI_1 = require("./UI");
var SidebarProvider_1 = require("@desktop-client/components/sidebar/SidebarProvider");
var style_1 = require("@desktop-client/style");
function ThemeSettings() {
    var _a;
    var t = (0, react_i18next_1.useTranslation)().t;
    var sidebar = (0, SidebarProvider_1.useSidebar)();
    var _b = (0, style_1.useTheme)(), theme = _b[0], switchTheme = _b[1];
    var _c = (0, style_1.usePreferredDarkTheme)(), darkTheme = _c[0], switchDarkTheme = _c[1];
    return (<UI_1.Setting primaryAction={<view_1.View style={_a = {
                    flexDirection: 'column',
                    gap: '1em',
                    width: '100%'
                },
                _a["@media (min-width: ".concat(sidebar.floating
                    ? tokens_1.tokens.breakpoint_small
                    : tokens_1.tokens.breakpoint_medium, ")")] = {
                    flexDirection: 'row',
                },
                _a}>
          <UI_1.Column title={t('Theme')}>
            <select_1.Select onChange={function (value) {
                switchTheme(value);
            }} value={theme} options={style_1.themeOptions} className={(0, css_1.css)({
                '&[data-hovered]': {
                    backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
                },
            })}/>
          </UI_1.Column>
          {theme === 'auto' && (<UI_1.Column title={t('Dark theme')}>
              <select_1.Select onChange={function (value) {
                    switchDarkTheme(value);
                }} value={darkTheme} options={style_1.darkThemeOptions} className={(0, css_1.css)({
                    '&[data-hovered]': {
                        backgroundColor: theme_1.theme.buttonNormalBackgroundHover,
                    },
                })}/>
            </UI_1.Column>)}
        </view_1.View>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Themes</strong> change the user interface colors.
        </react_i18next_1.Trans>
      </text_1.Text>
    </UI_1.Setting>);
}
