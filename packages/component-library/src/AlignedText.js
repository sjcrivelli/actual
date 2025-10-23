"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlignedText = AlignedText;
const Block_1 = require("./Block");
const View_1 = require("./View");
function AlignedText({ left, right, style, leftStyle, rightStyle, truncate = 'left', ...nativeProps }) {
    const truncateStyle = {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    };
    return (<View_1.View style={{ flexDirection: 'row', alignItems: 'center', ...style }} {...nativeProps}>
      <Block_1.Block style={{
            marginRight: 10,
            ...(truncate === 'left' && truncateStyle),
            ...leftStyle,
        }}>
        {left}
      </Block_1.Block>
      <Block_1.Block style={{
            flex: 1,
            textAlign: 'right',
            ...(truncate === 'right' && truncateStyle),
            ...rightStyle,
        }}>
        {right}
      </Block_1.Block>
    </View_1.View>);
}
