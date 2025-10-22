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
exports.ReportList = ReportList;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var ItemHeader_1 = require("./ItemHeader");
function ReportList(_a) {
    var items = _a.items, getItemProps = _a.getItemProps, highlightedIndex = _a.highlightedIndex, embedded = _a.embedded;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View>
      <view_1.View style={__assign({ overflow: 'auto', padding: '5px 0' }, (!embedded && { maxHeight: 175 }))}>
        <ItemHeader_1.ItemHeader title={t('Saved Reports')}/>
        {items.map(function (item, idx) {
            return [
                <div {...(getItemProps ? getItemProps({ item: item }) : null)} key={item.id} style={{
                        backgroundColor: highlightedIndex === idx
                            ? theme_1.theme.menuAutoCompleteBackgroundHover
                            : 'transparent',
                        padding: 4,
                        paddingLeft: 20,
                        borderRadius: embedded ? 4 : 0,
                    }} data-highlighted={highlightedIndex === idx || undefined}>
              {item.name}
            </div>,
            ];
        })}
      </view_1.View>
    </view_1.View>);
}
