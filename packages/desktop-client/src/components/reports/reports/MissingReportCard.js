"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingReportCard = MissingReportCard;
var react_1 = require("react");
var view_1 = require("@actual-app/components/view");
var ReportCard_1 = require("@desktop-client/components/reports/ReportCard");
function MissingReportCard(_a) {
    var isEditing = _a.isEditing, onRemove = _a.onRemove, children = _a.children;
    return (<ReportCard_1.ReportCard isEditing={isEditing} menuItems={[
            {
                name: 'remove',
                text: 'Remove',
            },
        ]} onMenuSelect={function (item) {
            switch (item) {
                case 'remove':
                    onRemove();
                    break;
            }
        }}>
      <view_1.View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
        }}>
        {children}
      </view_1.View>
    </ReportCard_1.ReportCard>);
}
