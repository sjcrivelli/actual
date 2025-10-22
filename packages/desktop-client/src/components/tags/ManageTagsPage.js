"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageTagsPage = void 0;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var ManageTags_1 = require("./ManageTags");
var Page_1 = require("@desktop-client/components/Page");
var ManageTagsPage = function () {
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<Page_1.Page header={t('Tags')}>
      <ManageTags_1.ManageTags />
    </Page_1.Page>);
};
exports.ManageTagsPage = ManageTagsPage;
