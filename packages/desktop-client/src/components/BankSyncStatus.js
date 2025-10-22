"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankSyncStatus = BankSyncStatus;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_spring_1 = require("react-spring");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var AnimatedRefresh_1 = require("./AnimatedRefresh");
var redux_1 = require("@desktop-client/redux");
function BankSyncStatus() {
    var accountsSyncing = (0, redux_1.useSelector)(function (state) { return state.account.accountsSyncing; });
    var accountsSyncingCount = accountsSyncing.length;
    var count = accountsSyncingCount;
    var transitions = (0, react_spring_1.useTransition)(accountsSyncingCount > 0 ? 'syncing' : null, {
        from: { opacity: 0, transform: 'translateY(-100px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(-100px)' },
    });
    return (<view_1.View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            marginTop: 5,
            alignItems: 'center',
            zIndex: 501,
        }}>
      {transitions(function (style, item) {
            return item && (<react_spring_1.animated.div key={item} style={style}>
              <view_1.View style={__assign({ borderRadius: 4, backgroundColor: theme_1.theme.pillBackgroundSelected, color: theme_1.theme.pillTextSelected, padding: '5px 13px', flexDirection: 'row', alignItems: 'center' }, styles_1.styles.shadow)}>
                <AnimatedRefresh_1.AnimatedRefresh animating iconStyle={{ color: theme_1.theme.pillTextSelected }}/>
                <text_1.Text style={{ marginLeft: 5 }}>
                  <react_i18next_1.Trans count={accountsSyncingCount}>
                    Syncing... {{ count: count }} accounts remaining
                  </react_i18next_1.Trans>
                </text_1.Text>
              </view_1.View>
            </react_spring_1.animated.div>);
        })}
    </view_1.View>);
}
