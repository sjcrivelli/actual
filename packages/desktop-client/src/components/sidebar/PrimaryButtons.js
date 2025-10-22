"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrimaryButtons = PrimaryButtons;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var v1_1 = require("@actual-app/components/icons/v1");
var v2_1 = require("@actual-app/components/icons/v2");
var view_1 = require("@actual-app/components/view");
var Item_1 = require("./Item");
var SecondaryItem_1 = require("./SecondaryItem");
var useSyncServerStatus_1 = require("@desktop-client/hooks/useSyncServerStatus");
function PrimaryButtons() {
    var t = (0, react_i18next_1.useTranslation)().t;
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setOpen = _a[1];
    var onToggle = (0, react_1.useCallback)(function () { return setOpen(function (open) { return !open; }); }, []);
    var location = (0, react_router_1.useLocation)();
    var syncServerStatus = (0, useSyncServerStatus_1.useSyncServerStatus)();
    var isUsingServer = syncServerStatus !== 'no-server';
    var isActive = [
        '/payees',
        '/rules',
        '/bank-sync',
        '/settings',
        '/tools',
    ].some(function (route) { return location.pathname.startsWith(route); });
    (0, react_1.useEffect)(function () {
        if (isActive) {
            setOpen(true);
        }
    }, [isActive, location.pathname]);
    return (<view_1.View style={{ flexShrink: 0 }}>
      <Item_1.Item title={t('Budget')} Icon={v1_1.SvgWallet} to="/budget"/>
      <Item_1.Item title={t('Reports')} Icon={v1_1.SvgReports} to="/reports"/>
      <Item_1.Item title={t('Schedules')} Icon={v2_1.SvgCalendar3} to="/schedules"/>
      <Item_1.Item title={t('More')} Icon={isOpen ? v1_1.SvgCheveronDown : v1_1.SvgCheveronRight} onClick={onToggle} style={{ marginBottom: isOpen ? 8 : 0 }} forceActive={!isOpen && isActive}/>
      {isOpen && (<>
          <SecondaryItem_1.SecondaryItem title={t('Payees')} Icon={v1_1.SvgStoreFront} to="/payees" indent={15}/>
          <SecondaryItem_1.SecondaryItem title={t('Rules')} Icon={v1_1.SvgTuning} to="/rules" indent={15}/>
          {isUsingServer && (<SecondaryItem_1.SecondaryItem title={t('Bank Sync')} Icon={v1_1.SvgCreditCard} to="/bank-sync" indent={15}/>)}
          <SecondaryItem_1.SecondaryItem title={t('Tags')} Icon={v1_1.SvgTag} to="/tags" indent={15}/>
          <SecondaryItem_1.SecondaryItem title={t('Settings')} Icon={v1_1.SvgCog} to="/settings" indent={15}/>
        </>)}
    </view_1.View>);
}
