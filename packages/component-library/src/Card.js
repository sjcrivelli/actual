"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
const react_1 = require("react");
const theme_1 = require("./theme");
const View_1 = require("./View");
exports.Card = (0, react_1.forwardRef)(({ children, ...props }, ref) => {
    return (<View_1.View {...props} ref={ref} style={{
            marginTop: 15,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 6,
            backgroundColor: theme_1.theme.cardBackground,
            borderColor: theme_1.theme.cardBorder,
            boxShadow: '0 1px 2px #9594A8',
            ...props.style,
        }}>
        <View_1.View style={{
            borderRadius: 6,
            overflow: 'hidden',
        }}>
          {children}
        </View_1.View>
      </View_1.View>);
});
exports.Card.displayName = 'Card';
