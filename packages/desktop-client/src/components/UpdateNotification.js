"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateNotification = UpdateNotification;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Link_1 = require("./common/Link");
var appSlice_1 = require("@desktop-client/app/appSlice");
var redux_1 = require("@desktop-client/redux");
function UpdateNotification() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var updateInfo = (0, redux_1.useSelector)(function (state) { return state.app.updateInfo; });
    var showUpdateNotification = (0, redux_1.useSelector)(function (state) { return state.app.showUpdateNotification; });
    var dispatch = (0, redux_1.useDispatch)();
    var onRestart = function () {
        dispatch((0, appSlice_1.updateApp)());
    };
    if (updateInfo && showUpdateNotification) {
        var notes = updateInfo.releaseNotes;
        return (<view_1.View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                margin: '15px 17px',
                backgroundColor: theme_1.theme.pageTextPositive,
                color: theme_1.theme.tableBackground,
                padding: '7px 10px',
                borderRadius: 4,
                zIndex: 10000,
                maxWidth: 450,
            }}>
        <view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <view_1.View style={{ marginRight: 10, fontWeight: 700 }}>
            <text_1.Text>
              <react_i18next_1.Trans>App updated to {{ version: updateInfo.version }}</react_i18next_1.Trans>
            </text_1.Text>
          </view_1.View>
          <view_1.View style={{ flex: 1 }}/>
          <view_1.View style={{ marginTop: -1 }}>
            <text_1.Text>
              <Link_1.Link variant="text" onClick={onRestart} style={{
                color: theme_1.theme.buttonPrimaryText,
                textDecoration: 'underline',
            }}>
                <react_i18next_1.Trans>Restart</react_i18next_1.Trans>
              </Link_1.Link>{' '}
              (
              <Link_1.Link variant="text" style={{
                color: theme_1.theme.buttonPrimaryText,
                textDecoration: 'underline',
            }} onClick={function () {
                return window.Actual.openURLInBrowser('https://actualbudget.org/docs/releases');
            }}>
                <react_i18next_1.Trans>notes</react_i18next_1.Trans>
              </Link_1.Link>
              )
              <button_1.Button variant="bare" aria-label={t('Close')} style={{ display: 'inline', padding: '1px 7px 2px 7px' }} onPress={function () {
                // Set a flag to never show an update notification again for this session
                dispatch((0, appSlice_1.setAppState)({
                    updateInfo: null,
                    showUpdateNotification: false,
                }));
            }}>
                <v1_1.SvgClose width={9} style={{ color: theme_1.theme.buttonPrimaryText }}/>
              </button_1.Button>
            </text_1.Text>
          </view_1.View>
        </view_1.View>
        {notes && (<view_1.View style={{ marginTop: 10, fontWeight: 500 }}>{notes}</view_1.View>)}
      </view_1.View>);
    }
    return null;
}
