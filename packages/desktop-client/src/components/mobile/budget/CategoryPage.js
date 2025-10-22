"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryPage = CategoryPage;
var react_1 = require("react");
var react_i18next_1 = require("react-i18next");
var react_router_1 = require("react-router");
var text_one_line_1 = require("@actual-app/components/text-one-line");
var view_1 = require("@actual-app/components/view");
var monthUtils = require("loot-core/shared/months");
var CategoryTransactions_1 = require("./CategoryTransactions");
var UncategorizedTransactions_1 = require("./UncategorizedTransactions");
var MobileBackButton_1 = require("@desktop-client/components/mobile/MobileBackButton");
var AddTransactionButton_1 = require("@desktop-client/components/mobile/transactions/AddTransactionButton");
var Page_1 = require("@desktop-client/components/Page");
var useCategories_1 = require("@desktop-client/hooks/useCategories");
var useLocale_1 = require("@desktop-client/hooks/useLocale");
var useSyncedPref_1 = require("@desktop-client/hooks/useSyncedPref");
function CategoryPage() {
    var locale = (0, useLocale_1.useLocale)();
    var _numberFormat = (0, useSyncedPref_1.useSyncedPref)('numberFormat')[0];
    var numberFormat = _numberFormat || 'comma-dot';
    var hideFraction = (0, useSyncedPref_1.useSyncedPref)('hideFraction')[0];
    var categoryIdParam = (0, react_router_1.useParams)().id;
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var month = searchParams.get('month') || monthUtils.currentMonth();
    var categories = (0, useCategories_1.useCategories)().list;
    var category = categories.find(function (c) { return c.id === categoryIdParam; });
    return (<Page_1.Page header={<Page_1.MobilePageHeader title={category ? (<view_1.View>
                <text_one_line_1.TextOneLine>{category.name}</text_one_line_1.TextOneLine>
                <text_one_line_1.TextOneLine>
                  ({monthUtils.format(month, 'MMMM ‘yy', locale)})
                </text_one_line_1.TextOneLine>
              </view_1.View>) : (<text_one_line_1.TextOneLine>
                <react_i18next_1.Trans>Uncategorized</react_i18next_1.Trans>
              </text_one_line_1.TextOneLine>)} leftContent={<MobileBackButton_1.MobileBackButton />} rightContent={<AddTransactionButton_1.AddTransactionButton categoryId={category === null || category === void 0 ? void 0 : category.id}/>}/>} padding={0}>
      {/* This key forces the whole table rerender when the number format changes */}
      <react_1.Fragment key={numberFormat + hideFraction}>
        {category ? (<CategoryTransactions_1.CategoryTransactions category={category} month={month}/>) : (<UncategorizedTransactions_1.UncategorizedTransactions />)}
      </react_1.Fragment>
    </Page_1.Page>);
}
