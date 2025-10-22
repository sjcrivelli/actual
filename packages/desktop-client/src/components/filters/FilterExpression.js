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
exports.FilterExpression = FilterExpression;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v0_1 = require("@actual-app/components/icons/v0");
var popover_1 = require("@actual-app/components/popover");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var rules_1 = require("loot-core/shared/rules");
var FiltersMenu_1 = require("./FiltersMenu");
var subfieldFromFilter_1 = require("./subfieldFromFilter");
var Value_1 = require("@desktop-client/components/rules/Value");
var isDatepickerClick = false;
function FilterExpression(_a) {
    var originalField = _a.field, customName = _a.customName, op = _a.op, value = _a.value, options = _a.options, style = _a.style, onChange = _a.onChange, onDelete = _a.onDelete;
    var t = (0, react_i18next_1.useTranslation)().t;
    var _b = (0, react_1.useState)(false), editing = _b[0], setEditing = _b[1];
    var triggerRef = (0, react_1.useRef)(null);
    var field = (0, subfieldFromFilter_1.subfieldFromFilter)({ field: originalField, value: value });
    return (<view_1.View style={__assign({ backgroundColor: theme_1.theme.pillBackground, borderRadius: 4, flexDirection: 'row', alignItems: 'center', marginRight: 10, marginTop: 10 }, style)}>
      <button_1.Button ref={triggerRef} variant="bare" isDisabled={customName != null} onPress={function () { return setEditing(true); }} style={{
            maxWidth: 'calc(100% - 26px)',
            whiteSpace: 'nowrap',
            display: 'block',
        }}>
        <div style={{
            paddingBlock: 1,
            paddingLeft: 5,
            paddingRight: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}>
          {customName ? (<text_1.Text style={{ color: theme_1.theme.pageTextPositive }}>{customName}</text_1.Text>) : (<>
              <text_1.Text style={{ color: theme_1.theme.pageTextPositive }}>
                {(0, rules_1.mapField)(field, options)}
              </text_1.Text>{' '}
              <text_1.Text>{(0, rules_1.friendlyOp)(op, null)}</text_1.Text>{' '}
              {!['onbudget', 'offbudget'].includes(op === null || op === void 0 ? void 0 : op.toLocaleLowerCase()) && (<Value_1.Value value={value} field={field} inline={true} valueIsRaw={op === 'contains' ||
                    op === 'matches' ||
                    op === 'doesNotContain' ||
                    op === 'hasTags'}/>)}
            </>)}
        </div>
      </button_1.Button>
      <button_1.Button variant="bare" onPress={onDelete} aria-label={t('Delete filter')}>
        <v0_1.SvgDelete style={{
            width: 8,
            height: 8,
            margin: 4,
        }}/>
      </button_1.Button>

      <popover_1.Popover triggerRef={triggerRef} placement="bottom start" isOpen={editing} onOpenChange={function () { return setEditing(false); }} shouldCloseOnInteractOutside={function (element) {
            // Datepicker selections for some reason register 2x clicks
            // We want to keep the popover open after selecting a date.
            // So we ignore the "close" event on selection + the subsequent event.
            if (element instanceof HTMLElement && element.dataset.pikaYear) {
                isDatepickerClick = true;
                return false;
            }
            if (isDatepickerClick) {
                isDatepickerClick = false;
                return false;
            }
            return true;
        }} style={{ width: 275, padding: 15, color: theme_1.theme.menuItemText }} data-testid="filters-menu-tooltip">
        <FiltersMenu_1.FilterEditor field={originalField} op={op} value={value} options={options} onSave={onChange} onClose={function () { return setEditing(false); }}/>
      </popover_1.Popover>
    </view_1.View>);
}
