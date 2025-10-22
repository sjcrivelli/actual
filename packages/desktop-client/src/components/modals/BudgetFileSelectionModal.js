"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetFileSelectionModal = BudgetFileSelectionModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
var BudgetFileSelection_1 = require("@desktop-client/components/manager/BudgetFileSelection");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var redux_1 = require("@desktop-client/redux");
function BudgetFileSelectionModal() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var id = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    var currentFile = (0, redux_1.useSelector)(function (state) { var _a; return (_a = state.budgetfiles.allFiles) === null || _a === void 0 ? void 0 : _a.find(function (f) { return 'id' in f && f.id === id; }); });
    return (<Modal_1.Modal name="budget-file-selection">
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Switch Budget File')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '20px 0',
                }}>
            <text_1.Text style={{ fontSize: 17, fontWeight: 400 }}>
              <react_i18next_1.Trans>Switching from:</react_i18next_1.Trans>
            </text_1.Text>
            <text_1.Text style={{ fontSize: 17, fontWeight: 700 }}>
              {currentFile === null || currentFile === void 0 ? void 0 : currentFile.name}
            </text_1.Text>
          </view_1.View>
          <BudgetFileSelection_1.BudgetFileSelection showHeader={false} quickSwitchMode={true}/>
        </>);
        }}
    </Modal_1.Modal>);
}
