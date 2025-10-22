"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesModal = NotesModal;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v2_1 = require("@actual-app/components/icons/v2");
var view_1 = require("@actual-app/components/view");
var Modal_1 = require("@desktop-client/components/common/Modal");
var Notes_1 = require("@desktop-client/components/Notes");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
function NotesModal(_a) {
    var id = _a.id, name = _a.name, onSave = _a.onSave;
    var t = (0, react_i18next_1.useTranslation)().t;
    var originalNotes = (0, useNotes_1.useNotes)(id);
    var _b = (0, react_1.useState)(originalNotes), notes = _b[0], setNotes = _b[1];
    (0, react_1.useEffect)(function () { return setNotes(originalNotes); }, [originalNotes]);
    function _onSave() {
        if (notes !== originalNotes) {
            onSave === null || onSave === void 0 ? void 0 : onSave(id, notes);
        }
    }
    return (<Modal_1.Modal name="notes" containerProps={{
            style: { height: '50vh' },
        }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Notes: {{name}}', { name: name })} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
            <Notes_1.Notes notes={notes} editable={true} focused={true} getStyle={function () { return ({
                    borderRadius: 6,
                    flex: 1,
                    minWidth: 0,
                }); }} onChange={setNotes}/>
            <view_1.View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyItems: 'center',
                    width: '100%',
                    paddingTop: 10,
                }}>
              <button_1.Button variant="primary" style={{
                    fontSize: 17,
                    fontWeight: 400,
                    width: '100%',
                }} onPress={function () {
                    _onSave();
                    close();
                }}>
                <v2_1.SvgCheck width={17} height={17} style={{ paddingRight: 5 }}/>
                <react_i18next_1.Trans>Save notes</react_i18next_1.Trans>
              </button_1.Button>
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
