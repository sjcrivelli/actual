"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reports = Reports;
var react_i18next_1 = require("react-i18next");
var view_1 = require("@actual-app/components/view");
var LoadComponent_1 = require("@desktop-client/components/util/LoadComponent");
function Reports() {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<view_1.View style={{ flex: 1 }} data-testid="reports-page">
      <LoadComponent_1.LoadComponent name="ReportRouter" message={t('Loading reports...')} importer={function () {
            return Promise.resolve().then(function () { return require(/* webpackChunkName: 'reports' */ './ReportRouter'); });
        }}/>
    </view_1.View>);
}
