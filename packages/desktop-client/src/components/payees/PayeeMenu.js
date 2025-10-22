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
exports.PayeeMenu = PayeeMenu;
var react_i18next_1 = require("react-i18next");
var v0_1 = require("@actual-app/components/icons/v0");
var v1_1 = require("@actual-app/components/icons/v1");
var menu_1 = require("@actual-app/components/menu");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function PayeeMenu(_a) {
    var payeesById = _a.payeesById, selectedPayees = _a.selectedPayees, onDelete = _a.onDelete, onMerge = _a.onMerge, onFavorite = _a.onFavorite, onLearn = _a.onLearn, onClose = _a.onClose;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, useSyncedPref_1.useSyncedPref)('learn-categories')[0], learnCategories = _b === void 0 ? 'true' : _b;
    var isLearnCategoriesEnabled = String(learnCategories) === 'true';
    // Transfer accounts are never editable
    var isDisabled = __spreadArray([], selectedPayees, true).some(function (id) { return payeesById[id] == null || payeesById[id].transfer_acct; });
    var selectedPayeeNames = __spreadArray([], selectedPayees, true).slice(0, 4)
        .map(function (id) { return payeesById[id].name; })
        .join(', ');
    var items = [
        {
            icon: v0_1.SvgDelete,
            name: 'delete',
            text: t('Delete'),
            disabled: isDisabled,
        },
        {
            icon: v1_1.SvgBookmark,
            iconSize: 9,
            name: 'favorite',
            text: t('Favorite'),
            disabled: isDisabled,
        },
        {
            icon: v0_1.SvgMerge,
            iconSize: 9,
            name: 'merge',
            text: t('Merge'),
            disabled: isDisabled || selectedPayees.size < 2,
        },
    ];
    if (isLearnCategoriesEnabled) {
        items.push({
            icon: v1_1.SvgLightBulb,
            iconSize: 9,
            name: 'learn',
            text: t('Category Learning'),
            disabled: isDisabled,
        });
    }
    items.push(menu_1.Menu.line);
    return (<menu_1.Menu onMenuSelect={function (type) {
            onClose();
            switch (type) {
                case 'delete':
                    onDelete();
                    break;
                case 'merge':
                    onMerge();
                    break;
                case 'favorite':
                    onFavorite();
                    break;
                case 'learn':
                    onLearn();
                    break;
                default:
            }
        }} footer={<view_1.View style={{
                padding: 3,
                fontSize: 11,
                fontStyle: 'italic',
                color: theme_1.theme.pageTextSubdued,
            }}>
          {selectedPayees.size > 4 ? (<react_i18next_1.Trans>{{ selectedPayeeNames: selectedPayeeNames }}, and more</react_i18next_1.Trans>) : (selectedPayeeNames)}
        </view_1.View>} items={items}/>);
}
