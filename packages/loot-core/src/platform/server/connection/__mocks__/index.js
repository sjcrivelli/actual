let events = [];
export const init = function () { };
export const send = function (type, args) {
    events.push([type, args]);
};
export const resetEvents = function () {
    events = [];
};
