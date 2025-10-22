"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesProvider = SchedulesProvider;
exports.useCachedSchedules = useCachedSchedules;
var react_1 = require("react");
var useSchedules_1 = require("./useSchedules");
var SchedulesContext = (0, react_1.createContext)(undefined);
function SchedulesProvider(_a) {
    var query = _a.query, children = _a.children;
    var data = (0, useSchedules_1.useSchedules)({ query: query });
    return (<SchedulesContext.Provider value={data}>
      {children}
    </SchedulesContext.Provider>);
}
function useCachedSchedules() {
    var context = (0, react_1.useContext)(SchedulesContext);
    if (!context) {
        throw new Error('useCachedSchedules must be used within a SchedulesProvider');
    }
    return context;
}
