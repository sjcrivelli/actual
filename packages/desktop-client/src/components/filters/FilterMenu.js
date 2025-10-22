"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterMenu = FilterMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
function FilterMenu(_a) {
    var filterId = _a.filterId, onFilterMenuSelect = _a.onFilterMenuSelect;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<menu_1.Menu onMenuSelect={function (item) {
            onFilterMenuSelect(item);
        }} items={!(filterId === null || filterId === void 0 ? void 0 : filterId.id)
            ? [
                { name: 'save-filter', text: t('Save new filter') },
                { name: 'clear-filter', text: t('Clear all conditions') },
            ]
            : (filterId === null || filterId === void 0 ? void 0 : filterId.id) !== null && (filterId === null || filterId === void 0 ? void 0 : filterId.status) === 'saved'
                ? [
                    { name: 'rename-filter', text: t('Rename') },
                    { name: 'delete-filter', text: t('Delete') },
                    menu_1.Menu.line,
                    {
                        name: 'save-filter',
                        text: t('Save new filter'),
                        disabled: true,
                    },
                    { name: 'clear-filter', text: t('Clear all conditions') },
                ]
                : [
                    { name: 'rename-filter', text: t('Rename') },
                    { name: 'update-filter', text: t('Update conditions') },
                    { name: 'reload-filter', text: t('Revert changes') },
                    { name: 'delete-filter', text: t('Delete') },
                    menu_1.Menu.line,
                    { name: 'save-filter', text: t('Save new filter') },
                    { name: 'clear-filter', text: t('Clear all conditions') },
                ]}/>);
}
