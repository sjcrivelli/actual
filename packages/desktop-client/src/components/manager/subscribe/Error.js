"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = Error;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
function getErrorMessage(reason) {
    switch (reason) {
        case 'network-failure':
            return 'Unable to access server. Make sure the configured URL for the server is accessible.';
        default:
            return 'Server returned an error while checking its status.';
    }
}
function Error() {
    var navigate = (0, useNavigate_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    var error = (location.state || {}).error;
    function onTryAgain() {
        navigate('/');
    }
    return (<view_1.View style={{ alignItems: 'center', color: theme_1.theme.pageText }}>
      <text_1.Text style={{
            fontSize: 16,
            color: theme_1.theme.pageTextDark,
            lineHeight: 1.4,
        }}>
        {getErrorMessage(error)}
      </text_1.Text>
      <button_1.Button onPress={onTryAgain} style={{ marginTop: 20 }}>
        <react_i18next_1.Trans>Try again</react_i18next_1.Trans>
      </button_1.Button>
    </view_1.View>);
}
