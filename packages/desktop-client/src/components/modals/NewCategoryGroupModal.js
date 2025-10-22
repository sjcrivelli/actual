"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewCategoryGroupModal = NewCategoryGroupModal;
var react_i18next_1 = require("react-i18next");
var SingleInputModal_1 = require("./SingleInputModal");
var Modal_1 = require("@desktop-client/components/common/Modal");
function NewCategoryGroupModal(_a) {
    var onValidate = _a.onValidate, onSubmit = _a.onSubmit;
    var t = (0, react_i18next_1.useTranslation)().t;
    return (<SingleInputModal_1.SingleInputModal name="new-category-group" Header={function (props) { return (<Modal_1.ModalHeader {...props} title={<Modal_1.ModalTitle title={t('New Category Group')} shrinkOnOverflow/>}/>); }} inputPlaceholder={t('Category group name')} buttonText={t('Add')} onValidate={onValidate} onSubmit={onSubmit}/>);
}
