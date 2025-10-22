"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpcomingLength = UpcomingLength;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var paragraph_1 = require("@actual-app/components/paragraph");
var select_1 = require("@actual-app/components/select");
var view_1 = require("@actual-app/components/view");
var CustomUpcomingLength_1 = require("./CustomUpcomingLength");
var Modal_1 = require("@desktop-client/components/common/Modal");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function useUpcomingLengthOptions() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var upcomingLengthOptions = [
        { value: '1', label: t('1 day') },
        { value: '7', label: t('1 week') },
        { value: '14', label: t('2 weeks') },
        { value: 'oneMonth', label: t('1 month') },
        { value: 'currentMonth', label: t('End of the current month') },
        { value: 'custom', label: t('Custom length') },
    ];
    return { upcomingLengthOptions: upcomingLengthOptions };
}
function nonCustomUpcomingLengthValues(value) {
    return (['1', '7', '14', 'oneMonth', 'currentMonth'].findIndex(function (x) { return x === value; }) ===
        -1);
}
function UpcomingLength() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, useSyncedPref_1.useSyncedPref)('upcomingScheduledTransactionLength'), _upcomingLength = _a[0], setUpcomingLength = _a[1];
    var saveUpcomingLength = function () {
        setUpcomingLength(tempUpcomingLength);
    };
    var upcomingLengthOptions = useUpcomingLengthOptions().upcomingLengthOptions;
    var upcomingLength = _upcomingLength || '7';
    var _b = (0, react_1.useState)(upcomingLength), tempUpcomingLength = _b[0], setTempUpcomingLength = _b[1];
    var _c = (0, react_1.useState)(nonCustomUpcomingLengthValues(tempUpcomingLength)), useCustomLength = _c[0], setUseCustomLength = _c[1];
    var _d = (0, react_1.useState)(false), saveActive = _d[0], setSaveActive = _d[1];
    (0, react_1.useEffect)(function () {
        if (tempUpcomingLength !== upcomingLength) {
            setSaveActive(true);
        }
        else {
            setSaveActive(false);
        }
    }, [tempUpcomingLength, upcomingLength]);
    return (<Modal_1.Modal name="schedules-upcoming-length" containerProps={{ style: { width: 600 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Change upcoming length')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              Change how many days in advance of the scheduled date a scheduled
              transaction appears in the account ledger as upcoming.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <paragraph_1.Paragraph>
            <react_i18next_1.Trans>
              This only affects how schedules are displayed and not how budget
              data is stored. It can be changed at any time.
            </react_i18next_1.Trans>
          </paragraph_1.Paragraph>
          <view_1.View>
            <select_1.Select options={upcomingLengthOptions.map(function (x) { return [
                    x.value || '7',
                    x.label,
                ]; })} value={nonCustomUpcomingLengthValues(tempUpcomingLength)
                    ? 'custom'
                    : tempUpcomingLength} onChange={function (newValue) {
                    setUseCustomLength(newValue === 'custom');
                    setTempUpcomingLength(newValue);
                }}/>
            {useCustomLength && (<CustomUpcomingLength_1.CustomUpcomingLength onChange={setTempUpcomingLength} tempValue={tempUpcomingLength}/>)}
          </view_1.View>
          <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    marginTop: 20,
                }}>
            <button_1.Button isDisabled={!saveActive} onPress={function () {
                    saveUpcomingLength();
                    close();
                }} type="submit" variant="primary">
              <react_i18next_1.Trans>Save</react_i18next_1.Trans>
            </button_1.Button>
          </div>
        </>);
        }}
    </Modal_1.Modal>);
}
