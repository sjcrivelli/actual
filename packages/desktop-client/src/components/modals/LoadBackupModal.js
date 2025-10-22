"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadBackupModal = LoadBackupModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var block_1 = require("@actual-app/components/block");
var button_1 = require("@actual-app/components/button");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var fetch_1 = require("loot-core/platform/client/fetch");
var budgetfilesSlice_1 = require("@desktop-client/budgetfiles/budgetfilesSlice");
var Modal_1 = require("@desktop-client/components/common/Modal");
var table_1 = require("@desktop-client/components/table");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var redux_1 = require("@desktop-client/redux");
function BackupTable(_a) {
    var backups = _a.backups, onSelect = _a.onSelect;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{ flex: 1, maxHeight: 200, overflow: 'auto' }}>
      {backups.map(function (backup, idx) { return (<table_1.Row key={backup.id} collapsed={idx !== 0} onClick={function () { return onSelect(backup.id); }} style={{ cursor: 'pointer' }}>
          <table_1.Cell width="flex" value={backup.date ? backup.date : t('Revert to Latest')} valueStyle={{ paddingLeft: 20 }}/>
        </table_1.Row>); })}
    </view_1.View>);
}
function LoadBackupModal(_a) {
    var budgetId = _a.budgetId, watchUpdates = _a.watchUpdates, backupDisabled = _a.backupDisabled;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)([]), backups = _b[0], setBackups = _b[1];
    var prefsBudgetId = (0, useMetadataPref_1.useMetadataPref)('id')[0];
    var budgetIdToLoad = budgetId !== null && budgetId !== void 0 ? budgetId : prefsBudgetId;
    (0, react_1.useEffect)(function () {
        if (budgetIdToLoad) {
            (0, fetch_1.send)('backups-get', { id: budgetIdToLoad }).then(setBackups);
        }
    }, [budgetIdToLoad]);
    (0, react_1.useEffect)(function () {
        if (watchUpdates) {
            return (0, fetch_1.listen)('backups-updated', setBackups);
        }
    }, [watchUpdates]);
    var latestBackup = backups.find(function (backup) {
        return 'isLatest' in backup ? backup.isLatest : false;
    });
    var previousBackups = backups.filter(function (backup) { return !('isLatest' in backup ? backup.isLatest : false); });
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Modal_1.Modal name="load-backup" containerProps={{ style: { maxWidth: '30vw' } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={t('Load Backup')} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{ marginBottom: 30 }}>
            <view_1.View style={{
                    margin: 20,
                    marginTop: 0,
                    marginBottom: 15,
                    lineHeight: 1.5,
                }}>
              {latestBackup ? (<block_1.Block>
                  <block_1.Block style={{ marginBottom: 10 }}>
                    <text_1.Text style={{ fontWeight: 600 }}>
                      <react_i18next_1.Trans>You are currently working from a backup.</react_i18next_1.Trans>
                    </text_1.Text>{' '}
                    <react_i18next_1.Trans>
                      You can load a different backup or revert to the original
                      version below.
                    </react_i18next_1.Trans>
                  </block_1.Block>
                  <button_1.Button variant="primary" onPress={function () {
                        if (budgetIdToLoad && latestBackup.id) {
                            dispatch((0, budgetfilesSlice_1.loadBackup)({
                                budgetId: budgetIdToLoad,
                                backupId: latestBackup.id,
                            }));
                        }
                    }}>
                    <react_i18next_1.Trans>Revert to original version</react_i18next_1.Trans>
                  </button_1.Button>
                </block_1.Block>) : (<view_1.View style={{ alignItems: 'flex-start' }}>
                  <block_1.Block style={{ marginBottom: 10 }}>
                    <react_i18next_1.Trans>
                      Select a backup to load. After loading a backup, you will
                      have a chance to revert to the current version in this
                      screen.
                    </react_i18next_1.Trans>{' '}
                    <text_1.Text style={{ fontWeight: 600 }}>
                      <react_i18next_1.Trans>
                        If you use a backup, you will have to set up all your
                        devices to sync from the new budget.
                      </react_i18next_1.Trans>
                    </text_1.Text>
                  </block_1.Block>
                  <button_1.Button variant="primary" isDisabled={backupDisabled} onPress={function () { return dispatch((0, budgetfilesSlice_1.makeBackup)()); }}>
                    <react_i18next_1.Trans>Back up now</react_i18next_1.Trans>
                  </button_1.Button>
                </view_1.View>)}
            </view_1.View>
            {previousBackups.length === 0 ? (<block_1.Block style={{ color: theme_1.theme.tableTextLight, marginLeft: 20 }}>
                <react_i18next_1.Trans>No backups available</react_i18next_1.Trans>
              </block_1.Block>) : (<BackupTable backups={previousBackups} onSelect={function (id) {
                        if (budgetIdToLoad && id) {
                            dispatch((0, budgetfilesSlice_1.loadBackup)({ budgetId: budgetIdToLoad, backupId: id }));
                        }
                    }}/>)}
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
