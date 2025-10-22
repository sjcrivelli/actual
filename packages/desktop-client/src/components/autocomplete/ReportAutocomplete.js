"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportAutocomplete = ReportAutocomplete;
var react_1 = require("react");
var Autocomplete_1 = require("./Autocomplete");
var ReportList_1 = require("./ReportList");
var useReports_1 = require("@desktop-client/hooks/useReports");
function ReportAutocomplete(_a) {
    var embedded = _a.embedded, props = __rest(_a, ["embedded"]);
    var reports = (0, useReports_1.useReports)().data;
    return (<Autocomplete_1.Autocomplete strict={true} highlightFirst={true} embedded={embedded} suggestions={reports} renderItems={function (items, getItemProps, highlightedIndex) { return (<ReportList_1.ReportList items={items} getItemProps={getItemProps} highlightedIndex={highlightedIndex} embedded={embedded}/>); }} {...props}/>);
}
