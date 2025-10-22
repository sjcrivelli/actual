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
exports.LoadingIndicator = void 0;
var react_1 = require("react");
var block_1 = require("@actual-app/components/block");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var styles_1 = require("@actual-app/components/styles");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var LoadingIndicator = function (_a) {
    var message = _a.message;
    return (<view_1.View style={__assign({ flex: 1, gap: 20, justifyContent: 'center', alignItems: 'center' }, styles_1.styles.delayedFadeIn)}>
      {message && (<block_1.Block style={{ marginBottom: 20, fontSize: 18 }}>{message}</block_1.Block>)}
      <AnimatedLoading_1.AnimatedLoading style={{ width: 25, height: 25, color: theme_1.theme.pageTextDark }}/>
    </view_1.View>);
};
exports.LoadingIndicator = LoadingIndicator;
