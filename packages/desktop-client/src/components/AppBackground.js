"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBackground = AppBackground;
var react_1 = require("react");
var react_spring_1 = require("react-spring");
var block_1 = require("@actual-app/components/block");
var AnimatedLoading_1 = require("@actual-app/components/icons/AnimatedLoading");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var Background_1 = require("./Background");
var redux_1 = require("@desktop-client/redux");
function AppBackground(_a) {
    var isLoading = _a.isLoading;
    var loadingText = (0, redux_1.useSelector)(function (state) { return state.app.loadingText; });
    var showLoading = isLoading || loadingText !== null;
    var transitions = (0, react_spring_1.useTransition)(loadingText, {
        from: { opacity: 0, transform: 'translateY(-100px)' },
        enter: { opacity: 1, transform: 'translateY(0)' },
        leave: { opacity: 0, transform: 'translateY(100px)' },
    });
    return (<>
      <Background_1.Background />

      {showLoading &&
            transitions(function (style, item) { return (<react_spring_1.animated.div key={item} style={style}>
            <view_1.View className={(0, css_1.css)({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: 50,
                    paddingTop: 200,
                    color: theme_1.theme.pageText,
                    alignItems: 'center',
                })}>
              <block_1.Block style={{ marginBottom: 20, fontSize: 18 }}>
                {loadingText}
              </block_1.Block>
              <AnimatedLoading_1.AnimatedLoading width={25} color={theme_1.theme.pageText}/>
            </view_1.View>
          </react_spring_1.animated.div>); })}
    </>);
}
