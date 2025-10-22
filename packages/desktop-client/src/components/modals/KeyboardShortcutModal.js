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
exports.KeyboardShortcutModal = KeyboardShortcutModal;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var button_1 = require("@actual-app/components/button");
var v1_1 = require("@actual-app/components/icons/v1");
var initial_focus_1 = require("@actual-app/components/initial-focus");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var theme_1 = require("@actual-app/components/theme");
var view_1 = require("@actual-app/components/view");
var Platform = require("loot-core/shared/platform");
var Modal_1 = require("@desktop-client/components/common/Modal");
var Search_1 = require("@desktop-client/components/common/Search");
function KeyIcon(_a) {
    var shortcut = _a.shortcut, style = _a.style;
    return (<div style={__assign({ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: 8, minWidth: 30, minHeight: 30, filter: 'drop-shadow(1px 1px)', padding: 5 }, style)}>
      {shortcut}
    </div>);
}
function ListItem(_a) {
    var children = _a.children, style = _a.style, onClick = _a.onClick;
    var clickStyles = onClick && {
        cursor: 'pointer',
    };
    return (<view_1.View style={__assign(__assign({ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 5, padding: 12, backgroundColor: theme_1.theme.tableBackground, borderBottomWidth: 1, borderColor: theme_1.theme.tableBorder, height: 45, flexShrink: 0, ':hover': {
                backgroundColor: theme_1.theme.tableRowBackgroundHover,
                color: theme_1.theme.tableText,
            } }, clickStyles), style)} onClick={onClick}>
      {children}
    </view_1.View>);
}
function ShortcutListItem(_a) {
    var shortcut = _a.shortcut, description = _a.description, meta = _a.meta, shift = _a.shift, style = _a.style;
    return (<ListItem>
      <text_1.Text>{description}</text_1.Text>

      <view_1.View style={{
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            flexShrink: 0,
        }}>
        {shift && (<>
            <KeyIcon shortcut="Shift"/>
            <text_1.Text>+</text_1.Text>
          </>)}
        {meta && (<>
            <KeyIcon shortcut={meta}/>
            <text_1.Text>+</text_1.Text>
          </>)}
        <KeyIcon shortcut={shortcut} style={style}/>
      </view_1.View>
    </ListItem>);
}
function KeyboardShortcutModal() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var ctrl = Platform.OS === 'mac' ? '⌘' : 'Ctrl';
    var _a = (0, react_1.useState)(''), searchText = _a[0], setSearchText = _a[1];
    var _b = (0, react_1.useState)(null), selectedCategoryId = _b[0], setSelectedCategoryId = _b[1];
    // In future, we may move this to state and pull overrides from config/db
    // This would allow us to drive our shortcuts from state instead of hardcoding them
    var defaultShortcuts = (0, react_1.useMemo)(function () { return [
        {
            name: t('General'),
            id: 'general',
            items: [
                {
                    id: 'help',
                    shortcut: '?',
                    description: t('Open the help menu'),
                },
                {
                    id: 'command-palette',
                    shortcut: 'K',
                    description: t('Open the Command Palette'),
                    meta: ctrl,
                },
                {
                    id: 'close-budget',
                    shortcut: 'O',
                    description: t('Close the current budget and open another'),
                    meta: ctrl,
                },
                {
                    id: 'toggle-privacy-filter',
                    shortcut: 'P',
                    description: t('Toggle the privacy filter'),
                    meta: ctrl,
                    shift: true,
                },
                {
                    id: 'undo-last-change',
                    shortcut: 'Z',
                    description: t('Undo the last change'),
                    meta: ctrl,
                },
                {
                    id: 'redo-last-change',
                    shortcut: 'Z',
                    description: t('Redo the last undone change'),
                    shift: true,
                    meta: ctrl,
                },
            ],
        },
        {
            id: 'budget-page',
            name: t('Budget page'),
            items: [
                {
                    id: 'current-month',
                    shortcut: '0',
                    style: {
                        fontVariantNumeric: 'slashed-zero',
                    },
                    description: t('View current month'),
                },
                {
                    id: 'view-previous-month',
                    shortcut: '←',
                    description: t('View previous month'),
                },
                {
                    id: 'view-next-month',
                    shortcut: '→',
                    description: t('View next month'),
                },
            ],
        },
        {
            id: 'account-page',
            name: t('Account page'),
            items: [
                {
                    id: 'move-down',
                    shortcut: 'Enter',
                    description: t('Move down when editing'),
                },
                {
                    id: 'move-up',
                    shortcut: 'Enter',
                    shift: true,
                    description: t('Move up when editing'),
                },
                {
                    id: 'import-transactions',
                    shortcut: 'I',
                    meta: ctrl,
                    description: t('Import transactions'),
                },
                {
                    id: 'bank-sync',
                    shortcut: 'B',
                    meta: ctrl,
                    description: t('Bank sync'),
                },
                {
                    id: 'filter-to-selected-transactions',
                    shortcut: 'F',
                    description: t('Filter to the selected transactions'),
                },
                {
                    id: 'delete-selected-transactions',
                    shortcut: 'D',
                    description: t('Delete the selected transactions'),
                },
                {
                    id: 'set-account-for-selected-transactions',
                    shortcut: 'A',
                    description: t('Set account for selected transactions'),
                },
                {
                    id: 'set-payee-for-selected-transactions',
                    shortcut: 'P',
                    description: t('Set payee for selected transactions'),
                },
                {
                    id: 'set-notes-for-selected-transactions',
                    shortcut: 'N',
                    description: t('Set notes for selected transactions'),
                },
                {
                    id: 'set-category-for-selected-transactions',
                    shortcut: 'C',
                    description: t('Set category for selected transactions'),
                },
                {
                    id: 'toggle-cleared-for-selected-transactions',
                    shortcut: 'L',
                    description: t('Toggle cleared for selected transactions'),
                },
                {
                    id: 'link-or-view-schedule-for-selected-transactions',
                    shortcut: 'S',
                    description: t('Link or view schedule for selected transactions'),
                },
                {
                    id: 'select-all-transactions',
                    shortcut: 'A',
                    description: t('Select all transactions'),
                    meta: ctrl,
                },
                {
                    id: 'move-left-when-editing',
                    shortcut: 'Tab',
                    description: t('Move left when editing'),
                    shift: true,
                },
                {
                    id: 'move-right-when-editing',
                    shortcut: 'Tab',
                    description: t('Move right when editing'),
                },
                {
                    id: 'add-new-transaction',
                    shortcut: 'T',
                    description: t('Add a new transaction'),
                },
                {
                    id: 'filter-transactions',
                    shortcut: 'F',
                    description: t('Filter transactions'),
                },
                {
                    id: 'move-next-transaction',
                    shortcut: 'J',
                    description: t('Move to the next transaction down'),
                },
                {
                    id: 'move-previous-transaction',
                    shortcut: 'K',
                    description: t('Move to the next transaction up'),
                },
                {
                    id: 'move-previous-transaction-scroll',
                    shortcut: '↑',
                    description: t('Move to the previous transaction and scroll'),
                },
                {
                    id: 'move-next-transaction-scroll',
                    shortcut: '↓',
                    description: t('Move to the next transaction and scroll'),
                },
                {
                    id: 'toggle-selection-current-transaction',
                    shortcut: 'Space',
                    description: t('Toggle selection of current transaction'),
                },
                {
                    id: 'toggle-selection-all-transactions',
                    shortcut: 'Space',
                    description: t('Toggle transactions between current and most recently selected transaction'),
                    shift: true,
                },
            ],
        },
    ]; }, [t, ctrl]);
    var _c = (0, react_1.useMemo)(function () {
        var isSearching = Boolean(searchText);
        var isInCategory = Boolean(selectedCategoryId);
        if (isSearching) {
            // Show all matching shortcuts across all categories
            var allMatches = defaultShortcuts.flatMap(function (category) {
                return category.items.filter(function (item) {
                    return item.description.toLowerCase().includes(searchText.toLowerCase());
                });
            });
            return {
                isSearching: isSearching,
                isInCategory: false,
                currentCategory: null,
                itemsToShow: allMatches,
            };
        }
        if (isInCategory) {
            // Show shortcuts for selected category
            var category = defaultShortcuts.find(function (s) { return s.id === selectedCategoryId; });
            return {
                isSearching: false,
                isInCategory: true,
                currentCategory: category || null,
                itemsToShow: (category === null || category === void 0 ? void 0 : category.items) || [],
            };
        }
        // Show category list
        return {
            isSearching: false,
            isInCategory: false,
            currentCategory: null,
            itemsToShow: defaultShortcuts,
        };
    }, [searchText, selectedCategoryId, defaultShortcuts]), isSearching = _c.isSearching, isInCategory = _c.isInCategory, currentCategory = _c.currentCategory, itemsToShow = _c.itemsToShow;
    var showingShortcuts = isSearching || isInCategory;
    return (<Modal_1.Modal name="keyboard-shortcuts" containerProps={{ style: { width: 700 } }}>
      {function (_a) {
            var close = _a.state.close;
            return (<>
          <Modal_1.ModalHeader title={isSearching
                    ? t('Search results')
                    : currentCategory
                        ? t('{{categoryName}} shortcuts', {
                            categoryName: currentCategory.name,
                        })
                        : t('Keyboard shortcuts')} leftContent={showingShortcuts ? (<button_1.Button variant="bare" onClick={function () {
                        setSearchText('');
                        setSelectedCategoryId(null);
                    }} style={{ marginRight: 10, marginLeft: 15, zIndex: 3000 }}>
                  <v1_1.SvgArrowLeft width={10} height={10} style={{ marginRight: 5, color: 'currentColor' }}/>
                  <react_i18next_1.Trans>Back</react_i18next_1.Trans>
                </button_1.Button>) : null} rightContent={<Modal_1.ModalCloseButton onPress={close}/>}/>
          <view_1.View style={{
                    flexDirection: 'column',
                    fontSize: 13,
                    padding: '0 16px 16px 16px',
                }}>
            <initial_focus_1.InitialFocus>
              {function (ref) { return (<Search_1.Search inputRef={ref} value={searchText} isInModal onChange={function (text) {
                        setSearchText(text);
                        // Clear category selection when searching to search all shortcuts
                        if (text && selectedCategoryId) {
                            setSelectedCategoryId(null);
                        }
                    }} placeholder={t('Search shortcuts')} width="100%" style={{
                        backgroundColor: theme_1.theme.tableBackground,
                        borderColor: theme_1.theme.formInputBorder,
                        marginBottom: 10,
                    }}/>); }}
            </initial_focus_1.InitialFocus>
            <view_1.View style={{
                    flexDirection: 'column',
                    overflowY: 'auto',
                    maxHeight: '40vh',
                    height: 400,
                    backgroundColor: theme_1.theme.tableBackground,
                    border: "1px solid ".concat(theme_1.theme.tableBorder),
                    borderRadius: styles_1.styles.menuBorderRadius,
                }}>
              {itemsToShow.length === 0 ? (<view_1.View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                    }}>
                  <text_1.Text style={{ fontSize: 15 }}>
                    <react_i18next_1.Trans>
                      {isSearching
                        ? 'No matching shortcuts'
                        : isInCategory
                            ? 'No shortcuts in this category'
                            : 'No matching shortcuts'}
                    </react_i18next_1.Trans>
                  </text_1.Text>
                </view_1.View>) : showingShortcuts ? (itemsToShow.map(function (shortcut) { return (<ShortcutListItem key={shortcut.id} shortcut={shortcut.shortcut} description={shortcut.description} meta={shortcut.meta} shift={shortcut.shift} style={shortcut.style}/>); })) : (itemsToShow.map(function (category) { return (<ListItem key={category.id} onClick={function () {
                        if (category.items.length > 0) {
                            setSelectedCategoryId(category.id);
                        }
                    }}>
                    <view_1.View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}>
                      <text_1.Text style={{ fontWeight: 'bold' }}>
                        {category.name}
                      </text_1.Text>
                      <text_1.Text style={{ color: theme_1.theme.pageTextLight }}>
                        {category.items.length}{' '}
                        {category.items.length === 1
                        ? t('shortcut')
                        : t('shortcuts')}{' '}
                        ›
                      </text_1.Text>
                    </view_1.View>
                  </ListItem>); }))}
            </view_1.View>
          </view_1.View>
        </>);
        }}
    </Modal_1.Modal>);
}
