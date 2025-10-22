"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagCreationRow = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var color_picker_1 = require("@actual-app/components/color-picker");
var stack_1 = require("@actual-app/components/stack");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var table_1 = require("@desktop-client/components/table");
var useInitialMount_1 = require("@desktop-client/hooks/useInitialMount");
var useProperFocus_1 = require("@desktop-client/hooks/useProperFocus");
var useTagCSS_1 = require("@desktop-client/hooks/useTagCSS");
var redux_1 = require("@desktop-client/redux");
var tagsSlice_1 = require("@desktop-client/tags/tagsSlice");
var TagCreationRow = function (_a) {
    var onClose = _a.onClose, tags = _a.tags;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _b = (0, react_1.useState)(''), tag = _b[0], setTag = _b[1];
    var _c = (0, react_1.useState)(''), description = _c[0], setDescription = _c[1];
    var _d = (0, react_1.useState)(null), color = _d[0], setColor = _d[1];
    var tagInput = (0, react_1.useRef)(null);
    var getTagCSS = (0, useTagCSS_1.useTagCSS)();
    var tagNames = (0, react_1.useMemo)(function () { return tags.map(function (tag) { return tag.tag; }); }, [tags]);
    var tableNavigator = (0, table_1.useTableNavigator)([{ id: 'new-tag' }], !tag || tagNames.includes(tag)
        ? ['tag', 'description', 'color', 'cancel']
        : ['tag', 'description', 'color', 'cancel', 'add']);
    var colorButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(colorButtonRef, tableNavigator.focusedField === 'color');
    var addButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(addButtonRef, tableNavigator.focusedField === 'add');
    var cancelButtonRef = (0, react_1.useRef)(null);
    (0, useProperFocus_1.useProperFocus)(cancelButtonRef, tableNavigator.focusedField === 'cancel');
    var resetInputs = function () {
        setColor(null);
        setTag('');
        setDescription('');
        tableNavigator.onEdit('new-tag', 'tag');
    };
    var isTagValid = function () {
        return (/^[^#\s]+$/.test(tag) && // accept any char except whitespaces and '#'
            !tagNames.includes(tag) && // does not exists already
            // color is null (default color) or is a 6 char hex color
            (color === null || /^#[0-9a-fA-F]{6}$/.test(color)));
    };
    var onAddTag = function () {
        if (!isTagValid()) {
            return;
        }
        dispatch((0, tagsSlice_1.createTag)({ tag: tag, color: color, description: description }));
        resetInputs();
    };
    var isInitialMount = (0, useInitialMount_1.useInitialMount)();
    (0, react_1.useEffect)(function () {
        if (isInitialMount) {
            tableNavigator.onEdit('new-tag', 'tag');
        }
    }, [isInitialMount, tableNavigator]);
    return (<view_1.View style={{
            paddingBottom: 1,
            backgroundColor: theme_1.theme.tableBackground,
        }} data-testid="new-tag" {...tableNavigator.getNavigatorProps({
        onKeyUp: function (e) {
            if (e.key === 'Escape') {
                onClose();
            }
            if (e.key === 'Enter' && tag) {
                onAddTag();
            }
        },
    })}>
      <table_1.Row height={34} style={{
            padding: '0px 20px',
            width: '100%',
            backgroundColor: theme_1.theme.tableBackground,
            gap: 5,
        }} collapsed={true}>
        <table_1.InputCell width={250} name="tag" textAlign="flex" exposed={tableNavigator.focusedField === 'tag'} onExpose={function (name) { return tableNavigator.onEdit('new-tag', name); }} value={tag || t('New tag')} valueStyle={tag ? {} : { fontStyle: 'italic', color: theme_1.theme.tableTextLight }} inputProps={{
            value: tag || '',
            onInput: function (_a) {
                var value = _a.target.value;
                return setTag(value.replace(/\s/g, ''));
            },
            placeholder: t('New tag'),
            ref: tagInput,
        }}/>

        <table_1.InputCell width="flex" name="description" textAlign="flex" exposed={tableNavigator.focusedField === 'description'} onExpose={function (name) { return tableNavigator.onEdit('new-tag', name); }} value={description || t('Tag description')} valueStyle={description
            ? {}
            : { fontStyle: 'italic', color: theme_1.theme.tableTextLight }} inputProps={{
            value: description || '',
            onUpdate: setDescription,
            placeholder: t('Tag description'),
        }}/>
      </table_1.Row>
      <table_1.Row height="auto" style={{
            padding: '6px 20px',
            width: '100%',
            backgroundColor: theme_1.theme.tableBackground,
            gap: 10,
            alignItems: 'center',
            borderBottom: '1px solid ' + theme_1.theme.tableBorderHover,
        }} collapsed={true}>
        <react_i18next_1.Trans>Choose Color:</react_i18next_1.Trans>
        <color_picker_1.ColorPicker value={color !== null && color !== void 0 ? color : undefined} onChange={function (color) { return setColor(color.toString('hex')); }}>
          <button_1.Button ref={colorButtonRef} variant="bare" className={getTagCSS('', { color: color })}>
            #{tag}
          </button_1.Button>
        </color_picker_1.ColorPicker>
        <stack_1.Stack direction="row" align="center" justify="flex-end" style={{ marginLeft: 'auto' }} spacing={2}>
          <button_1.Button variant="normal" style={{ padding: '4px 10px' }} onPress={onClose} data-testid="close-button" ref={cancelButtonRef}>
            <react_i18next_1.Trans>Cancel</react_i18next_1.Trans>
          </button_1.Button>
          <button_1.Button variant="primary" style={{ padding: '4px 10px' }} onPress={onAddTag} data-testid="add-button" isDisabled={!isTagValid()} ref={addButtonRef}>
            <react_i18next_1.Trans>Add</react_i18next_1.Trans>
          </button_1.Button>
        </stack_1.Stack>
      </table_1.Row>
    </view_1.View>);
};
exports.TagCreationRow = TagCreationRow;
