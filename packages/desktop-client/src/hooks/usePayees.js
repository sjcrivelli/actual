"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCommonPayees = useCommonPayees;
exports.usePayees = usePayees;
exports.usePayeesById = usePayeesById;
var react_1 = require("react");
var useInitialMount_1 = require("./useInitialMount");
var payeesSlice_1 = require("@desktop-client/payees/payeesSlice");
var redux_1 = require("@desktop-client/redux");
function useCommonPayees() {
    var dispatch = (0, redux_1.useDispatch)();
    var isInitialMount = (0, useInitialMount_1.useInitialMount)();
    var isCommonPayeesDirty = (0, redux_1.useSelector)(function (state) { return state.payees.isCommonPayeesDirty; });
    (0, react_1.useEffect)(function () {
        if (isInitialMount || isCommonPayeesDirty) {
            dispatch((0, payeesSlice_1.getCommonPayees)());
        }
    }, [dispatch, isInitialMount, isCommonPayeesDirty]);
    return (0, redux_1.useSelector)(function (state) { return state.payees.commonPayees; });
}
function usePayees() {
    var dispatch = (0, redux_1.useDispatch)();
    var isInitialMount = (0, useInitialMount_1.useInitialMount)();
    var isPayeesDirty = (0, redux_1.useSelector)(function (state) { return state.payees.isPayeesDirty; });
    (0, react_1.useEffect)(function () {
        if (isInitialMount || isPayeesDirty) {
            dispatch((0, payeesSlice_1.getPayees)());
        }
    }, [dispatch, isInitialMount, isPayeesDirty]);
    return (0, redux_1.useSelector)(function (state) { return state.payees.payees; });
}
function usePayeesById() {
    var payees = usePayees();
    return (0, payeesSlice_1.getPayeesById)(payees);
}
