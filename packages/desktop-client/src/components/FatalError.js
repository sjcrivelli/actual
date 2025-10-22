"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FatalError = FatalError;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var errors_1 = require("loot-core/shared/errors");
var Link_1 = require("./common/Link");
var Modal_1 = require("./common/Modal");
var forms_1 = require("./forms");
var useModalState_1 = require("@desktop-client/hooks/useModalState");
function RenderSimple(_a) {
    var error = _a.error;
    var msg;
    if ('IDBFailure' in error && error.IDBFailure) {
        // IndexedDB wasn't able to open the database
        msg = (<text_1.Text>
        <react_i18next_1.Trans>
          Your browser doesn’t support IndexedDB in this environment, a feature
          that Actual requires to run. This might happen if you are in private
          browsing mode. Please try a different browser or turn off private
          browsing.
        </react_i18next_1.Trans>
      </text_1.Text>);
    }
    else if ('SharedArrayBufferMissing' in error &&
        error.SharedArrayBufferMissing) {
        // SharedArrayBuffer isn't available
        msg = (<text_1.Text>
        <react_i18next_1.Trans>
          Actual requires access to <code>SharedArrayBuffer</code> in order to
          function properly. If you’re seeing this error, either your browser
          does not support <code>SharedArrayBuffer</code>, or your server is not
          sending the appropriate headers, or you are not using HTTPS. See{' '}
          <Link_1.Link variant="external" linkColor="muted" to="https://actualbudget.org/docs/troubleshooting/shared-array-buffer">
            our troubleshooting documentation
          </Link_1.Link>{' '}
          to learn more. <SharedArrayBufferOverride />
        </react_i18next_1.Trans>
      </text_1.Text>);
    }
    else {
        // This indicates the backend failed to initialize. Show the
        // user something at least so they aren't looking at a blank
        // screen
        msg = (<text_1.Text>
        <react_i18next_1.Trans>
          There was a problem loading the app in this browser version.
        </react_i18next_1.Trans>
      </text_1.Text>);
    }
    return (<stack_1.Stack style={{
            paddingBottom: 15,
            lineHeight: '1.5em',
            fontSize: 15,
        }}>
      <text_1.Text>{msg}</text_1.Text>
      <text_1.Text>
        <react_i18next_1.Trans>
          Please get{' '}
          <Link_1.Link variant="external" linkColor="muted" to="https://actualbudget.org/contact">
            in touch
          </Link_1.Link>{' '}
          for support
        </react_i18next_1.Trans>
      </text_1.Text>
    </stack_1.Stack>);
}
function RenderLazyLoadError() {
    return (<stack_1.Stack style={{
            paddingBottom: 15,
            lineHeight: '1.5em',
            fontSize: 15,
        }}>
      <text_1.Text>
        <react_i18next_1.Trans>
          There was a problem loading one of the chunks of the application.
          Please reload the page and try again. If the issue persists - there
          might be an issue with either your internet connection and/or the
          server where the app is hosted.
        </react_i18next_1.Trans>
      </text_1.Text>
    </stack_1.Stack>);
}
function RenderUIError() {
    return (<>
      <paragraph_1.Paragraph>
        <react_i18next_1.Trans>There was an unrecoverable error in the UI. Sorry!</react_i18next_1.Trans>
      </paragraph_1.Paragraph>
      <paragraph_1.Paragraph>
        <react_i18next_1.Trans>
          If this error persists, please get{' '}
          <Link_1.Link variant="external" to="https://actualbudget.org/contact">
            in touch
          </Link_1.Link>{' '}
          so it can be investigated.
        </react_i18next_1.Trans>
      </paragraph_1.Paragraph>
    </>);
}
function SharedArrayBufferOverride() {
    var _a = (0, react_1.useState)(false), expanded = _a[0], setExpanded = _a[1];
    var _b = (0, react_1.useState)(false), understand = _b[0], setUnderstand = _b[1];
    return expanded ? (<>
      <paragraph_1.Paragraph style={{ marginTop: 10 }}>
        <react_i18next_1.Trans>
          Actual uses <code>SharedArrayBuffer</code> to allow usage from
          multiple tabs at once and to ensure correct behavior when switching
          files. While it can run without access to
          <code>SharedArrayBuffer</code>, you may encounter data loss or notice
          multiple budget files being merged with each other.
        </react_i18next_1.Trans>
      </paragraph_1.Paragraph>
      <label style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <forms_1.Checkbox checked={understand} onChange={function () { return setUnderstand(!understand); }}/>{' '}
        <react_i18next_1.Trans>
          I understand the risks, run Actual in the unsupported fallback mode
        </react_i18next_1.Trans>
      </label>
      <button_1.Button isDisabled={!understand} onPress={function () {
            window.localStorage.setItem('SharedArrayBufferOverride', 'true');
            window.location.reload();
        }}>
        <react_i18next_1.Trans>Open Actual</react_i18next_1.Trans>
      </button_1.Button>
    </>) : (<Link_1.Link variant="text" onClick={function () { return setExpanded(true); }} style={{ marginLeft: 5 }}>
      <react_i18next_1.Trans>Advanced options</react_i18next_1.Trans>
    </Link_1.Link>);
}
function FatalError(_a) {
    var _b;
    var error = _a.error;
    var t = (0, react_i18next_1.useTranslation)().t;
    var modalStack = (0, useModalState_1.useModalState)().modalStack;
    var lastModal = modalStack[modalStack.length - 1];
    var _c = (0, react_1.useState)(false), showError = _c[0], setShowError = _c[1];
    var showSimpleRender = 'type' in error && error.type === 'app-init-failure';
    var isLazyLoadError = error instanceof errors_1.LazyLoadFailedError;
    return (<Modal_1.Modal name={(_b = lastModal === null || lastModal === void 0 ? void 0 : lastModal.name) !== null && _b !== void 0 ? _b : 'fatal-error'} isDismissable={false}>
      <Modal_1.ModalHeader title={isLazyLoadError ? t('Loading Error') : t('Fatal Error')}/>
      <view_1.View style={{
            maxWidth: 500,
        }}>
        {isLazyLoadError ? (<RenderLazyLoadError />) : showSimpleRender ? (<RenderSimple error={error}/>) : (<RenderUIError />)}

        <paragraph_1.Paragraph>
          <button_1.Button onPress={function () { return window.Actual.relaunch(); }}>
            <react_i18next_1.Trans>Restart app</react_i18next_1.Trans>
          </button_1.Button>
        </paragraph_1.Paragraph>
        <paragraph_1.Paragraph isLast={true} style={{ fontSize: 11 }}>
          <Link_1.Link variant="text" onClick={function () { return setShowError(function (state) { return !state; }); }}>
            <react_i18next_1.Trans>Show Error</react_i18next_1.Trans>
          </Link_1.Link>
          {showError && (<block_1.Block style={{
                marginTop: 5,
                height: 100,
                overflow: 'auto',
            }}>
              {error.stack}
            </block_1.Block>)}
        </paragraph_1.Paragraph>
      </view_1.View>
    </Modal_1.Modal>);
}
