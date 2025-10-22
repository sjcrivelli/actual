"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCategories = useCategories;
var react_1 = require("react");
var useInitialMount_1 = require("./useInitialMount");
var budgetSlice_1 = require("@desktop-client/budget/budgetSlice");
var redux_1 = require("@desktop-client/redux");
function useCategories() {
    var dispatch = (0, redux_1.useDispatch)();
    var isInitialMount = (0, useInitialMount_1.useInitialMount)();
    var isCategoriesDirty = (0, redux_1.useSelector)(function (state) { return state.budget.isCategoriesDirty; });
    (0, react_1.useEffect)(function () {
        if (isInitialMount || isCategoriesDirty) {
            dispatch((0, budgetSlice_1.getCategories)());
        }
    }, [dispatch, isInitialMount, isCategoriesDirty]);
    return (0, redux_1.useSelector)(function (state) { return state.budget.categories; });
}
