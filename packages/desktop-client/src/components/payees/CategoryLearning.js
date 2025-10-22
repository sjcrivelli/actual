"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryLearning = CategoryLearning;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var Link_1 = require("@desktop-client/components/common/Link");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function CategoryLearning() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, useSyncedPref_1.useSyncedPref)('learn-categories'), _b = _a[0], learnCategories = _b === void 0 ? 'true' : _b, setLearnCategories = _a[1];
    var isLearnCategoriesEnabled = String(learnCategories) === 'true';
    return (<Modal_1.Modal name="payee-category-learning" containerProps={{ style: { width: 600 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Category Learning')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              <strong>Category Learning</strong> will automatically determine
              the best category for a transaction and create a rule that sets
              the category for the payee.{' '}
              <Link_1.Link variant="external" to="https://actualbudget.org/docs/budgeting/rules/#automatic-rules" linkColor="purple">
                Learn more
              </Link_1.Link>
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              Disabling Category Learning will not delete any existing rules but
              will prevent new rules from being created automatically on a
              global level.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <button_1.Button onPress={function () {
                    return setLearnCategories(String(!isLearnCategoriesEnabled));
                }} variant={isLearnCategoriesEnabled ? 'normal' : 'primary'}>
            {isLearnCategoriesEnabled ? (<react_i18next_1.Trans>Disable category learning</react_i18next_1.Trans>) : (<react_i18next_1.Trans>Enable category learning</react_i18next_1.Trans>)}
          </button_1.Button>
        </>);
        }}
    </Modal_1.Modal>);
}
