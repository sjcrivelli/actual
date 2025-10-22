"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopmentTopBar = DevelopmentTopBar;
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Link_1 = require("./common/Link");
function DevelopmentTopBar() {
    return (<view_1.View style={{
            padding: '6px 20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            color: theme_1.theme.warningText,
            backgroundColor: theme_1.theme.warningBackground,
            borderBottom: "1px solid ".concat(theme_1.theme.warningBorder),
            zIndex: 1,
            flexShrink: 0,
        }}>
      <view_1.View>This is a demo build of Actual.</view_1.View>
      <view_1.View>
        <Link_1.Link variant="external" linkColor="purple" to={"https://github.com/actualbudget/actual/pull/".concat(process.env.REACT_APP_REVIEW_ID)}>
          Open the PR: #{process.env.REACT_APP_REVIEW_ID}
        </Link_1.Link>
      </view_1.View>
    </view_1.View>);
}
