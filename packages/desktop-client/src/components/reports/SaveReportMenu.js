"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveReportMenu = SaveReportMenu;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var menu_1 = require("@actual-app/components/menu");
function SaveReportMenu(_a) {
    var onMenuSelect = _a.onMenuSelect, savedStatus = _a.savedStatus, listReports = _a.listReports;
    var t = (0, react_i18next_1.useTranslation)().t;
    var savedMenu = savedStatus === 'saved'
        ? [
            { name: 'rename-report', text: t('Rename') },
            { name: 'delete-report', text: t('Delete') },
            menu_1.Menu.line,
        ]
        : [];
    var modifiedMenu = savedStatus === 'modified'
        ? [
            { name: 'rename-report', text: t('Rename') },
            {
                name: 'update-report',
                text: t('Update report'),
            },
            {
                name: 'reload-report',
                text: t('Revert changes'),
            },
            { name: 'delete-report', text: t('Delete') },
            menu_1.Menu.line,
        ]
        : [];
    var unsavedMenu = [
        {
            name: 'save-report',
            text: t('Save new report'),
        },
        {
            name: 'reset-report',
            text: t('Reset to default'),
        },
        menu_1.Menu.line,
        {
            name: 'choose-report',
            text: t('Choose Report'),
            disabled: listReports > 0 ? false : true,
        },
    ];
    return (<menu_1.Menu onMenuSelect={function (item) {
            onMenuSelect(item);
        }} items={__spreadArray(__spreadArray(__spreadArray([], savedMenu, true), modifiedMenu, true), unsavedMenu, true)}/>);
}
