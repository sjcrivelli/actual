"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayeeTableRow = void 0;
// @ts-strict-ignore
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var theme_1 = require("@actual-app/components/theme");
var tooltip_1 = require("@actual-app/components/tooltip");
var PayeeRuleCountLabel_1 = require("./PayeeRuleCountLabel");
var table_1 = require("@desktop-client/components/table");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function RuleButton(_a) {
    var ruleCount = _a.ruleCount, focused = _a.focused, onEdit = _a.onEdit, onClick = _a.onClick;
    return (<table_1.Cell name="rule-count" width="auto" focused={focused} style={{ padding: '0 10px' }} plain>
      <table_1.CellButton style={{
            borderRadius: 4,
            padding: '3px 6px',
            backgroundColor: theme_1.theme.noticeBackground,
            border: '1px solid ' + theme_1.theme.noticeBackground,
            color: theme_1.theme.noticeTextDark,
            fontSize: 12,
            cursor: 'pointer',
            ':hover': { backgroundColor: theme_1.theme.noticeBackgroundLight },
        }} onEdit={onEdit} onSelect={onClick}>
        <PayeeRuleCountLabel_1.PayeeRuleCountLabel count={ruleCount} style={{ paddingRight: 5 }}/>
        <v1_1.SvgArrowThinRight style={{ width: 8, height: 8 }}/>
      </table_1.CellButton>
    </table_1.Cell>);
}
exports.PayeeTableRow = (0, react_1.memo)(function (_a) {
    var payee = _a.payee, ruleCount = _a.ruleCount, selected = _a.selected, hovered = _a.hovered, editing = _a.editing, focusedField = _a.focusedField, onViewRules = _a.onViewRules, onCreateRule = _a.onCreateRule, onHover = _a.onHover, onDelete = _a.onDelete, onEdit = _a.onEdit, onUpdate = _a.onUpdate, style = _a.style;
    var id = payee.id;
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var selectedItems = (0, useSelected_1.useSelectedItems)();
    var selectedIds = (0, react_1.useMemo)(function () {
        var ids = selectedItems && selectedItems.size > 0 ? selectedItems : [payee.id];
        return Array.from(new Set(ids));
    }, [payee, selectedItems]);
    var borderColor = selected
        ? theme_1.theme.tableBorderSelected
        : theme_1.theme.tableBorder;
    var backgroundFocus = hovered || focusedField === 'select';
    var _b = (0, useSyncedPref_1.useSyncedPref)('learn-categories')[0], learnCategories = _b === void 0 ? 'true' : _b;
    var isLearnCategoriesEnabled = String(learnCategories) === 'true';
    var t = (0, react_i18next_1.useTranslation)().t;
    var triggerRef = (0, react_1.useRef)(null);
    var _c = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _c.setMenuOpen, menuOpen = _c.menuOpen, handleContextMenu = _c.handleContextMenu, position = _c.position;
    return (<table_1.Row ref={triggerRef} style={__assign(__assign(__assign({ alignItems: 'stretch' }, style), { borderColor: borderColor, backgroundColor: hovered
                ? theme_1.theme.tableRowBackgroundHover
                : selected
                    ? theme_1.theme.tableRowBackgroundHighlight
                    : backgroundFocus
                        ? theme_1.theme.tableRowBackgroundHover
                        : theme_1.theme.tableBackground }), (selected && {
            backgroundColor: theme_1.theme.tableRowBackgroundHighlight,
            zIndex: 100,
        }))} data-focus-key={payee.id} onMouseEnter={function () { return onHover && onHover(payee.id); }} onContextMenu={handleContextMenu}>
        <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} {...position} style={{ width: 200, margin: 1 }} isNonModal>
          <menu_1.Menu items={[
            payee.transfer_acct == null && {
                name: 'delete',
                text: t('Delete'),
            },
            payee.transfer_acct == null && {
                name: 'favorite',
                text: payee.favorite ? t('Unfavorite') : t('Favorite'),
            },
            ruleCount > 0 && { name: 'view-rules', text: t('View rules') },
            selectedIds.length === 1 && {
                name: 'create-rule',
                text: t('Create rule'),
            },
            isLearnCategoriesEnabled &&
                (payee.learn_categories
                    ? {
                        name: 'learn',
                        text: t('Disable learning'),
                    }
                    : { name: 'learn', text: t('Enable learning') }),
        ]} onMenuSelect={function (name) {
            switch (name) {
                case 'delete':
                    onDelete(selectedIds);
                    break;
                case 'favorite':
                    selectedIds.forEach(function (id) {
                        onUpdate(id, 'favorite', !payee.favorite);
                    });
                    break;
                case 'learn':
                    selectedIds.forEach(function (id) {
                        onUpdate(id, 'learn_categories', !payee.learn_categories);
                    });
                    break;
                case 'view-rules':
                    onViewRules(id);
                    break;
                case 'create-rule':
                    onCreateRule(id);
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
            setMenuOpen(false);
        }}/>
        </popover_1.Popover>
        <table_1.SelectCell exposed={payee.transfer_acct == null && (hovered || selected || editing)} focused={focusedField === 'select'} selected={selected} onSelect={function (e) {
            if (payee.transfer_acct != null) {
                return;
            }
            dispatchSelected({
                type: 'select',
                id: payee.id,
                isRangeSelect: e.shiftKey,
            });
        }}/>
        <table_1.CustomCell width={20} exposed={!payee.transfer_acct} onBlur={function () { }} onUpdate={function () { }} onClick={function () { }} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        }}>
          {function () {
            return (<>
                {payee.favorite ? <v1_1.SvgBookmark style={{ width: 10 }}/> : null}
                {isLearnCategoriesEnabled && !payee.learn_categories && (<tooltip_1.Tooltip content={t('Category learning disabled')}>
                    <v1_1.SvgLightBulb style={{ color: 'red', width: 10 }}/>
                  </tooltip_1.Tooltip>)}
              </>);
        }}
        </table_1.CustomCell>
        <table_1.InputCell value={(payee.transfer_acct ? t('Transfer: ') : '') + payee.name} valueStyle={(!selected &&
            payee.transfer_acct && { color: theme_1.theme.pageTextSubdued }) ||
            (!selected && !payee.transfer_acct && { color: theme_1.theme.tableText }) ||
            (selected && { color: theme_1.theme.tableTextSelected })} exposed={focusedField === 'name'} width="flex" onUpdate={function (value) {
            return !payee.transfer_acct && onUpdate(id, 'name', value);
        }} onExpose={function () { return onEdit(id, 'name'); }} inputProps={{ readOnly: !!payee.transfer_acct }}/>
        <RuleButton ruleCount={ruleCount} focused={focusedField === 'rule-count'} onEdit={function () { return onEdit(id, 'rule-count'); }} onClick={function () {
            return ruleCount > 0 ? onViewRules(payee.id) : onCreateRule(payee.id);
        }}/>
      </table_1.Row>);
});
exports.PayeeTableRow.displayName = 'PayeeTableRow';
