"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monthUtils = require("./months");
test('range returns a full range', function () {
    expect(monthUtils.range('2016-10', '2018-01')).toMatchSnapshot();
});
