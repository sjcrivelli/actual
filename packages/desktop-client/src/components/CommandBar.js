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
exports.CommandBar = CommandBar;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var styles_1 = require("@actual-app/components/styles");
var text_1 = require("@actual-app/components/text");
var view_1 = require("@actual-app/components/view");
var css_1 = require("@emotion/css");
var cmdk_1 = require("cmdk");
var CellValue_1 = require("./spreadsheet/CellValue");
var useAccounts_1 = require("@desktop-client/hooks/useAccounts");
var useMetadataPref_1 = require("@desktop-client/hooks/useMetadataPref");
var useModalState_1 = require("@desktop-client/hooks/useModalState");
var useNavigate_1 = require("@desktop-client/hooks/useNavigate");
var useReports_1 = require("@desktop-client/hooks/useReports");
var bindings_1 = require("@desktop-client/spreadsheet/bindings");
function BalanceRow(_a) {
    var label = _a.label, binding = _a.binding;
    return (<view_1.View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
        }}>
      <text_1.Text>{label}</text_1.Text>
      <CellValue_1.CellValue binding={binding} type="financial">
        {function (props) { return (<CellValue_1.CellValueText {...props} style={__assign(__assign({}, styles_1.styles.tnum), { whiteSpace: 'nowrap', opacity: 0.9 })}/>); }}
      </CellValue_1.CellValue>
    </view_1.View>);
}
function CommandBar() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, react_1.useState)(false), open = _a[0], setOpen = _a[1];
    var _b = (0, react_1.useState)(''), search = _b[0], setSearch = _b[1];
    var navigate = (0, useNavigate_1.useNavigate)();
    var budgetName = (0, useMetadataPref_1.useMetadataPref)('budgetName')[0];
    var modalStack = (0, useModalState_1.useModalState)().modalStack;
    var navigationItems = (0, react_1.useMemo)(function () { return [
        { id: 'budget', name: t('Budget'), path: '/budget', Icon: v1_1.SvgWallet },
        {
            id: 'reports-nav',
            name: t('Reports'),
            path: '/reports',
            Icon: v1_1.SvgReports,
        },
        {
            id: 'schedules',
            name: t('Schedules'),
            path: '/schedules',
            Icon: v2_1.SvgCalendar3,
        },
        { id: 'payees', name: t('Payees'), path: '/payees', Icon: v1_1.SvgStoreFront },
        { id: 'rules', name: t('Rules'), path: '/rules', Icon: v1_1.SvgTuning },
        { id: 'tags', name: t('Tags'), path: '/tags', Icon: v1_1.SvgTag },
        { id: 'settings', name: t('Settings'), path: '/settings', Icon: v1_1.SvgCog },
        {
            id: 'accounts',
            name: t('All Accounts'),
            path: '/accounts',
            content: (<BalanceRow label={t('All Accounts')} binding={(0, bindings_1.allAccountBalance)()}/>),
            Icon: v1_1.SvgLibrary,
        },
    ]; }, [t]);
    (0, react_1.useEffect)(function () {
        // Reset search when closing
        if (!open)
            setSearch('');
    }, [open]);
    var allAccounts = (0, useAccounts_1.useAccounts)();
    var customReports = (0, useReports_1.useReports)().data;
    var accounts = allAccounts.filter(function (acc) { return !acc.closed; });
    var openEventListener = (0, react_1.useCallback)(function (e) {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            // Do not open CommandBar if a modal is already open
            if (modalStack.length > 0)
                return;
            setOpen(true);
        }
    }, [modalStack.length]);
    (0, react_1.useEffect)(function () {
        document.addEventListener('keydown', openEventListener);
        return function () { return document.removeEventListener('keydown', openEventListener); };
    }, [openEventListener]);
    var handleNavigate = (0, react_1.useCallback)(function (path) {
        setOpen(false);
        navigate(path);
    }, [navigate]);
    var sections = [
        {
            key: 'navigation',
            heading: t('Navigation'),
            items: navigationItems,
            onSelect: function (_a) {
                var id = _a.id;
                var item = navigationItems.find(function (item) { return item.id === id; });
                if (!!item)
                    handleNavigate(item.path);
            },
        },
        {
            key: 'accounts',
            heading: t('Accounts'),
            items: __spreadArray([
                {
                    id: 'onbudget',
                    name: t('On Budget'),
                    content: (<BalanceRow label={t('On Budget')} binding={(0, bindings_1.onBudgetAccountBalance)()}/>),
                    Icon: v1_1.SvgLibrary,
                },
                {
                    id: 'offbudget',
                    name: t('Off Budget'),
                    content: (<BalanceRow label={t('Off Budget')} binding={(0, bindings_1.offBudgetAccountBalance)()}/>),
                    Icon: v1_1.SvgLibrary,
                }
            ], accounts.map(function (account) { return (__assign(__assign({}, account), { content: (<BalanceRow label={account.name} binding={(0, bindings_1.accountBalance)(account.id)}/>), Icon: v1_1.SvgPiggyBank })); }), true),
            onSelect: function (_a) {
                var id = _a.id;
                return handleNavigate("/accounts/".concat(id));
            },
        },
        {
            key: 'reports-custom',
            heading: t('Custom Reports'),
            items: customReports.map(function (report) { return (__assign(__assign({}, report), { Icon: v2_1.SvgNotesPaperText })); }),
            onSelect: function (_a) {
                var id = _a.id;
                return handleNavigate("/reports/custom/".concat(id));
            },
        },
    ];
    var searchLower = search.toLowerCase();
    var filteredSections = sections.map(function (section) { return (__assign(__assign({}, section), { items: section.items.filter(function (item) {
            return item.name.toLowerCase().includes(searchLower);
        }) })); });
    var hasResults = filteredSections.some(function (section) { return !!section.items.length; });
    return (<cmdk_1.Command.Dialog vimBindings open={open} onOpenChange={setOpen} label={t('Command Bar')} aria-label={t('Command Bar')} shouldFilter={false} className={(0, css_1.css)({
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            width: '90%',
            maxWidth: '600px',
            backgroundColor: 'var(--color-modalBackground)',
            border: '1px solid var(--color-modalBorder)',
            color: 'var(--color-pageText)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            zIndex: 3001,
        })}>
      <cmdk_1.Command.Input autoFocus placeholder={t('Search {{budgetName}}...', { budgetName: budgetName })} value={search} onValueChange={setSearch} className={(0, css_1.css)({
            width: '100%',
            padding: '12px 16px',
            fontSize: '1rem',
            border: 'none',
            borderBottom: '1px solid var(--color-tableBorderSeparator)',
            backgroundColor: 'transparent',
            color: 'var(--color-pageText)',
            outline: 'none',
            '&::placeholder': {
                color: 'var(--color-pageTextSubdued)',
            },
        })}/>
      <cmdk_1.Command.List className={(0, css_1.css)({
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '8px 0',
            // Hide the scrollbar
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
            // Ensure content is still scrollable
            msOverflowStyle: 'none',
        })}>
        {filteredSections.map(function (section) {
            return !!section.items.length && (<cmdk_1.Command.Group key={section.key} heading={section.heading} className={(0, css_1.css)({
                    padding: '0 8px',
                    '& [cmdk-group-heading]': {
                        padding: '8px 8px 4px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: 'var(--color-pageTextSubdued)',
                        textTransform: 'uppercase',
                    },
                })}>
                {section.items.map(function (_a) {
                    var id = _a.id, name = _a.name, Icon = _a.Icon, content = _a.content;
                    return (<cmdk_1.Command.Item key={id} onSelect={function () { return section.onSelect({ id: id }); }} value={name} className={(0, css_1.css)({
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            borderRadius: '4px',
                            margin: '0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            // Avoid showing mouse hover styles when using keyboard navigation
                            '[data-cmdk-list]:not([data-cmdk-list-nav-active]) &:hover': {
                                backgroundColor: 'var(--color-menuItemBackgroundHover)',
                                color: 'var(--color-menuItemTextHover)',
                            },
                            // eslint-disable-next-line actual/typography
                            "&[data-selected='true']": {
                                backgroundColor: 'var(--color-menuItemBackgroundHover)',
                                color: 'var(--color-menuItemTextHover)',
                            },
                        })}>
                    <Icon width={16} height={16}/>
                    {content || name}
                  </cmdk_1.Command.Item>);
                })}
              </cmdk_1.Command.Group>);
        })}

        {!hasResults && (<cmdk_1.Command.Empty className={(0, css_1.css)({
                padding: '16px',
                textAlign: 'center',
                fontSize: '0.9rem',
                color: 'var(--color-pageTextSubdued)',
            })}>
            <react_i18next_1.Trans>No results found</react_i18next_1.Trans>
          </cmdk_1.Command.Empty>)}
      </cmdk_1.Command.List>
    </cmdk_1.Command.Dialog>);
}
