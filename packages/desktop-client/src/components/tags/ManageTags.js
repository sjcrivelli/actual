"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageTags = ManageTags;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var stack_1 = require("@actual-app/components/stack");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var normalisation_1 = require("loot-core/shared/normalisation");
var TagCreationRow_1 = require("./TagCreationRow");
var TagsHeader_1 = require("./TagsHeader");
var TagsList_1 = require("./TagsList");
var Search_1 = require("@desktop-client/components/common/Search");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useTags_1 = require("@desktop-client/hooks/useTags");
var redux_1 = require("@desktop-client/redux");
var tagsSlice_1 = require("@desktop-client/tags/tagsSlice");
function ManageTags() {
    var _this = this;
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, redux_1.useDispatch)();
    var _a = (0, react_1.useState)(''), filter = _a[0], setFilter = _a[1];
    var _b = (0, react_1.useState)(), hoveredTag = _b[0], setHoveredTag = _b[1];
    var _c = (0, react_1.useState)(false), create = _c[0], setCreate = _c[1];
    var tags = (0, useTags_1.useTags)();
    var filteredTags = (0, react_1.useMemo)(function () {
        return filter === ''
            ? tags
            : tags.filter(function (tag) {
                return (0, normalisation_1.getNormalisedString)(tag.tag).includes((0, normalisation_1.getNormalisedString)(filter));
            });
    }, [filter, tags]);
    var selectedInst = (0, useSelected_1.useSelected)('manage-tags', filteredTags, []);
    var onDeleteSelected = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dispatch((0, tagsSlice_1.deleteAllTags)(__spreadArray([], selectedInst.items, true)));
            selectedInst.dispatch({ type: 'select-none' });
            return [2 /*return*/];
        });
    }); }, [dispatch, selectedInst]);
    return (<useSelected_1.SelectedProvider instance={selectedInst}>
      <view_1.View>
        <view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 0 15px',
            flexShrink: 0,
        }}>
          <view_1.View style={{
            color: theme_1.theme.pageTextLight,
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
        }}>
            <react_i18next_1.Trans>User defined tags with color and description.</react_i18next_1.Trans>
          </view_1.View>
        </view_1.View>
        <stack_1.Stack spacing={2} direction="row" align="center" style={{ marginTop: 12 }}>
          <button_1.Button variant="bare" onPress={function () { return setCreate(true); }}>
            <v1_1.SvgAdd width={10} height={10} style={{ marginRight: 3 }}/>
            <react_i18next_1.Trans>Add New</react_i18next_1.Trans>
          </button_1.Button>
          <button_1.Button variant="bare" onPress={function () { return dispatch((0, tagsSlice_1.findTags)()); }}>
            <v2_1.SvgSearchAlternate width={10} height={10} style={{ marginRight: 3 }}/>
            <react_i18next_1.Trans>Find Existing Tags</react_i18next_1.Trans>
          </button_1.Button>
          <view_1.View style={{ flex: 1 }}/>
          <Search_1.Search placeholder={t('Filter tags...')} value={filter} onChange={setFilter}/>
        </stack_1.Stack>
        <view_1.View style={{ flex: 1, marginTop: 12 }}>
          <TagsHeader_1.TagsHeader />
          {create && (<TagCreationRow_1.TagCreationRow onClose={function () { return setCreate(false); }} tags={tags}/>)}
          {tags.length ? (<TagsList_1.TagsList tags={filteredTags} selectedItems={selectedInst.items} hoveredTag={hoveredTag} onHover={function (id) { return setHoveredTag(id !== null && id !== void 0 ? id : undefined); }}/>) : (<view_1.View style={{
                background: theme_1.theme.tableBackground,
                fontStyle: 'italic',
            }}>
              <text_1.Text style={{ margin: 'auto', padding: '20px' }}>
                <react_i18next_1.Trans>No Tags</react_i18next_1.Trans>
              </text_1.Text>
            </view_1.View>)}
        </view_1.View>
        <view_1.View style={{
            paddingBlock: 15,
            paddingInline: 0,
            borderTop: theme_1.theme.pillBorder,
            flexShrink: 0,
        }}>
          <stack_1.Stack direction="row" align="center" justify="flex-end" spacing={2}>
            {selectedInst.items.size > 0 && (<button_1.Button onPress={onDeleteSelected}>
                <react_i18next_1.Trans count={selectedInst.items.size}>
                  Delete {selectedInst.items.size} tags
                </react_i18next_1.Trans>
              </button_1.Button>)}
          </stack_1.Stack>
        </view_1.View>
      </view_1.View>
    </useSelected_1.SelectedProvider>);
}
