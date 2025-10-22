"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplate = exports.setTemplate = exports.setType = void 0;
var setType = function (type) { return ({
    type: 'set-type',
    payload: type,
}); };
exports.setType = setType;
var setTemplate = function (template) { return ({
    type: 'set-template',
    payload: template,
}); };
exports.setTemplate = setTemplate;
var updateTemplate = function (template) { return ({
    type: 'update-template',
    payload: template,
}); };
exports.updateTemplate = updateTemplate;
