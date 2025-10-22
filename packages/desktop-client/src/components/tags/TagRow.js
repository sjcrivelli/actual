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
exports.TagRow = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var TagEditor_1 = require("./TagEditor");
var table_1 = require("@desktop-client/components/table");
var useContextMenu_1 = require("@desktop-client/hooks/useContextMenu");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useProperFocus_1 = require("@desktop-client/hooks/useProperFocus");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var redux_1 = require("@desktop-client/redux");
var tagsSlice_1 = require("@desktop-client/tags/tagsSlice");
exports.TagRow = (0, react_1.memo)(function (_a) {
    var tag = _a.tag, hovered = _a.hovered, selected = _a.selected, onHover = _a.onHover, focusedField = _a.focusedField, onEdit = _a.onEdit;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var dispatchSelected = (0, useSelected_1.useSelectedDispatch)();
    var borderColor = selected ? theme_1.theme.tableBorderSelected : 'none';
    var colorButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(colorButtonRef, focusedField === 'color');
    var resetButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(resetButtonRef, focusedField === 'select');
    var triggerRef = (0, react_1.useRef)(null);
    var _b = (0, useContextMenu_1.useContextMenu)(), setMenuOpen = _b.setMenuOpen, menuOpen = _b.menuOpen, handleContextMenu = _b.handleContextMenu, position = _b.position;
    var navigate = (0, useNavigate_1.useNavigate)();
    var onUpdate = function (description) {
        dispatch((0, tagsSlice_1.updateTag)(__assign(__assign({}, tag), { description: description })));
    };
    var onShowActivity = function () {
        var filterConditions = [
            {
                field: 'notes',
                op: 'hasTags',
                value: "#".concat(tag.tag),
                type: 'string',
            },
        ];
        navigate('/accounts', {
            state: {
                goBack: true,
                filterConditions: filterConditions,
            },
        });
    };
    return (<table_1.Row ref={triggerRef} data-test-id={tag.id} style={{
            borderColor: borderColor,
            backgroundColor: selected
                ? theme_1.theme.tableRowBackgroundHighlight
                : hovered
                    ? theme_1.theme.tableRowBackgroundHover
                    : theme_1.theme.tableBackground,
        }} collapsed={true} onMouseEnter={function () { return onHover(tag.id); }} onMouseLeave={function () { return onHover(); }} onContextMenu={handleContextMenu}>
        <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={menuOpen} onOpenChange={function () { return setMenuOpen(false); }} {...position} style={{ width: 200, margin: 1 }} isNonModal>
          <menu_1.Menu items={[
            {
                name: 'delete',
                text: t('Delete'),
            },
        ]} onMenuSelect={function (name) {
            switch (name) {
                case 'delete':
                    dispatch((0, tagsSlice_1.deleteTag)(tag));
                    break;
                default:
                    throw new Error("Unrecognized menu option: ".concat(name));
            }
            setMenuOpen(false);
        }}/>
        </popover_1.Popover>

        <table_1.SelectCell exposed={hovered || selected || focusedField === 'select'} focused={focusedField === 'select'} onSelect={function (e) {
            dispatchSelected({
                type: 'select',
                id: tag.id,
                isRangeSelect: e.shiftKey,
            });
        }} selected={selected}/>

        <table_1.Cell width={250} plain style={{ padding: '5px', display: 'block' }}>
          <TagEditor_1.TagEditor tag={tag} ref={colorButtonRef}/>
        </table_1.Cell>

        <table_1.InputCell width="flex" name="description" textAlign="flex" exposed={focusedField === 'description'} onExpose={function (name) { return onEdit(tag.id, name); }} value={tag.description || t('No description')} valueStyle={tag.description
            ? {}
            : { fontStyle: 'italic', color: theme_1.theme.tableTextLight }} inputProps={{
            value: tag.description || '',
            onUpdate: onUpdate,
            placeholder: t('No description'),
        }}/>

        <table_1.Cell width="auto" style={{ padding: '0 10px' }} plain>
          <table_1.CellButton style={{
            borderRadius: 4,
            padding: '3px 6px',
            backgroundColor: theme_1.theme.noticeBackground,
            border: '1px solid ' + theme_1.theme.noticeBackground,
            color: theme_1.theme.noticeTextDark,
            fontSize: 12,
            cursor: 'pointer',
            ':hover': { backgroundColor: theme_1.theme.noticeBackgroundLight },
        }} onSelect={onShowActivity}>
            <text_1.Text style={{ paddingRight: 5 }}>
              <react_i18next_1.Trans>View Transactions</react_i18next_1.Trans>
            </text_1.Text>
            <v1_1.SvgArrowThinRight style={{ width: 8, height: 8 }}/>
          </table_1.CellButton>
        </table_1.Cell>
      </table_1.Row>);
});
exports.TagRow.displayName = 'TagRow';
