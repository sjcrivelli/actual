"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeScreen = WelcomeScreen;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Link_1 = require("@desktop-client/components/common/Link");
var modalsSlice_1 = require("@desktop-client/modals/modalsSlice");
var redux_1 = require("@desktop-client/redux");
function WelcomeScreen() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    return (<view_1.View style={{
            gap: 10,
            maxWidth: 500,
            fontSize: 15,
            maxHeight: '100vh',
            marginBlock: 20,
        }}>
      <text_1.Text style={styles_1.styles.veryLargeText}>{t('Let’s get started!')}</text_1.Text>
      <view_1.View style={{ overflowY: 'auto' }}>
        <paragraph_1.Paragraph>
          <react_i18next_1.Trans>
            Actual is a personal finance tool that focuses on beautiful design
            and a slick user experience.{' '}
            <strong>Editing your data should be as fast as possible.</strong> On
            top of that, we want to provide powerful tools to allow you to do
            whatever you want with your data.
          </react_i18next_1.Trans>
        </paragraph_1.Paragraph>
        <paragraph_1.Paragraph>
          <react_i18next_1.Trans>
            Currently, Actual implements budgeting based on a{' '}
            <Link_1.Link variant="external" to="https://actualbudget.org/docs/budgeting/" linkColor="purple">
              monthly envelope system
            </Link_1.Link>
            .
          </react_i18next_1.Trans>{' '}
          <react_i18next_1.Trans>
            Consider taking our{' '}
            <Link_1.Link variant="external" to="https://actualbudget.org/docs/tour/" linkColor="purple">
              guided tour
            </Link_1.Link>{' '}
            to help you get your bearings, and check out the rest of the
            documentation while you’re there to learn more about advanced
            topics.
          </react_i18next_1.Trans>
        </paragraph_1.Paragraph>
        <paragraph_1.Paragraph style={{ color: theme_1.theme.pageTextLight }}>
          <react_i18next_1.Trans>
            Get started by importing an existing budget file from Actual or
            another budgeting app, create a demo budget file, or start fresh
            with an empty budget. You can always create or import another budget
            later.
          </react_i18next_1.Trans>
        </paragraph_1.Paragraph>
      </view_1.View>
      <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexShrink: 0,
        }}>
        <button_1.Button onPress={function () { return dispatch((0, modalsSlice_1.pushModal)({ modal: { name: 'import' } })); }}>
          <react_i18next_1.Trans>Import my budget</react_i18next_1.Trans>
        </button_1.Button>
        <view_1.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
        }}>
          <button_1.Button onPress={function () { return dispatch((0, budgetfilesSlice_1.createBudget)({ testMode: true })); }}>
            <react_i18next_1.Trans>View demo</react_i18next_1.Trans>
          </button_1.Button>
          <button_1.Button variant="primary" autoFocus onPress={function () { return dispatch((0, budgetfilesSlice_1.createBudget)({})); }}>
            <react_i18next_1.Trans>Start fresh</react_i18next_1.Trans>
          </button_1.Button>
        </view_1.View>
      </view_1.View>
    </view_1.View>);
}
