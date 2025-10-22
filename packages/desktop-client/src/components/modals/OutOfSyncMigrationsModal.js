"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutOfSyncMigrationsModal = OutOfSyncMigrationsModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var redux_1 = require("@desktop-client/redux");
function OutOfSyncMigrationsModal() {
    var dispatch = (0, redux_1.useDispatch)();
    var t = (0, react_i18next_1.useTranslation)().t;
    var closeBudgetAndModal = function (close) {
        dispatch((0, budgetfilesSlice_1.closeBudget)());
        close();
    };
    return (<Modal_1.Modal name="out-of-sync-migrations">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={<Modal_1.ModalTitle title={t('Please update Actual!')}/>}/>
          <view_1.View style={{
                    padding: 15,
                    gap: 15,
                    paddingTop: 0,
                    paddingBottom: 25,
                    maxWidth: 550,
                    lineHeight: '1.5em',
                }}>
            <text_1.Text>
              <paragraph_1.Paragraph style={{ fontSize: 16 }}>
                <react_i18next_1.Trans>
                  It looks like you&apos;re using an outdated version of the
                  Actual client. Your budget data has been updated by another
                  client, but this client is still on the old version. For the
                  best experience, please update Actual to the latest version.
                </react_i18next_1.Trans>
              </paragraph_1.Paragraph>
            </text_1.Text>

            <paragraph_1.Paragraph style={{
                    fontSize: 16,
                }}>
              <react_i18next_1.Trans>
                If you can&apos;t update Actual at this time you can find the
                latest release at{' '}
                <Link_1.Link variant="external" to="https://app.actualbudget.org">
                  app.actualbudget.org
                </Link_1.Link>
                . You can use it until your client is updated.
              </react_i18next_1.Trans>
            </paragraph_1.Paragraph>

            <view_1.View style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}>
              <button_1.Button variant="primary" style={{
                    padding: '10px 30px',
                }} onPress={function () { return closeBudgetAndModal(close); }}>
                <react_i18next_1.Trans>Close Budget</react_i18next_1.Trans>
              </button_1.Button>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
