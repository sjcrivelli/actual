"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTemplateModal = GoalTemplateModal;
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var table_1 = require("@desktop-client/components/table");
function GoalTemplateModal() {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Modal_1.Modal name="goal-templates" containerProps={{ style: { width: 850 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Goal Templates')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View>
            <table_1.TableHeader>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Weekly Templates</react_i18next_1.Trans>
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Description</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.TableHeader>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">
                #template $10 repeat every week starting 2025-01-03
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>$10 a week</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">
                #template $10 repeat every week starting 2025-01-03 up to $80
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>$10 a week, up to a maximum of $80</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <span>
              <br />
            </span>
            <table_1.TableHeader>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Monthly Templates</react_i18next_1.Trans>
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Description</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.TableHeader>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">#template $50</table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>$50 each month</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">#template up to $150</table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>
                  Up to $150 each month, and remove extra funds over $150
                </react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">#template up to $150 hold</table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>
                  Up to $150 each month, but retain any funds over $150
                </react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <span>
              <br />
            </span>
            <table_1.TableHeader>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Multi-month Templates</react_i18next_1.Trans>
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Description</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.TableHeader>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">
                #template $500 by 2025-03 repeat every 6 months
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>
                  Break down less-frequent expenses into monthly expenses
                </react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">
                #template $500 by 2025-03 repeat every year
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>
                  Break down less-frequent expenses into monthly expenses
                </react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">
                #template $500 by 2025-03 repeat every 2 years
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>
                  Break down less-frequent expenses into monthly expenses
                </react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <span>
              <br />
            </span>
            <table_1.TableHeader>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Schedule Templates</react_i18next_1.Trans>
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Description</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.TableHeader>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">#template schedule SCHEDULE_NAME</table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Fund upcoming scheduled transactions over time</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">#template schedule full SCHEDULE_NAME</table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>
                  Fund upcoming scheduled transaction only on needed month
                </react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <span>
              <br />
            </span>
            <table_1.TableHeader>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Goal Templates</react_i18next_1.Trans>
              </table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Description</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.TableHeader>
            <table_1.Row style={{ backgroundColor: theme_1.theme.tableBackground }}>
              <table_1.Field width="flex">#goal 1000</table_1.Field>
              <table_1.Field width="flex">
                <react_i18next_1.Trans>Set a long-term goal instead of a monthly goal</react_i18next_1.Trans>
              </table_1.Field>
            </table_1.Row>
            <div style={{
                    textAlign: 'right',
                    fontSize: '1em',
                    color: theme_1.theme.pageTextLight,
                    marginTop: 3,
                }}>
              <span>
                <br />
              </span>
              <text_1.Text>
                <react_i18next_1.Trans>
                  See{' '}
                  <Link_1.Link variant="external" linkColor="muted" to="https://actualbudget.org/docs/experimental/goal-templates">
                    Goal Templates
                  </Link_1.Link>{' '}
                  for more information.
                </react_i18next_1.Trans>
              </text_1.Text>
            </div>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
