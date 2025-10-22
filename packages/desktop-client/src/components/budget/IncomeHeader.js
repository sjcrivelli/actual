"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeHeader = IncomeHeader;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var view_1 = require("@actual-app/components/view");
var RenderMonths_1 = require("./RenderMonths");
var useGlobalPref_1 = require("@desktop-client/hooks/useGlobalPref");
function IncomeHeader(_a) {
    var MonthComponent = _a.MonthComponent, onShowNewGroup = _a.onShowNewGroup;
    var categoryExpandedStatePref = (0, useGlobalPref_1.useGlobalPref)('categoryExpandedState')[0];
    var categoryExpandedState = categoryExpandedStatePref !== null && categoryExpandedStatePref !== void 0 ? categoryExpandedStatePref : 0;
    return (<view_1.View style={{ flexDirection: 'row', flex: 1 }}>
      <view_1.View style={{
            width: 200 + 100 * categoryExpandedState,
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
        }}>
        <button_1.Button onPress={onShowNewGroup} style={{ fontSize: 12, margin: 10 }}>
          <react_i18next_1.Trans>Add group</react_i18next_1.Trans>
        </button_1.Button>
      </view_1.View>
      <RenderMonths_1.RenderMonths component={MonthComponent} style={{ border: 0, justifyContent: 'flex-end' }}/>
    </view_1.View>);
}
