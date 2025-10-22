"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parametrizedField = void 0;
var parametrizedField = function () {
    return function (field) {
        return function (id) {
            return "".concat(field, "-").concat(id);
        };
    };
};
exports.parametrizedField = parametrizedField;
