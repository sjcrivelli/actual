"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerURL = ServerURL;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var Link_1 = require("@desktop-client/components/common/Link");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
function ServerURL() {
    var url = (0, ServerContext_1.useServerURL)();
    return (<view_1.View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 15,
            zIndex: 5000,
        }}>
      <text_1.Text>
        {url ? (<react_i18next_1.Trans>
            Using server: <strong>{url}</strong>
          </react_i18next_1.Trans>) : (<react_i18next_1.Trans>
            <strong>No server configured</strong>
          </react_i18next_1.Trans>)}
      </text_1.Text>
      <Link_1.Link variant="internal" to="/config-server" style={{ marginLeft: 15 }}>
        <react_i18next_1.Trans>Change</react_i18next_1.Trans>
      </Link_1.Link>
    </view_1.View>);
}
