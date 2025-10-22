"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarCategoryButtons = void 0;
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var CategoryAutomationButton_1 = require("./goals/CategoryAutomationButton");
var NotesButton_1 = require("@desktop-client/components/NotesButton");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useNotes_1 = require("@desktop-client/hooks/useNotes");
var SidebarCategoryButtons = function (_a) {
    var _b;
    var category = _a.category, dragging = _a.dragging, goalsShown = _a.goalsShown;
    var isGoalTemplatesUIEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesUIEnabled');
    var notes = (0, useNotes_1.useNotes)(category.id) || '';
    return (<>
      <view_1.View style={{ flex: 1 }}/>
      {!goalsShown && isGoalTemplatesUIEnabled && (<view_1.View style={{ flexShrink: 0 }}>
          <CategoryAutomationButton_1.CategoryAutomationButton category={category} style={dragging ? { color: 'currentColor' } : undefined} defaultColor={theme_1.theme.pageTextLight} showPlaceholder={!!notes}/>
        </view_1.View>)}
      <view_1.View style={{ flexShrink: 0 }}>
        <NotesButton_1.NotesButton id={category.id} style={dragging ? { color: 'currentColor' } : undefined} defaultColor={theme_1.theme.pageTextLight} showPlaceholder={!goalsShown &&
            isGoalTemplatesUIEnabled &&
            !!((_b = category.goal_def) === null || _b === void 0 ? void 0 : _b.length)}/>
      </view_1.View>
    </>);
};
exports.SidebarCategoryButtons = SidebarCategoryButtons;
