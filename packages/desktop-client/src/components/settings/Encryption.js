"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionSettings = EncryptionSettings;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var UI_1 = require("./UI");
var Link_1 = require("@desktop-client/components/common/Link");
var ServerContext_1 = require("@desktop-client/components/ServerContext");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function EncryptionSettings() {
    var dispatch = (0, redux_1.useDispatch)();
    var serverURL = (0, ServerContext_1.useServerURL)();
    var encryptKeyId = (0, useMetadataPref_1.useMetadataPref)('encryptKeyId')[0];
    var missingCryptoAPI = !(window.crypto && crypto.subtle);
    function onChangeKey() {
        dispatch((0, modalsSlice_1.pushModal)({
            modal: { name: 'create-encryption-key', options: { recreate: true } },
        }));
    }
    return encryptKeyId ? (<UI_1.Setting primaryAction={<button_1.Button onPress={onChangeKey}>
          <react_i18next_1.Trans>Generate new key</react_i18next_1.Trans>
        </button_1.Button>}>
      <text_1.Text>
        <text_1.Text style={{ color: theme_1.theme.noticeTextLight, fontWeight: 600 }}>
          <react_i18next_1.Trans>End-to-end Encryption is turned on.</react_i18next_1.Trans>
        </text_1.Text>{' '}
        <react_i18next_1.Trans>
          Your data is encrypted with a key that only you have before sending it
          it out to the cloud. Local data remains unencrypted so if you forget
          your password you can re-encrypt it.
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption" linkColor="purple">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>
    </UI_1.Setting>) : missingCryptoAPI ? (<UI_1.Setting primaryAction={<button_1.Button isDisabled>
          <react_i18next_1.Trans>Enable encryption</react_i18next_1.Trans>
        </button_1.Button>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>End-to-end encryption</strong> is not available when making an
          unencrypted connection to a remote server. You’ll need to enable HTTPS
          on your server to use end-to-end encryption. This problem may also
          occur if your browser is too old to work with Actual.
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/config/https" linkColor="purple">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>
    </UI_1.Setting>) : serverURL ? (<UI_1.Setting primaryAction={<button_1.Button onPress={function () {
                return dispatch((0, modalsSlice_1.pushModal)({
                    modal: { name: 'create-encryption-key', options: {} },
                }));
            }}>
          <react_i18next_1.Trans>Enable encryption</react_i18next_1.Trans>
        </button_1.Button>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>End-to-end encryption</strong> is not enabled. Any data on the
          server is still protected by the server password, but it’s not
          end-to-end encrypted which means the server owners have the ability to
          read it. If you want, you can use an additional password to encrypt
          your data on the server.
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption" linkColor="purple">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>
    </UI_1.Setting>) : (<UI_1.Setting primaryAction={<button_1.Button isDisabled>
          <react_i18next_1.Trans>Enable encryption</react_i18next_1.Trans>
        </button_1.Button>}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>End-to-end encryption</strong> is not available when running
          without a server. Budget files are always kept unencrypted locally,
          and encryption is only applied when sending data to a server.
        </react_i18next_1.Trans>{' '}
        <Link_1.Link variant="external" to="https://actualbudget.org/docs/getting-started/sync/#end-to-end-encryption" linkColor="purple">
          <react_i18next_1.Trans>Learn more</react_i18next_1.Trans>
        </Link_1.Link>
      </text_1.Text>
    </UI_1.Setting>);
}
