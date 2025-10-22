"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategory = useCategory;
var react_1 = require("react");
var useCategories_1 = require("./useCategories");
function useCategory(id) {
    var categories = (0, useCategories_1.useCategories)().list;
    return (0, react_1.useMemo)(function () { return categories.find(function (c) { return c.id === id; }); }, [id, categories]);
}
