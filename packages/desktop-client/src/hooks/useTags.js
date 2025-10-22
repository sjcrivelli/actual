"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTags = useTags;
var react_1 = require("react");
var useInitialMount_1 = require("./useInitialMount");
var redux_1 = require("@desktop-client/redux");
var tagsSlice_1 = require("@desktop-client/tags/tagsSlice");
function useTags() {
    var dispatch = (0, redux_1.useDispatch)();
    var isInitialMount = (0, useInitialMount_1.useInitialMount)();
    var isTagsDirty = (0, redux_1.useSelector)(function (state) { return state.tags.isTagsDirty; });
    (0, react_1.useEffect)(function () {
        if (isInitialMount || isTagsDirty) {
            dispatch((0, tagsSlice_1.getTags)());
        }
    }, [dispatch, isInitialMount, isTagsDirty]);
    return (0, redux_1.useSelector)(function (state) { return state.tags.tags; });
}
