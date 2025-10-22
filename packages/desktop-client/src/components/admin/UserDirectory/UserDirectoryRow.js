"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDirectoryRow = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var user_1 = require("loot-core/shared/user");
var forms_1 = require("@desktop-client/components/forms");
var table_1 = require("@desktop-client/components/table");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
exports.UserDirectoryRow = (0, react_1.memo)(function (_a) {
    var user = _a.user, hovered = _a.hovered, selected = _a.selected, onHover = _a.onHover, onEditUser = _a.onEditUser;
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var borderColor = selected ? theme_1.theme.tableBorderSelected : 'none';
    var backgroundFocus = hovered;
    return (<table_1.Row height="auto" style={{
            fontSize: 13,
            zIndex: selected ? 101 : 'auto',
            borderColor: borderColor,
            backgroundColor: selected
                ? theme_1.theme.tableRowBackgroundHighlight
                : backgroundFocus
                    ? theme_1.theme.tableRowBackgroundHover
                    : theme_1.theme.tableBackground,
        }} collapsed={true} onMouseEnter={function () { return onHover && onHover(user.id); }} onMouseLeave={function () { return onHover && onHover(null); }}>
        {!user.owner && (<table_1.SelectCell exposed={hovered || selected} focused={true} onSelect={function (e) {
                dispatchSelected({
                    type: 'select',
                    id: user.id,
                    isRangeSelect: e.shiftKey,
                });
            }} selected={selected}/>)}
        {user.owner && (<table_1.Cell width={20} style={{ alignItems: 'center', userSelect: 'none' }}/>)}

        <table_1.Cell name="userName" width="flex" plain style={{ color: theme_1.theme.tableText }}>
          <view_1.View style={{
            alignSelf: 'flex-start',
            padding: '3px 5px',
        }}>
            <span>{user.userName}</span>
          </view_1.View>
        </table_1.Cell>

        <table_1.Cell name="displayName" width={250} plain style={{ color: theme_1.theme.tableText }}>
          <view_1.View style={{
            alignSelf: 'flex-start',
            padding: '3px 5px',
        }}>
            <span>{user.displayName}</span>
          </view_1.View>
        </table_1.Cell>

        <table_1.Cell name="role" width={100} plain style={{ padding: '0 15px', paddingLeft: 5 }}>
          <view_1.View>{user_1.PossibleRoles[user.role]}</view_1.View>
        </table_1.Cell>

        <table_1.Cell name="enabled" width={100} plain style={{ padding: '0 15px', paddingLeft: 5 }}>
          <forms_1.Checkbox checked={user.enabled} disabled={true}/>
        </table_1.Cell>

        <table_1.Cell name="owner" width={100} plain style={{ padding: '0 15px', paddingLeft: 5 }}>
          <forms_1.Checkbox checked={user.owner} disabled={true}/>
        </table_1.Cell>

        <table_1.Cell name="edit" width={80} plain style={{ padding: 0, paddingLeft: 5 }}>
          <button_1.Button style={{ margin: 4, fontSize: 14, color: theme_1.theme.pageTextLink }} variant="bare" onPress={function () { return onEditUser === null || onEditUser === void 0 ? void 0 : onEditUser(user); }}>
            <react_i18next_1.Trans>Edit</react_i18next_1.Trans>
          </button_1.Button>
        </table_1.Cell>
      </table_1.Row>);
});
exports.UserDirectoryRow.displayName = 'UserRow';
