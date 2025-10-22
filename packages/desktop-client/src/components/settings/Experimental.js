"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperimentalFeatures = ExperimentalFeatures;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var UI_1 = require("./UI");
var Link_1 = require("@desktop-client/components/common/Link");
var forms_1 = require("@desktop-client/components/forms");
var useFeatureFlag_1 = require("@desktop-client/hooks/useFeatureFlag");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function FeatureToggle(_a) {
    var flagName = _a.flag, _b = _a.disableToggle, disableToggle = _b === void 0 ? false : _b, feedbackLink = _a.feedbackLink, error = _a.error, children = _a.children;
    var enabled = (0, useFeatureFlag_1.useFeatureFlag)(flagName);
    var _c = (0, useSyncedPref_1.useSyncedPref)("flags.".concat(flagName)), _ = _c[0], setFlagPref = _c[1];
    return (<label style={{ display: 'flex' }}>
      <forms_1.Checkbox checked={enabled} onChange={function () {
            setFlagPref(String(!enabled));
        }} disabled={disableToggle}/>
      <view_1.View style={{ color: disableToggle ? theme_1.theme.pageTextSubdued : 'inherit' }}>
        <view_1.View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {children}
          {feedbackLink && (<Link_1.Link variant="external" to={feedbackLink}>
              <react_i18next_1.Trans>(give feedback)</react_i18next_1.Trans>
            </Link_1.Link>)}
        </view_1.View>

        {disableToggle && (<text_1.Text style={{
                color: theme_1.theme.errorText,
                fontWeight: 500,
            }}>
            {error}
          </text_1.Text>)}
      </view_1.View>
    </label>);
}
function GlobalFeatureToggle(_a) {
    var prefName = _a.prefName, _b = _a.disableToggle, disableToggle = _b === void 0 ? false : _b, feedbackLink = _a.feedbackLink, error = _a.error, children = _a.children;
    var _c = (0, useSyncedPref_1.useSyncedPref)(prefName, { isGlobal: true }), enabled = _c[0], setEnabled = _c[1];
    return (<label style={{ display: 'flex' }}>
      <forms_1.Checkbox checked={enabled === 'true'} onChange={function () {
            setEnabled(enabled === 'true' ? 'false' : 'true');
        }} disabled={disableToggle}/>
      <view_1.View style={{ color: disableToggle ? theme_1.theme.pageTextSubdued : 'inherit' }}>
        <view_1.View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          {children}
          {feedbackLink && (<Link_1.Link variant="external" to={feedbackLink}>
              <react_i18next_1.Trans>(give feedback)</react_i18next_1.Trans>
            </Link_1.Link>)}
        </view_1.View>

        {disableToggle && (<text_1.Text style={{
                color: theme_1.theme.errorText,
                fontWeight: 500,
            }}>
            {error}
          </text_1.Text>)}
      </view_1.View>
    </label>);
}
function ExperimentalFeatures() {
    var _a = (0, react_1.useState)(false), expanded = _a[0], setExpanded = _a[1];
    var goalTemplatesEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesEnabled');
    var goalTemplatesUIEnabled = (0, useFeatureFlag_1.useFeatureFlag)('goalTemplatesUIEnabled');
    var showGoalTemplatesUI = goalTemplatesUIEnabled ||
        (goalTemplatesEnabled &&
            localStorage.getItem('devEnableGoalTemplatesUI') === 'true');
    return (<UI_1.Setting primaryAction={expanded ? (<view_1.View style={{ gap: '1em' }}>
            <FeatureToggle flag="goalTemplatesEnabled">
              <react_i18next_1.Trans>Goal templates</react_i18next_1.Trans>
            </FeatureToggle>
            {showGoalTemplatesUI && (<view_1.View style={{ paddingLeft: 22 }}>
                <FeatureToggle flag="goalTemplatesUIEnabled">
                  <react_i18next_1.Trans>Subfeature: Budget automations UI</react_i18next_1.Trans>
                </FeatureToggle>
              </view_1.View>)}
            <FeatureToggle flag="actionTemplating" feedbackLink="https://github.com/actualbudget/actual/issues/3606">
              <react_i18next_1.Trans>Rule action templating</react_i18next_1.Trans>
            </FeatureToggle>
            <FeatureToggle flag="currency" feedbackLink="https://github.com/actualbudget/actual/issues/5191">
              <react_i18next_1.Trans>Currency support</react_i18next_1.Trans>
            </FeatureToggle>
            <GlobalFeatureToggle prefName="plugins" disableToggle={true} feedbackLink="https://github.com/actualbudget/actual/pull/4049">
              <react_i18next_1.Trans>Client-Side plugins (soon)</react_i18next_1.Trans>
            </GlobalFeatureToggle>
          </view_1.View>) : (<Link_1.Link variant="text" onClick={function () { return setExpanded(true); }} data-testid="experimental-settings" style={{
                flexShrink: 0,
                alignSelf: 'flex-start',
                color: theme_1.theme.pageTextPositive,
            }}>
            <react_i18next_1.Trans>I understand the risks, show experimental features</react_i18next_1.Trans>
          </Link_1.Link>)}>
      <text_1.Text>
        <react_i18next_1.Trans>
          <strong>Experimental features.</strong> These features are not fully
          tested and may not work as expected. THEY MAY CAUSE IRRECOVERABLE DATA
          LOSS. They may do nothing at all. Only enable them if you know what
          you are doing.
        </react_i18next_1.Trans>
      </text_1.Text>
    </UI_1.Setting>);
}
