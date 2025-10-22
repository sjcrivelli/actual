"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WideComponent = WideComponent;
exports.NarrowAlternate = NarrowAlternate;
var useResponsive_1 = require("@actual-app/components/hooks/useResponsive");
var LoadComponent_1 = require("@desktop-client/components/util/LoadComponent");
var loadNarrow = function () {
    return Promise.resolve().then(function () { return require(/* webpackChunkName: "narrow-components" */ './narrow'); });
};
var loadWide = function () {
    return Promise.resolve().then(function () { return require(/* webpackChunkName: "wide-components" */ './wide'); });
};
function WideComponent(_a) {
    var name = _a.name;
    return <LoadComponent_1.LoadComponent name={name} importer={loadWide}/>;
}
function NarrowAlternate(_a) {
    var name = _a.name;
    var isNarrowWidth = (0, useResponsive_1.useResponsive)().isNarrowWidth;
    return (<LoadComponent_1.LoadComponent name={name} importer={isNarrowWidth ? loadNarrow : loadWide}/>);
}
