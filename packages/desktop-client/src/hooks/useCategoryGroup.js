"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategoryGroup = useCategoryGroup;
var react_1 = require("react");
var useCategories_1 = require("./useCategories");
function useCategoryGroup(id) {
    var categoryGroups = (0, useCategories_1.useCategories)().grouped;
    return (0, react_1.useMemo)(function () { return categoryGroups.find(function (g) { return g.id === id; }); }, [id, categoryGroups]);
}
