packages/desktop-client/src/components/accounts/Balance.js-52-        <text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/accounts/Balance.js-53-          {!isExactBalance && '~ '}
packages/desktop-client/src/components/accounts/Balance.js:54:          {format(balance, 'financial')}
packages/desktop-client/src/components/accounts/Balance.js-55-        </text_1.Text>
packages/desktop-client/src/components/accounts/Balance.js-56-      </PrivacyFilter_1.PrivacyFilter>
--
packages/desktop-client/src/components/accounts/Balance.tsx-50-        <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/accounts/Balance.tsx-51-          {!isExactBalance && '~ '}
packages/desktop-client/src/components/accounts/Balance.tsx:52:          {format(balance, 'financial')}
packages/desktop-client/src/components/accounts/Balance.tsx-53-        </Text>
packages/desktop-client/src/components/accounts/Balance.tsx-54-      </PrivacyFilter>
--
packages/desktop-client/src/components/accounts/Reconcile.js-45-    var format = (0, useFormat_1.useFormat)();
packages/desktop-client/src/components/accounts/Reconcile.js-46-    var targetDiff = targetBalance - cleared;
packages/desktop-client/src/components/accounts/Reconcile.js:47:    var clearedBalance = format(cleared, 'financial');
packages/desktop-client/src/components/accounts/Reconcile.js:48:    var bankBalance = format(targetBalance, 'financial');
packages/desktop-client/src/components/accounts/Reconcile.js:49:    var difference = (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');
packages/desktop-client/src/components/accounts/Reconcile.js-50-    return (<view_1.View style={__assign(__assign({ flexDirection: 'row', alignSelf: 'center', backgroundColor: theme_1.theme.tableBackground }, styles_1.styles.shadow), { borderRadius: 4, marginTop: 5, marginBottom: 15, padding: 10 })}>
packages/desktop-client/src/components/accounts/Reconcile.js-51-      <view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
--
packages/desktop-client/src/components/accounts/Reconcile.js-109-    (0, react_1.useEffect)(function () {
packages/desktop-client/src/components/accounts/Reconcile.js-110-        if (clearedBalance != null) {
packages/desktop-client/src/components/accounts/Reconcile.js:111:            setInputValue(format(clearedBalance, 'financial'));
packages/desktop-client/src/components/accounts/Reconcile.js-112-        }
packages/desktop-client/src/components/accounts/Reconcile.js-113-    }, [clearedBalance, format]);
--
packages/desktop-client/src/components/accounts/Reconcile.js-138-            <text_1.Text>
packages/desktop-client/src/components/accounts/Reconcile.js-139-              <react_i18next_1.Trans>Last Balance from Bank: </react_i18next_1.Trans>
packages/desktop-client/src/components/accounts/Reconcile.js:140:              {format(lastSyncedBalance, 'financial')}
packages/desktop-client/src/components/accounts/Reconcile.js-141-            </text_1.Text>
packages/desktop-client/src/components/accounts/Reconcile.js-142-            <button_1.Button onPress={function () {
packages/desktop-client/src/components/accounts/Reconcile.js:143:                return setInputValue(format(lastSyncedBalance, 'financial'));
packages/desktop-client/src/components/accounts/Reconcile.js-144-            }} style={{ marginBottom: 7 }}>
packages/desktop-client/src/components/accounts/Reconcile.js-145-              <react_i18next_1.Trans>Use last synced total</react_i18next_1.Trans>
--
packages/desktop-client/src/components/accounts/Reconcile.tsx-49-  const targetDiff = targetBalance - cleared;
packages/desktop-client/src/components/accounts/Reconcile.tsx-50-
packages/desktop-client/src/components/accounts/Reconcile.tsx:51:  const clearedBalance = format(cleared, 'financial');
packages/desktop-client/src/components/accounts/Reconcile.tsx:52:  const bankBalance = format(targetBalance, 'financial');
packages/desktop-client/src/components/accounts/Reconcile.tsx-53-  const difference =
packages/desktop-client/src/components/accounts/Reconcile.tsx:54:    (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');
packages/desktop-client/src/components/accounts/Reconcile.tsx-55-
packages/desktop-client/src/components/accounts/Reconcile.tsx-56-  return (
--
packages/desktop-client/src/components/accounts/Reconcile.tsx-148-  useEffect(() => {
packages/desktop-client/src/components/accounts/Reconcile.tsx-149-    if (clearedBalance != null) {
packages/desktop-client/src/components/accounts/Reconcile.tsx:150:      setInputValue(format(clearedBalance, 'financial'));
packages/desktop-client/src/components/accounts/Reconcile.tsx-151-    }
packages/desktop-client/src/components/accounts/Reconcile.tsx-152-  }, [clearedBalance, format]);
--
packages/desktop-client/src/components/accounts/Reconcile.tsx-192-            <Text>
packages/desktop-client/src/components/accounts/Reconcile.tsx-193-              <Trans>Last Balance from Bank: </Trans>
packages/desktop-client/src/components/accounts/Reconcile.tsx:194:              {format(lastSyncedBalance, 'financial')}
packages/desktop-client/src/components/accounts/Reconcile.tsx-195-            </Text>
packages/desktop-client/src/components/accounts/Reconcile.tsx-196-            <Button
packages/desktop-client/src/components/accounts/Reconcile.tsx-197-              onPress={() =>
packages/desktop-client/src/components/accounts/Reconcile.tsx:198:                setInputValue(format(lastSyncedBalance, 'financial'))
packages/desktop-client/src/components/accounts/Reconcile.tsx-199-              }
packages/desktop-client/src/components/accounts/Reconcile.tsx-200-              style={{ marginBottom: 7 }}
--
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-118-              <div>
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-119-                {{
packages/desktop-client/src/components/budget/BalanceWithCarryover.js:120:                amount: format(goalValue, 'financial'),
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-121-            }}
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-122-              </div>
--
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-128-                <div>
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-129-                  {{
packages/desktop-client/src/components/budget/BalanceWithCarryover.js:130:                    amount: format(budgetedValue, 'financial'),
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-131-                }}
packages/desktop-client/src/components/budget/BalanceWithCarryover.js-132-                </div>
--
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-210-                {
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-211-                  {
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx:212:                    amount: format(goalValue, 'financial'),
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-213-                  } as TransObjectLiteral
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-214-                }
--
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-223-                  {
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-224-                    {
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx:225:                      amount: format(budgetedValue, 'financial'),
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-226-                    } as TransObjectLiteral
packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-227-                  }
--
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-67-            amountStyle,
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-68-        ])}>
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js:69:              {format(num, 'financial')}
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-70-            </block_1.Block>
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-71-          </PrivacyFilter_1.PrivacyFilter>
--
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-96-              ])}
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-97-            >
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx:98:              {format(num, 'financial')}
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-99-            </Block>
packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-100-          </PrivacyFilter>
--
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-45-      <tooltip_1.Tooltip style={__assign(__assign({}, styles_1.styles.tooltip), { fontSize: 14, padding: 10 })} content={<>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-46-            <aligned_text_1.AlignedText left={t('Projected savings:')} right={<text_1.Text style={__assign(__assign({}, (0, util_1.makeAmountFullStyle)(budgetedSaved)), styles_1.styles.tnum)}>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js:47:                  {format(budgetedSaved, 'financial-with-sign')}
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-48-                </text_1.Text>}/>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-49-            <aligned_text_1.AlignedText left={t('Difference:')} right={<text_1.Text style={__assign(__assign({}, (0, util_1.makeAmountFullStyle)(diff)), styles_1.styles.tnum)}>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js:50:                  {format(diff, 'financial-with-sign')}
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-51-                </text_1.Text>}/>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-52-          </>} placement="bottom" triggerProps={{
--
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-61-                    : theme_1.theme.upcomingText,
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-62-        })}>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js:63:          <PrivacyFilter_1.PrivacyFilter>{format(saved, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-64-        </view_1.View>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-65-      </tooltip_1.Tooltip>
--
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-55-                  }}
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-56-                >
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx:57:                  {format(budgetedSaved, 'financial-with-sign')}
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-58-                </Text>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-59-              }
--
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-63-              right={
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-64-                <Text style={{ ...makeAmountFullStyle(diff), ...styles.tnum }}>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx:65:                  {format(diff, 'financial-with-sign')}
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-66-                </Text>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-67-              }
--
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-84-          })}
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-85-        >
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx:86:          <PrivacyFilter>{format(saved, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-87-        </View>
packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-88-      </Tooltip>
--
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-623-          <react_i18next_1.Trans count={transactions.length}>
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-624-            You have {{ count: transactions.length }} uncategorized transactions
packages/desktop-client/src/components/mobile/budget/BudgetPage.js:625:            ({{ amount: format(totalUncategorizedAmount, 'financial') }})
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-626-          </react_i18next_1.Trans>
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-627-          <button_1.Button onPress={function () { return navigate('/categories/uncategorized'); }} style={BudgetTable_1.PILL_STYLE}>
--
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-789-              <react_i18next_1.Trans count={numberOfOverspentCategories}>
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-790-                You have {{ count: numberOfOverspentCategories }} overspent
packages/desktop-client/src/components/mobile/budget/BudgetPage.js:791:                categories ({{ amount: format(totalOverspending, 'financial') }}
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-792-                )
packages/desktop-client/src/components/mobile/budget/BudgetPage.js-793-              </react_i18next_1.Trans>
--
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-714-          <Trans count={transactions.length}>
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-715-            You have {{ count: transactions.length }} uncategorized transactions
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx:716:            ({{ amount: format(totalUncategorizedAmount, 'financial') }})
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-717-          </Trans>
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-718-          <Button
--
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-933-              <Trans count={numberOfOverspentCategories}>
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-934-                You have {{ count: numberOfOverspentCategories }} overspent
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx:935:                categories ({{ amount: format(totalOverspending, 'financial') }}
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-936-                )
packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-937-              </Trans>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-1-packages/desktop-client/src/components/accounts/Balance.js-52-        <text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-2-packages/desktop-client/src/components/accounts/Balance.js-53-          {!isExactBalance && '~ '}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:3:packages/desktop-client/src/components/accounts/Balance.js:54:          {format(balance, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-4-packages/desktop-client/src/components/accounts/Balance.js-55-        </text_1.Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-5-packages/desktop-client/src/components/accounts/Balance.js-56-      </PrivacyFilter_1.PrivacyFilter>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-7-packages/desktop-client/src/components/accounts/Balance.tsx-50-        <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-8-packages/desktop-client/src/components/accounts/Balance.tsx-51-          {!isExactBalance && '~ '}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:9:packages/desktop-client/src/components/accounts/Balance.tsx:52:          {format(balance, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-10-packages/desktop-client/src/components/accounts/Balance.tsx-53-        </Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-11-packages/desktop-client/src/components/accounts/Balance.tsx-54-      </PrivacyFilter>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-13-packages/desktop-client/src/components/accounts/Reconcile.js-45-    var format = (0, useFormat_1.useFormat)();
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-14-packages/desktop-client/src/components/accounts/Reconcile.js-46-    var targetDiff = targetBalance - cleared;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:15:packages/desktop-client/src/components/accounts/Reconcile.js:47:    var clearedBalance = format(cleared, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:16:packages/desktop-client/src/components/accounts/Reconcile.js:48:    var bankBalance = format(targetBalance, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:17:packages/desktop-client/src/components/accounts/Reconcile.js:49:    var difference = (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-18-packages/desktop-client/src/components/accounts/Reconcile.js-50-    return (<view_1.View style={__assign(__assign({ flexDirection: 'row', alignSelf: 'center', backgroundColor: theme_1.theme.tableBackground }, styles_1.styles.shadow), { borderRadius: 4, marginTop: 5, marginBottom: 15, padding: 10 })}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-19-packages/desktop-client/src/components/accounts/Reconcile.js-51-      <view_1.View style={{ flexDirection: 'row', alignItems: 'center' }}>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-21-packages/desktop-client/src/components/accounts/Reconcile.js-109-    (0, react_1.useEffect)(function () {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-22-packages/desktop-client/src/components/accounts/Reconcile.js-110-        if (clearedBalance != null) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:23:packages/desktop-client/src/components/accounts/Reconcile.js:111:            setInputValue(format(clearedBalance, 'financial'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-24-packages/desktop-client/src/components/accounts/Reconcile.js-112-        }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-25-packages/desktop-client/src/components/accounts/Reconcile.js-113-    }, [clearedBalance, format]);
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-27-packages/desktop-client/src/components/accounts/Reconcile.js-138-            <text_1.Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-28-packages/desktop-client/src/components/accounts/Reconcile.js-139-              <react_i18next_1.Trans>Last Balance from Bank: </react_i18next_1.Trans>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:29:packages/desktop-client/src/components/accounts/Reconcile.js:140:              {format(lastSyncedBalance, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-30-packages/desktop-client/src/components/accounts/Reconcile.js-141-            </text_1.Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-31-packages/desktop-client/src/components/accounts/Reconcile.js-142-            <button_1.Button onPress={function () {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:32:packages/desktop-client/src/components/accounts/Reconcile.js:143:                return setInputValue(format(lastSyncedBalance, 'financial'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-33-packages/desktop-client/src/components/accounts/Reconcile.js-144-            }} style={{ marginBottom: 7 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-34-packages/desktop-client/src/components/accounts/Reconcile.js-145-              <react_i18next_1.Trans>Use last synced total</react_i18next_1.Trans>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-36-packages/desktop-client/src/components/accounts/Reconcile.tsx-49-  const targetDiff = targetBalance - cleared;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-37-packages/desktop-client/src/components/accounts/Reconcile.tsx-50-
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:38:packages/desktop-client/src/components/accounts/Reconcile.tsx:51:  const clearedBalance = format(cleared, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:39:packages/desktop-client/src/components/accounts/Reconcile.tsx:52:  const bankBalance = format(targetBalance, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-40-packages/desktop-client/src/components/accounts/Reconcile.tsx-53-  const difference =
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:41:packages/desktop-client/src/components/accounts/Reconcile.tsx:54:    (targetDiff > 0 ? '+' : '') + format(targetDiff, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-42-packages/desktop-client/src/components/accounts/Reconcile.tsx-55-
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-43-packages/desktop-client/src/components/accounts/Reconcile.tsx-56-  return (
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-45-packages/desktop-client/src/components/accounts/Reconcile.tsx-148-  useEffect(() => {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-46-packages/desktop-client/src/components/accounts/Reconcile.tsx-149-    if (clearedBalance != null) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:47:packages/desktop-client/src/components/accounts/Reconcile.tsx:150:      setInputValue(format(clearedBalance, 'financial'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-48-packages/desktop-client/src/components/accounts/Reconcile.tsx-151-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-49-packages/desktop-client/src/components/accounts/Reconcile.tsx-152-  }, [clearedBalance, format]);
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-51-packages/desktop-client/src/components/accounts/Reconcile.tsx-192-            <Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-52-packages/desktop-client/src/components/accounts/Reconcile.tsx-193-              <Trans>Last Balance from Bank: </Trans>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:53:packages/desktop-client/src/components/accounts/Reconcile.tsx:194:              {format(lastSyncedBalance, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-54-packages/desktop-client/src/components/accounts/Reconcile.tsx-195-            </Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-55-packages/desktop-client/src/components/accounts/Reconcile.tsx-196-            <Button
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-56-packages/desktop-client/src/components/accounts/Reconcile.tsx-197-              onPress={() =>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:57:packages/desktop-client/src/components/accounts/Reconcile.tsx:198:                setInputValue(format(lastSyncedBalance, 'financial'))
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-58-packages/desktop-client/src/components/accounts/Reconcile.tsx-199-              }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-59-packages/desktop-client/src/components/accounts/Reconcile.tsx-200-              style={{ marginBottom: 7 }}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-61-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-118-              <div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-62-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-119-                {{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:63:packages/desktop-client/src/components/budget/BalanceWithCarryover.js:120:                amount: format(goalValue, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-64-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-121-            }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-65-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-122-              </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-67-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-128-                <div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-68-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-129-                  {{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:69:packages/desktop-client/src/components/budget/BalanceWithCarryover.js:130:                    amount: format(budgetedValue, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-70-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-131-                }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-71-packages/desktop-client/src/components/budget/BalanceWithCarryover.js-132-                </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-73-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-210-                {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-74-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-211-                  {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:75:packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx:212:                    amount: format(goalValue, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-76-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-213-                  } as TransObjectLiteral
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-77-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-214-                }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-79-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-223-                  {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-80-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-224-                    {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:81:packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx:225:                      amount: format(budgetedValue, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-82-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-226-                    } as TransObjectLiteral
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-83-packages/desktop-client/src/components/budget/BalanceWithCarryover.tsx-227-                  }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-85-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-67-            amountStyle,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-86-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-68-        ])}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:87:packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js:69:              {format(num, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-88-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-70-            </block_1.Block>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-89-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.js-71-          </PrivacyFilter_1.PrivacyFilter>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-91-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-96-              ])}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-92-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-97-            >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:93:packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx:98:              {format(num, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-94-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-99-            </Block>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-95-packages/desktop-client/src/components/budget/envelope/budgetsummary/ToBudgetAmount.tsx-100-          </PrivacyFilter>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-97-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-45-      <tooltip_1.Tooltip style={__assign(__assign({}, styles_1.styles.tooltip), { fontSize: 14, padding: 10 })} content={<>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-98-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-46-            <aligned_text_1.AlignedText left={t('Projected savings:')} right={<text_1.Text style={__assign(__assign({}, (0, util_1.makeAmountFullStyle)(budgetedSaved)), styles_1.styles.tnum)}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:99:packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js:47:                  {format(budgetedSaved, 'financial-with-sign')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-100-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-48-                </text_1.Text>}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-101-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-49-            <aligned_text_1.AlignedText left={t('Difference:')} right={<text_1.Text style={__assign(__assign({}, (0, util_1.makeAmountFullStyle)(diff)), styles_1.styles.tnum)}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:102:packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js:50:                  {format(diff, 'financial-with-sign')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-103-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-51-                </text_1.Text>}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-104-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-52-          </>} placement="bottom" triggerProps={{
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-106-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-61-                    : theme_1.theme.upcomingText,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-107-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-62-        })}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:108:packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js:63:          <PrivacyFilter_1.PrivacyFilter>{format(saved, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-109-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-64-        </view_1.View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-110-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.js-65-      </tooltip_1.Tooltip>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-112-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-55-                  }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-113-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-56-                >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:114:packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx:57:                  {format(budgetedSaved, 'financial-with-sign')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-115-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-58-                </Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-116-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-59-              }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-118-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-63-              right={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-119-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-64-                <Text style={{ ...makeAmountFullStyle(diff), ...styles.tnum }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:120:packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx:65:                  {format(diff, 'financial-with-sign')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-121-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-66-                </Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-122-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-67-              }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-124-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-84-          })}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-125-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-85-        >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:126:packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx:86:          <PrivacyFilter>{format(saved, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-127-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-87-        </View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-128-packages/desktop-client/src/components/budget/tracking/budgetsummary/Saved.tsx-88-      </Tooltip>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-130-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-623-          <react_i18next_1.Trans count={transactions.length}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-131-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-624-            You have {{ count: transactions.length }} uncategorized transactions
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:132:packages/desktop-client/src/components/mobile/budget/BudgetPage.js:625:            ({{ amount: format(totalUncategorizedAmount, 'financial') }})
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-133-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-626-          </react_i18next_1.Trans>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-134-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-627-          <button_1.Button onPress={function () { return navigate('/categories/uncategorized'); }} style={BudgetTable_1.PILL_STYLE}>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-136-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-789-              <react_i18next_1.Trans count={numberOfOverspentCategories}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-137-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-790-                You have {{ count: numberOfOverspentCategories }} overspent
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:138:packages/desktop-client/src/components/mobile/budget/BudgetPage.js:791:                categories ({{ amount: format(totalOverspending, 'financial') }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-139-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-792-                )
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-140-packages/desktop-client/src/components/mobile/budget/BudgetPage.js-793-              </react_i18next_1.Trans>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-142-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-714-          <Trans count={transactions.length}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-143-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-715-            You have {{ count: transactions.length }} uncategorized transactions
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:144:packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx:716:            ({{ amount: format(totalUncategorizedAmount, 'financial') }})
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-145-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-717-          </Trans>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-146-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-718-          <Button
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-148-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-933-              <Trans count={numberOfOverspentCategories}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-149-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-934-                You have {{ count: numberOfOverspentCategories }} overspent
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:150:packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx:935:                categories ({{ amount: format(totalOverspending, 'financial') }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-151-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-936-                )
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-152-packages/desktop-client/src/components/mobile/budget/BudgetPage.tsx-937-              </Trans>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-154-packages/desktop-client/src/components/reports/Change.js-23-    return (<block_1.Block style={__assign(__assign(__assign({}, styles_1.styles.smallText), { color: amount < 0 ? theme_1.theme.errorText : theme_1.theme.noticeTextLight }), style)}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-155-packages/desktop-client/src/components/reports/Change.js-24-      {amount >= 0 ? '+' : ''}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:156:packages/desktop-client/src/components/reports/Change.js:25:      {format(amount, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-157-packages/desktop-client/src/components/reports/Change.js-26-    </block_1.Block>);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-158-packages/desktop-client/src/components/reports/Change.js-27-}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-160-packages/desktop-client/src/components/reports/Change.tsx-25-    >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-161-packages/desktop-client/src/components/reports/Change.tsx-26-      {amount >= 0 ? '+' : ''}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:162:packages/desktop-client/src/components/reports/Change.tsx:27:      {format(amount, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-163-packages/desktop-client/src/components/reports/Change.tsx-28-    </Block>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-164-packages/desktop-client/src/components/reports/Change.tsx-29-  );
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-166-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-42-          </div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-167-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-43-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:168:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:44:            {['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Assets:')} right={format(payload[0].payload.totalAssets, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:169:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:45:            {['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Debts:')} right={format(payload[0].payload.totalDebts, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:170:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:46:            {['netAssets'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Assets:')} right={format(payload[0].payload.netAssets, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:171:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:47:            {['netDebts'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Debts:')} right={format(payload[0].payload.netDebts, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-172-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-48-            {['totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net:')} right={<strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:173:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:49:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-174-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-50-                  </strong>}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-175-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-51-          </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-177-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-64-    var textAnchor = props.index === 0 ? 'start' : 'middle';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-178-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-65-    var display = typeof props.value !== 'string' && props.value !== 0
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:179:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:66:        ? "".concat(format(props.value || 0, 'financial-no-decimals'))
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-180-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-67-        : '';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-181-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-68-    var textSize = (0, adjustTextSize_1.adjustTextSize)({ sized: width, type: 'area' });
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-183-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-93-    var tickFormatter = function (tick) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-184-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-94-        if (!privacyMode)
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:185:packages/desktop-client/src/components/reports/graphs/AreaGraph.js:95:            return "".concat(format(tick, 'financial-no-decimals')); // Formats the tick values as strings with commas
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-186-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-96-        return '...';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-187-packages/desktop-client/src/components/reports/graphs/AreaGraph.js-97-    };
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-189-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-75-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-190-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-76-                left={t('Assets:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:191:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:77:                right={format(payload[0].payload.totalAssets, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-192-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-78-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-193-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-79-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-195-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-81-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-196-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-82-                left={t('Debts:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:197:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:83:                right={format(payload[0].payload.totalDebts, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-198-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-84-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-199-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-85-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-201-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-87-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-202-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-88-                left={t('Net Assets:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:203:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:89:                right={format(payload[0].payload.netAssets, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-204-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-90-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-205-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-91-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-207-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-93-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-208-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-94-                left={t('Net Debts:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:209:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:95:                right={format(payload[0].payload.netDebts, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-210-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-96-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-211-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-97-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-213-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-101-                right={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-214-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-102-                  <strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:215:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:103:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-216-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-104-                  </strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-217-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-105-                }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-219-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-145-  const display =
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-220-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-146-    typeof props.value !== 'string' && props.value !== 0
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:221:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:147:      ? `${format(props.value || 0, 'financial-no-decimals')}`
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-222-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-148-      : '';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-223-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-149-  const textSize = adjustTextSize({ sized: width, type: 'area' });
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-225-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-194-
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-226-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-195-  const tickFormatter = (tick: number) => {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:227:packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:196:    if (!privacyMode) return `${format(tick, 'financial-no-decimals')}`; // Formats the tick values as strings with commas
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-228-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-197-    return '...';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-229-packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-198-  };
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-231-packages/desktop-client/src/components/reports/graphs/BarGraph.js-49-          </div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-232-packages/desktop-client/src/components/reports/graphs/BarGraph.js-50-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:233:packages/desktop-client/src/components/reports/graphs/BarGraph.js:51:            {['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Assets:')} right={format(payload[0].payload.totalAssets, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:234:packages/desktop-client/src/components/reports/graphs/BarGraph.js:52:            {['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Debts:')} right={format(payload[0].payload.totalDebts, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:235:packages/desktop-client/src/components/reports/graphs/BarGraph.js:53:            {['netAssets'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Assets:')} right={format(payload[0].payload.netAssets, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:236:packages/desktop-client/src/components/reports/graphs/BarGraph.js:54:            {['netDebts'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Debts:')} right={format(payload[0].payload.netDebts, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-237-packages/desktop-client/src/components/reports/graphs/BarGraph.js-55-            {['totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net:')} right={<strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:238:packages/desktop-client/src/components/reports/graphs/BarGraph.js:56:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-239-packages/desktop-client/src/components/reports/graphs/BarGraph.js-57-                  </strong>}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-240-packages/desktop-client/src/components/reports/graphs/BarGraph.js-58-          </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-242-packages/desktop-client/src/components/reports/graphs/BarGraph.js-65-    var calcY = props.y - (props.value > 0 ? 15 : -15);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-243-packages/desktop-client/src/components/reports/graphs/BarGraph.js-66-    var textAnchor = 'middle';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:244:packages/desktop-client/src/components/reports/graphs/BarGraph.js:67:    var display = props.value !== 0 && "".concat(format(props.value, 'financial-no-decimals'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-245-packages/desktop-client/src/components/reports/graphs/BarGraph.js-68-    var textSize = (0, adjustTextSize_1.adjustTextSize)({
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-246-packages/desktop-client/src/components/reports/graphs/BarGraph.js-69-        sized: props.width,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-248-packages/desktop-client/src/components/reports/graphs/BarGraph.js-112-                {!compact && (<recharts_1.XAxis dataKey={yAxis} angle={-35} textAnchor="end" height={Math.sqrt(longestLabelLength) * 25} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-249-packages/desktop-client/src/components/reports/graphs/BarGraph.js-113-                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:250:packages/desktop-client/src/components/reports/graphs/BarGraph.js:114:                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-251-packages/desktop-client/src/components/reports/graphs/BarGraph.js-115-                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-252-packages/desktop-client/src/components/reports/graphs/BarGraph.js-116-                {!compact && (<recharts_1.ReferenceLine y={0} stroke={theme_1.theme.pageTextLight}/>)}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-254-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-97-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-255-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-98-                left={t('Assets:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:256:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:99:                right={format(payload[0].payload.totalAssets, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-257-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-100-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-258-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-101-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-260-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-103-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-261-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-104-                left={t('Debts:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:262:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:105:                right={format(payload[0].payload.totalDebts, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-263-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-106-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-264-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-107-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-266-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-109-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-267-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-110-                left={t('Net Assets:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:268:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:111:                right={format(payload[0].payload.netAssets, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-269-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-112-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-270-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-113-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-272-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-115-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-273-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-116-                left={t('Net Debts:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:274:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:117:                right={format(payload[0].payload.netDebts, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-275-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-118-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-276-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-119-            )}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-278-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-123-                right={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-279-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-124-                  <strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:280:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:125:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-281-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-126-                  </strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-282-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-127-                }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-284-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-140-  const textAnchor = 'middle';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-285-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-141-  const display =
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:286:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:142:    props.value !== 0 && `${format(props.value, 'financial-no-decimals')}`;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-287-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-143-  const textSize = adjustTextSize({
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-288-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-144-    sized: props.width,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-290-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-259-                    tickFormatter={value =>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-291-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-260-                      getCustomTick(
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:292:packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:261:                        format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-293-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-262-                        privacyMode,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-294-packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-263-                      )
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-296-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-98-                    }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-297-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-99-                        {day.incomeValue !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:298:packages/desktop-client/src/components/reports/graphs/CalendarGraph.js:100:                            {format(day.incomeValue, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-299-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-101-                          </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-300-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-102-                      </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-302-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-119-                    }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-303-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-120-                        {day.expenseValue !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:304:packages/desktop-client/src/components/reports/graphs/CalendarGraph.js:121:                            {format(day.expenseValue, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-305-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-122-                          </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-306-packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-123-                      </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-308-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-144-                        {day.incomeValue !== 0 ? (
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-309-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-145-                          <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:310:packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx:146:                            {format(day.incomeValue, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-311-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-147-                          </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-312-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-148-                        ) : (
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-314-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-173-                        {day.expenseValue !== 0 ? (
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-315-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-174-                          <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:316:packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx:175:                            {format(day.expenseValue, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-317-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-176-                          </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-318-packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-177-                        ) : (
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-320-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-41-        </div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-321-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-42-        <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:322:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:43:          <aligned_text_1.AlignedText left={t('Income:')} right={format(data.income, 'financial')}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:323:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:44:          <aligned_text_1.AlignedText left={t('Expenses:')} right={format(data.expenses, 'financial')}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-324-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-45-          <aligned_text_1.AlignedText left={t('Change:')} right={<strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:325:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:46:                {format(data.income + data.expenses, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-326-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-47-              </strong>}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:327:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:48:          {data.transfers !== 0 && (<aligned_text_1.AlignedText left={t('Transfers:')} right={format(data.transfers, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:328:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:49:          <aligned_text_1.AlignedText left={t('Balance:')} right={format(data.balance, 'financial')}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-329-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-50-        </div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-330-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-51-      </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-332-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-78-                return privacyMode && !yAxisIsHovered
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-333-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-79-                    ? '...'
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:334:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:80:                    : format(value, 'financial-no-decimals');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-335-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-81-            }} onMouseEnter={function () { return setYAxisIsHovered(true); }} onMouseLeave={function () { return setYAxisIsHovered(false); }}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-336-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-82-            <recharts_1.Tooltip labelFormatter={function (x) {
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-338-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-81-          <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-339-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-82-            left={t('Income:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:340:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:83:            right={format(data.income, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-341-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-84-          />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-342-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-85-          <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-343-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-86-            left={t('Expenses:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:344:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:87:            right={format(data.expenses, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-345-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-88-          />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-346-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-89-          <AlignedText
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-348-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-91-            right={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-349-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-92-              <strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:350:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:93:                {format(data.income + data.expenses, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-351-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-94-              </strong>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-352-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-95-            }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-354-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-98-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-355-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-99-              left={t('Transfers:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:356:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:100:              right={format(data.transfers, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-357-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-101-            />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-358-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-102-          )}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-359-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-103-          <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-360-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-104-            left={t('Balance:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:361:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:105:            right={format(data.balance, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-362-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-106-          />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-363-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-107-        </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-365-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-169-                privacyMode && !yAxisIsHovered
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-366-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-170-                  ? '...'
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:367:packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:171:                  : format(value, 'financial-no-decimals')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-368-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-172-              }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-369-packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-173-              onMouseEnter={() => setYAxisIsHovered(true)}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-371-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-41-      <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-372-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-42-        <text x={cx + outerRadius * Math.cos(-RADIAN * 240) - 30} y={ey} dy={0} textAnchor="end" fill={fill}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:373:packages/desktop-client/src/components/reports/graphs/DonutGraph.js:43:          {"".concat(format(value, 'financial'))}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-374-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-44-        </text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-375-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-45-        <text x={cx + outerRadius * Math.cos(-RADIAN * 330) + 10} y={ey} dy={0} textAnchor="start" fill="#999">
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-377-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-72-      <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} textAnchor={textAnchor} fill={fill}>{"".concat(yAxis)}</text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-378-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-73-      <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:379:packages/desktop-client/src/components/reports/graphs/DonutGraph.js:74:        <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} dy={18} textAnchor={textAnchor} fill={fill}>{"".concat(format(value, 'financial'))}</text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-380-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-75-        <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} dy={36} textAnchor={textAnchor} fill="#999">
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-381-packages/desktop-client/src/components/reports/graphs/DonutGraph.js-76-          {"(".concat((percent * 100).toFixed(2), "%)")}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-383-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-74-          fill={fill}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-384-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-75-        >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:385:packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx:76:          {`${format(value, 'financial')}`}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-386-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-77-        </text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-387-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-78-        <text
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-389-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-177-          textAnchor={textAnchor}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-390-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-178-          fill={fill}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:391:packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx:179:        >{`${format(value, 'financial')}`}</text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-392-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-180-        <text
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-393-packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-181-          x={ex + (cos <= 0 ? 1 : -1) * 16}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-395-packages/desktop-client/src/components/reports/graphs/LineGraph.js-60-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-396-packages/desktop-client/src/components/reports/graphs/LineGraph.js-61-            {items.map(function (p, index) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:397:packages/desktop-client/src/components/reports/graphs/LineGraph.js:62:                return ((compact ? index < 4 : true) && (<aligned_text_1.AlignedText key={index} left={p.dataKey} right={format(p.value, 'financial')} style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-398-packages/desktop-client/src/components/reports/graphs/LineGraph.js-63-                        color: p.color,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-399-packages/desktop-client/src/components/reports/graphs/LineGraph.js-64-                        textDecoration: tooltip === p.dataKey ? 'underline' : 'inherit',
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-401-packages/desktop-client/src/components/reports/graphs/LineGraph.js-66-            })}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-402-packages/desktop-client/src/components/reports/graphs/LineGraph.js-67-            {payload.length > 5 && compact && '...'}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:403:packages/desktop-client/src/components/reports/graphs/LineGraph.js:68:            <aligned_text_1.AlignedText left={t('Total')} right={format(sumTotals, 'financial')} style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-404-packages/desktop-client/src/components/reports/graphs/LineGraph.js-69-                fontWeight: 600,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-405-packages/desktop-client/src/components/reports/graphs/LineGraph.js-70-            }}/>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-407-packages/desktop-client/src/components/reports/graphs/LineGraph.js-114-                {!compact && (<recharts_1.XAxis dataKey="date" tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-408-packages/desktop-client/src/components/reports/graphs/LineGraph.js-115-                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:409:packages/desktop-client/src/components/reports/graphs/LineGraph.js:116:                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-410-packages/desktop-client/src/components/reports/graphs/LineGraph.js-117-                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-411-packages/desktop-client/src/components/reports/graphs/LineGraph.js-118-                {data.legend.map(function (entry, index) {
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-413-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-99-                    key={index}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-414-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-100-                    left={p.dataKey}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:415:packages/desktop-client/src/components/reports/graphs/LineGraph.tsx:101:                    right={format(p.value, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-416-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-102-                    style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-417-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-103-                      color: p.color,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-419-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-112-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-420-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-113-              left={t('Total')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:421:packages/desktop-client/src/components/reports/graphs/LineGraph.tsx:114:              right={format(sumTotals, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-422-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-115-              style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-423-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-116-                fontWeight: 600,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-425-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-226-                    tickFormatter={value =>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-426-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-227-                      getCustomTick(
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:427:packages/desktop-client/src/components/reports/graphs/LineGraph.tsx:228:                        format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-428-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-229-                        privacyMode,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-429-packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-230-                      )
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-431-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-104-                    left: compact
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-432-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-105-                        ? 0
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:433:packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js:106:                        : (0, computePadding_1.computePadding)(graphData.data.map(function (item) { return item.y; }), function (value) { return format(value, 'financial-no-decimals'); }),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-434-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-107-                    bottom: 0,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-435-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-108-                }}>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-437-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-180-                    : computePadding(
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-438-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-181-                        graphData.data.map(item => item.y),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:439:packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx:182:                        value => format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-440-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-183-                      ),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-441-packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-184-                  bottom: 0,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-443-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-96-    var tickFormatter = function (tick) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-444-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-97-        if (!privacyMode)
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:445:packages/desktop-client/src/components/reports/graphs/SpendingGraph.js:98:            return "".concat(format(tick, 'financial-no-decimals'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-446-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-99-        return '...';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-447-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-100-    };
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-449-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-131-                    left: (0, computePadding_1.computePadding)(data.intervalData
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-450-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-132-                        .map(function (item) { return getVal(item, maxYAxis ? compare : selection); })
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:451:packages/desktop-client/src/components/reports/graphs/SpendingGraph.js:133:                        .filter(function (value) { return value !== undefined; }), function (value) { return format(value, 'financial-no-decimals'); }),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-452-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-134-                    bottom: 0,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-453-packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-135-                }}>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-455-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-177-
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-456-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-178-  const tickFormatter: ComponentProps<typeof YAxis>['tickFormatter'] = tick => {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:457:packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx:179:    if (!privacyMode) return `${format(tick, 'financial-no-decimals')}`;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-458-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-180-    return '...';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-459-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-181-  };
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-461-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-230-                      .map(item => getVal(item, maxYAxis ? compare : selection))
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-462-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-231-                      .filter(value => value !== undefined),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:463:packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx:232:                    (value: number) => format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-464-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-233-                  ),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-465-packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-234-                  bottom: 0,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-467-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-63-            {items.map(function (pay, i) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-468-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-64-                return (pay.value !== 0 &&
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:469:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:65:                    (compact ? i < 5 : true) && (<aligned_text_1.AlignedText key={pay.name} left={pay.name} right={format(pay.value, 'financial')} style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-470-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-66-                        color: pay.color,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-471-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-67-                        textDecoration: tooltip === pay.name ? 'underline' : 'inherit',
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-473-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-69-            })}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-474-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-70-            {payload.length > 5 && compact && '...'}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:475:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:71:            <aligned_text_1.AlignedText left={t('Total')} right={format(sumTotals, 'financial')} style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-476-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-72-                fontWeight: 600,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-477-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-73-            }}/>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-479-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-81-    var calcY = props.y + props.height / 2;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-480-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-82-    var textAnchor = 'middle';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:481:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:83:    var display = props.value && "".concat(props.format(props.value, 'financial-no-decimals'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-482-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-84-    var textSize = '12px';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-483-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-85-    var showLabel = props.height;
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-485-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-113-                {!compact && <recharts_1.CartesianGrid strokeDasharray="3 3"/>}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-486-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-114-                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:487:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:115:                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-488-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-116-                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-489-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-117-                {data.legend
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-491-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-105-                    key={pay.name}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-492-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-106-                    left={pay.name}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:493:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:107:                    right={format(pay.value, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-494-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-108-                    style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-495-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-109-                      color: pay.color,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-497-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-118-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-498-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-119-              left={t('Total')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:499:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:120:              right={format(sumTotals, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-500-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-121-              style={{
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-501-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-122-                fontWeight: 600,
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-503-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-135-  const textAnchor = 'middle';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-504-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-136-  const display =
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:505:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:137:    props.value && `${props.format(props.value, 'financial-no-decimals')}`;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-506-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-138-  const textSize = '12px';
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-507-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-139-  const showLabel = props.height;
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-509-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-241-                    tickFormatter={value =>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-510-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-242-                      getCustomTick(
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:511:packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:243:                        format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-512-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-244-                        privacyMode,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-513-packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-245-                      )
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-515-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-68-                        var value = _a.value;
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-516-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-69-                        return (<text_1.Text style={hoverUnderline}>{value}</text_1.Text>);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:517:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:70:                    }} valueStyle={compactStyle} value={format(intervalItem[balanceTypeOp], 'financial')} title={Math.abs(intervalItem[balanceTypeOp]) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:518:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:71:                        ? format(intervalItem[balanceTypeOp], 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-519-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-72-                        : undefined} onClick={function () {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-520-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-73-                        return !isNarrowWidth &&
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-522-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-93-            })
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-523-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-94-            : balanceTypeOp === 'totalTotals' && (<>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:524:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:95:                  <table_1.Cell value={format(item.totalAssets, 'financial')} title={Math.abs(item.totalAssets) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:525:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:96:                    ? format(item.totalAssets, 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-526-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-97-                    : undefined} width="flex" privacyFilter style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-527-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-98-                    color: getAmountColor(item.totalAssets),
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-529-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-120-                        });
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-530-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-121-                }}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:531:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:122:                  <table_1.Cell value={format(item.totalDebts, 'financial')} title={Math.abs(item.totalDebts) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:532:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:123:                    ? format(item.totalDebts, 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-533-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-124-                    : undefined} width="flex" privacyFilter style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-534-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-125-                    color: getAmountColor(item.totalDebts),
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-536-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-148-                }}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-537-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-149-                </>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:538:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:150:          <table_1.Cell value={format(item[balanceTypeOp], 'financial')} title={Math.abs(item[balanceTypeOp]) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:539:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:151:            ? format(item[balanceTypeOp], 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-540-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-152-            : undefined} style={__assign({ fontWeight: 600, minWidth: compact ? 50 : 85 }, (colorized && { color: getAmountColor(item[balanceTypeOp]) }))} unexposedContent={function (_a) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-541-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-153-            var value = _a.value;
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-543-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-173-                });
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-544-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-174-        }} width="flex" privacyFilter/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:545:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:175:          <table_1.Cell value={format(average, 'financial')} title={Math.abs(average / 100) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:546:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:176:            ? format(average, 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-547-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-177-            : undefined} style={__assign({ fontWeight: 600, minWidth: compact ? 50 : 85 }, (colorized && { color: getAmountColor(average) }))} valueStyle={compactStyle} width="flex" privacyFilter/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-548-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-178-        </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-550-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-148-                    )}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-551-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-149-                    valueStyle={compactStyle}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:552:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:150:                    value={format(intervalItem[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-553-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-151-                    title={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-554-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-152-                      Math.abs(intervalItem[balanceTypeOp]) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:555:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:153:                        ? format(intervalItem[balanceTypeOp], 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-556-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-154-                        : undefined
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-557-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-155-                    }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-559-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-183-                <>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-560-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-184-                  <Cell
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:561:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:185:                    value={format(item.totalAssets, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-562-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-186-                    title={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-563-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-187-                      Math.abs(item.totalAssets) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:564:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:188:                        ? format(item.totalAssets, 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-565-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-189-                        : undefined
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-566-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-190-                    }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-568-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-223-                  />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-569-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-224-                  <Cell
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:570:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:225:                    value={format(item.totalDebts, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-571-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-226-                    title={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-572-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-227-                      Math.abs(item.totalDebts) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:573:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:228:                        ? format(item.totalDebts, 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-574-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-229-                        : undefined
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-575-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-230-                    }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-577-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-265-              )}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-578-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-266-          <Cell
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:579:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:267:            value={format(item[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-580-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-268-            title={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-581-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-269-              Math.abs(item[balanceTypeOp]) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:582:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:270:                ? format(item[balanceTypeOp], 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-583-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-271-                : undefined
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-584-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-272-            }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-586-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-304-          />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-587-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-305-          <Cell
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:588:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:306:            value={format(average, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-589-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-307-            title={
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-590-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-308-              Math.abs(average / 100) > 100000
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:591:packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:309:                ? format(average, 'financial')
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-592-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-310-                : undefined
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-593-packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-311-            }
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-595-packages/desktop-client/src/components/reports/reports/Calendar.js-586-        }} aria-label={t('Income')}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-596-packages/desktop-client/src/components/reports/reports/Calendar.js-587-            <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:597:packages/desktop-client/src/components/reports/reports/Calendar.js:588:              {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-598-packages/desktop-client/src/components/reports/reports/Calendar.js-589-            </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-599-packages/desktop-client/src/components/reports/reports/Calendar.js-590-          </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-601-packages/desktop-client/src/components/reports/reports/Calendar.js-597-        }} aria-label={t('Expenses')}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-602-packages/desktop-client/src/components/reports/reports/Calendar.js-598-            <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:603:packages/desktop-client/src/components/reports/reports/Calendar.js:599:              {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-604-packages/desktop-client/src/components/reports/reports/Calendar.js-600-            </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-605-packages/desktop-client/src/components/reports/reports/Calendar.js-601-          </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-607-packages/desktop-client/src/components/reports/reports/Calendar.js-651-            </view_1.View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-608-packages/desktop-client/src/components/reports/reports/Calendar.js-652-            <view_1.View style={{ color: chart_theme_1.chartTheme.colors.blue }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:609:packages/desktop-client/src/components/reports/reports/Calendar.js:653:              <PrivacyFilter_1.PrivacyFilter>{format(totalIncome, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-610-packages/desktop-client/src/components/reports/reports/Calendar.js-654-            </view_1.View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-611-packages/desktop-client/src/components/reports/reports/Calendar.js-655-
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-613-packages/desktop-client/src/components/reports/reports/Calendar.js-661-            </view_1.View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-614-packages/desktop-client/src/components/reports/reports/Calendar.js-662-            <view_1.View style={{ color: chart_theme_1.chartTheme.colors.red }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:615:packages/desktop-client/src/components/reports/reports/Calendar.js:663:              <PrivacyFilter_1.PrivacyFilter>{format(totalExpense, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-616-packages/desktop-client/src/components/reports/reports/Calendar.js-664-            </view_1.View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-617-packages/desktop-client/src/components/reports/reports/Calendar.js-665-          </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-619-packages/desktop-client/src/components/reports/reports/Calendar.tsx-860-          >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-620-packages/desktop-client/src/components/reports/reports/Calendar.tsx-861-            <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:621:packages/desktop-client/src/components/reports/reports/Calendar.tsx:862:              {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-622-packages/desktop-client/src/components/reports/reports/Calendar.tsx-863-            </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-623-packages/desktop-client/src/components/reports/reports/Calendar.tsx-864-          </View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-625-packages/desktop-client/src/components/reports/reports/Calendar.tsx-878-          >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-626-packages/desktop-client/src/components/reports/reports/Calendar.tsx-879-            <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:627:packages/desktop-client/src/components/reports/reports/Calendar.tsx:880:              {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-628-packages/desktop-client/src/components/reports/reports/Calendar.tsx-881-            </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-629-packages/desktop-client/src/components/reports/reports/Calendar.tsx-882-          </View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-631-packages/desktop-client/src/components/reports/reports/Calendar.tsx-971-            </View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-632-packages/desktop-client/src/components/reports/reports/Calendar.tsx-972-            <View style={{ color: chartTheme.colors.blue }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:633:packages/desktop-client/src/components/reports/reports/Calendar.tsx:973:              <PrivacyFilter>{format(totalIncome, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-634-packages/desktop-client/src/components/reports/reports/Calendar.tsx-974-            </View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-635-packages/desktop-client/src/components/reports/reports/Calendar.tsx-975-
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-637-packages/desktop-client/src/components/reports/reports/Calendar.tsx-983-            </View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-638-packages/desktop-client/src/components/reports/reports/Calendar.tsx-984-            <View style={{ color: chartTheme.colors.red }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:639:packages/desktop-client/src/components/reports/reports/Calendar.tsx:985:              <PrivacyFilter>{format(totalExpense, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-640-packages/desktop-client/src/components/reports/reports/Calendar.tsx-986-            </View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-641-packages/desktop-client/src/components/reports/reports/Calendar.tsx-987-          </View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-643-packages/desktop-client/src/components/reports/reports/CalendarCard.js-207-                          <view_1.View style={{ color: chart_theme_1.chartTheme.colors.blue }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-644-packages/desktop-client/src/components/reports/reports/CalendarCard.js-208-                            {totalIncome !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:645:packages/desktop-client/src/components/reports/reports/CalendarCard.js:209:                                {format(totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-646-packages/desktop-client/src/components/reports/reports/CalendarCard.js-210-                              </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-647-packages/desktop-client/src/components/reports/reports/CalendarCard.js-211-                          </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-649-packages/desktop-client/src/components/reports/reports/CalendarCard.js-220-                          <view_1.View style={{ color: chart_theme_1.chartTheme.colors.red }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-650-packages/desktop-client/src/components/reports/reports/CalendarCard.js-221-                            {totalExpense !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:651:packages/desktop-client/src/components/reports/reports/CalendarCard.js:222:                                {format(totalExpense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-652-packages/desktop-client/src/components/reports/reports/CalendarCard.js-223-                              </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-653-packages/desktop-client/src/components/reports/reports/CalendarCard.js-224-                          </view_1.View>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-655-packages/desktop-client/src/components/reports/reports/CalendarCard.js-367-                <v1_1.SvgArrowThickUp width={16} height={16} style={{ flexShrink: 0 }}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-656-packages/desktop-client/src/components/reports/reports/CalendarCard.js-368-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:657:packages/desktop-client/src/components/reports/reports/CalendarCard.js:369:                  {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-658-packages/desktop-client/src/components/reports/reports/CalendarCard.js-370-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-659-packages/desktop-client/src/components/reports/reports/CalendarCard.js-371-              </>) : ('')}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-661-packages/desktop-client/src/components/reports/reports/CalendarCard.js-379-                <v1_1.SvgArrowThickDown width={16} height={16} style={{ flexShrink: 0 }}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-662-packages/desktop-client/src/components/reports/reports/CalendarCard.js-380-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:663:packages/desktop-client/src/components/reports/reports/CalendarCard.js:381:                  {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-664-packages/desktop-client/src/components/reports/reports/CalendarCard.js-382-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-665-packages/desktop-client/src/components/reports/reports/CalendarCard.js-383-              </>) : ('')}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-667-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-245-                            {totalIncome !== 0 ? (
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-668-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-246-                              <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:669:packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:247:                                {format(totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-670-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-248-                              </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-671-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-249-                            ) : (
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-673-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-266-                            {totalExpense !== 0 ? (
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-674-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-267-                              <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:675:packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:268:                                {format(totalExpense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-676-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-269-                              </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-677-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-270-                            ) : (
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-679-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-510-                />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-680-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-511-                <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:681:packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:512:                  {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-682-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-513-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-683-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-514-              </>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-685-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-533-                />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-686-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-534-                <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:687:packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:535:                  {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-688-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-536-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-689-packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-537-              </>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-691-packages/desktop-client/src/components/reports/reports/CashFlow.js-262-              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-692-packages/desktop-client/src/components/reports/reports/CashFlow.js-263-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:693:packages/desktop-client/src/components/reports/reports/CashFlow.js:264:                  {format(totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-694-packages/desktop-client/src/components/reports/reports/CashFlow.js-265-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-695-packages/desktop-client/src/components/reports/reports/CashFlow.js-266-              </text_1.Text>}/>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-697-packages/desktop-client/src/components/reports/reports/CashFlow.js-270-              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-698-packages/desktop-client/src/components/reports/reports/CashFlow.js-271-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:699:packages/desktop-client/src/components/reports/reports/CashFlow.js:272:                  {format(totalExpenses, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-700-packages/desktop-client/src/components/reports/reports/CashFlow.js-273-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-701-packages/desktop-client/src/components/reports/reports/CashFlow.js-274-              </text_1.Text>}/>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-703-packages/desktop-client/src/components/reports/reports/CashFlow.js-278-              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-704-packages/desktop-client/src/components/reports/reports/CashFlow.js-279-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:705:packages/desktop-client/src/components/reports/reports/CashFlow.js:280:                  {format(totalTransfers, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-706-packages/desktop-client/src/components/reports/reports/CashFlow.js-281-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-707-packages/desktop-client/src/components/reports/reports/CashFlow.js-282-              </text_1.Text>}/>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-709-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-323-              <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-710-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-324-                <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:711:packages/desktop-client/src/components/reports/reports/CashFlow.tsx:325:                  {format(totalIncome, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-712-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-326-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-713-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-327-              </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-715-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-339-              <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-716-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-340-                <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:717:packages/desktop-client/src/components/reports/reports/CashFlow.tsx:341:                  {format(totalExpenses, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-718-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-342-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-719-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-343-              </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-721-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-355-              <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-722-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-356-                <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:723:packages/desktop-client/src/components/reports/reports/CashFlow.tsx:357:                  {format(totalTransfers, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-724-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-358-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-725-packages/desktop-client/src/components/reports/reports/CashFlow.tsx-359-              </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-727-packages/desktop-client/src/components/reports/reports/CashFlowCard.js-91-      </text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-728-packages/desktop-client/src/components/reports/reports/CashFlowCard.js-92-      <text x={x + barWidth + valueXOffsets[position]} y={yOffset + 26} textAnchor={anchorValue[position]} fill={theme_1.theme.tableText}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:729:packages/desktop-client/src/components/reports/reports/CashFlowCard.js:93:        <PrivacyFilter_1.PrivacyFilter>{format(value, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-730-packages/desktop-client/src/components/reports/reports/CashFlowCard.js-94-      </text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-731-packages/desktop-client/src/components/reports/reports/CashFlowCard.js-95-    </>);
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-733-packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-90-        fill={theme.tableText}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-734-packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-91-      >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:735:packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx:92:        <PrivacyFilter>{format(value, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-736-packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-93-      </text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-737-packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-94-    </>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-739-packages/desktop-client/src/components/reports/reports/CustomReport.js-674-                    <aligned_text_1.AlignedText left={<block_1.Block>{balanceType}:</block_1.Block>} right={<text_1.Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-740-packages/desktop-client/src/components/reports/reports/CustomReport.js-675-                          <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:741:packages/desktop-client/src/components/reports/reports/CustomReport.js:676:                            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-742-packages/desktop-client/src/components/reports/reports/CustomReport.js-677-                          </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-743-packages/desktop-client/src/components/reports/reports/CustomReport.js-678-                        </text_1.Text>}/>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-745-packages/desktop-client/src/components/reports/reports/CustomReport.tsx-932-                        <Text>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-746-packages/desktop-client/src/components/reports/reports/CustomReport.tsx-933-                          <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:747:packages/desktop-client/src/components/reports/reports/CustomReport.tsx:934:                            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-748-packages/desktop-client/src/components/reports/reports/CustomReport.tsx-935-                          </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-749-packages/desktop-client/src/components/reports/reports/CustomReport.tsx-936-                        </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-751-packages/desktop-client/src/components/reports/reports/NetWorth.js-259-        }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-752-packages/desktop-client/src/components/reports/reports/NetWorth.js-260-          <view_1.View style={__assign(__assign({}, styles_1.styles.largeText), { fontWeight: 400, marginBottom: 5 })}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:753:packages/desktop-client/src/components/reports/reports/NetWorth.js:261:            <PrivacyFilter_1.PrivacyFilter>{format(data.netWorth, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-754-packages/desktop-client/src/components/reports/reports/NetWorth.js-262-          </view_1.View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-755-packages/desktop-client/src/components/reports/reports/NetWorth.js-263-          <PrivacyFilter_1.PrivacyFilter>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-757-packages/desktop-client/src/components/reports/reports/NetWorth.tsx-313-            style={{ ...styles.largeText, fontWeight: 400, marginBottom: 5 }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-758-packages/desktop-client/src/components/reports/reports/NetWorth.tsx-314-          >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:759:packages/desktop-client/src/components/reports/reports/NetWorth.tsx:315:            <PrivacyFilter>{format(data.netWorth, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-760-packages/desktop-client/src/components/reports/reports/NetWorth.tsx-316-          </View>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-761-packages/desktop-client/src/components/reports/reports/NetWorth.tsx-317-          <PrivacyFilter>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-763-packages/desktop-client/src/components/reports/reports/NetWorthCard.js-148-              <block_1.Block style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 500, marginBottom: 5 })}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-764-packages/desktop-client/src/components/reports/reports/NetWorthCard.js-149-                <PrivacyFilter_1.PrivacyFilter activationFilters={[!isCardHovered]}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:765:packages/desktop-client/src/components/reports/reports/NetWorthCard.js:150:                  {format(data.netWorth, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-766-packages/desktop-client/src/components/reports/reports/NetWorthCard.js-151-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-767-packages/desktop-client/src/components/reports/reports/NetWorthCard.js-152-              </block_1.Block>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-769-packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-160-              >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-770-packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-161-                <PrivacyFilter activationFilters={[!isCardHovered]}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:771:packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx:162:                  {format(data.netWorth, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-772-packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-163-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-773-packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-164-              </Block>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-775-packages/desktop-client/src/components/reports/reports/SpendingCard.js-96-                  {data &&
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-776-packages/desktop-client/src/components/reports/reports/SpendingCard.js-97-                (difference && difference > 0 ? '+' : '') +
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:777:packages/desktop-client/src/components/reports/reports/SpendingCard.js:98:                    format(difference || 0, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-778-packages/desktop-client/src/components/reports/reports/SpendingCard.js-99-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-779-packages/desktop-client/src/components/reports/reports/SpendingCard.js-100-              </block_1.Block>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-781-packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-140-                  {data &&
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-782-packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-141-                    (difference && difference > 0 ? '+' : '') +
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:783:packages/desktop-client/src/components/reports/reports/SpendingCard.tsx:142:                      format(difference || 0, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-784-packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-143-                </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-785-packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-144-              </Block>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-787-packages/desktop-client/src/components/reports/reports/Summary.tsx-459-                >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-788-packages/desktop-client/src/components/reports/reports/Summary.tsx-460-                  <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:789:packages/desktop-client/src/components/reports/reports/Summary.tsx:461:                    {format(data?.dividend ?? 0, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-790-packages/desktop-client/src/components/reports/reports/Summary.tsx-462-                  </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-791-packages/desktop-client/src/components/reports/reports/Summary.tsx-463-                </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-793-packages/desktop-client/src/components/reports/ReportSummary.js-71-        <text_1.Text style={__assign(__assign({}, styles_1.styles.veryLargeText), { alignItems: 'center', marginBottom: 2, fontWeight: 800 })}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-794-packages/desktop-client/src/components/reports/ReportSummary.js-72-          <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:795:packages/desktop-client/src/components/reports/ReportSummary.js:73:            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-796-packages/desktop-client/src/components/reports/ReportSummary.js-74-          </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-797-packages/desktop-client/src/components/reports/ReportSummary.js-75-        </text_1.Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-799-packages/desktop-client/src/components/reports/ReportSummary.js-94-        <text_1.Text style={__assign(__assign({}, styles_1.styles.veryLargeText), { alignItems: 'center', marginBottom: 2, fontWeight: 800 })}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-800-packages/desktop-client/src/components/reports/ReportSummary.js-95-          <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:801:packages/desktop-client/src/components/reports/ReportSummary.js:96:            {!isNaN(average) && format(average, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-802-packages/desktop-client/src/components/reports/ReportSummary.js-97-          </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-803-packages/desktop-client/src/components/reports/ReportSummary.js-98-        </text_1.Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-805-packages/desktop-client/src/components/reports/ReportSummary.tsx-127-        >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-806-packages/desktop-client/src/components/reports/ReportSummary.tsx-128-          <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:807:packages/desktop-client/src/components/reports/ReportSummary.tsx:129:            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-808-packages/desktop-client/src/components/reports/ReportSummary.tsx-130-          </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-809-packages/desktop-client/src/components/reports/ReportSummary.tsx-131-        </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-811-packages/desktop-client/src/components/reports/ReportSummary.tsx-166-        >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-812-packages/desktop-client/src/components/reports/ReportSummary.tsx-167-          <PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:813:packages/desktop-client/src/components/reports/ReportSummary.tsx:168:            {!isNaN(average) && format(average, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-814-packages/desktop-client/src/components/reports/ReportSummary.tsx-169-          </PrivacyFilter>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-815-packages/desktop-client/src/components/reports/ReportSummary.tsx-170-        </Text>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-817-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-217-          </div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-818-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-218-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:819:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:219:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Income:')} right={format(income, 'financial')}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:820:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:220:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Expenses:')} right={format(expense, 'financial')}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:821:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:221:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Change:')} right={<strong>{format(income + expense, 'financial')}</strong>}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:822:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:222:            {creditTransfers + debitTransfers !== 0 && (<aligned_text_1.AlignedText left={(0, i18next_1.t)('Transfers:')} right={format(creditTransfers + debitTransfers, 'financial')}/>)}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:823:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:223:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Balance:')} right={format(balance, 'financial')}/>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-824-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-224-          </div>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-825-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-225-        </div>);
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-827-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-222-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-828-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-223-              left={t('Income:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:829:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:224:              right={format(income, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-830-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-225-            />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-831-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-226-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-832-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-227-              left={t('Expenses:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:833:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:228:              right={format(expense, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-834-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-229-            />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-835-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-230-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-836-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-231-              left={t('Change:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:837:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:232:              right={<strong>{format(income + expense, 'financial')}</strong>}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-838-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-233-            />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-839-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-234-            {creditTransfers + debitTransfers !== 0 && (
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-840-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-235-              <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-841-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-236-                left={t('Transfers:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:842:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:237:                right={format(creditTransfers + debitTransfers, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-843-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-238-              />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-844-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-239-            )}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-845-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-240-            <AlignedText
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-846-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-241-              left={t('Balance:')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:847:packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:242:              right={format(balance, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-848-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-243-            />
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-849-packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-244-          </div>
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-851-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-229-            x: d.format(x, displayFormat, { locale: locale }),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-852-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-230-            y: total,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:853:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:231:            assets: format(assets, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:854:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:232:            debt: "-".concat(format(debt, 'financial')),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:855:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:233:            change: format(change, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:856:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:234:            networth: format(total, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-857-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-235-            date: d.format(x, tooltipFormat, { locale: locale }),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-858-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-236-        };
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-860-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-252-      x: d.format(x, displayFormat, { locale }),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-861-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-253-      y: total,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:862:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:254:      assets: format(assets, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:863:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:255:      debt: `-${format(debt, 'financial')}`,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:864:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:256:      change: format(change, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:865:packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:257:      networth: format(total, 'financial'),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-866-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-258-      date: d.format(x, tooltipFormat, { locale }),
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-867-packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-259-    };
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-869-packages/desktop-client/src/components/rules/RuleEditor.js-237-function formatAmount(amount, format) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-870-packages/desktop-client/src/components/rules/RuleEditor.js-238-    if (!amount) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:871:packages/desktop-client/src/components/rules/RuleEditor.js:239:        return format(0, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-872-packages/desktop-client/src/components/rules/RuleEditor.js-240-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-873-packages/desktop-client/src/components/rules/RuleEditor.js-241-    else if (typeof amount === 'number') {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:874:packages/desktop-client/src/components/rules/RuleEditor.js:242:        return format(amount, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-875-packages/desktop-client/src/components/rules/RuleEditor.js-243-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-876-packages/desktop-client/src/components/rules/RuleEditor.js-244-    else {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:877:packages/desktop-client/src/components/rules/RuleEditor.js:245:        return "".concat(format(amount.num1, 'financial'), " to ").concat(format(amount.num2, 'financial'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-878-packages/desktop-client/src/components/rules/RuleEditor.js-246-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-879-packages/desktop-client/src/components/rules/RuleEditor.js-247-}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-881-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-237-function formatAmount(amount, format) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-882-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-238-    if (!amount) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:883:packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo:239:        return format(0, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-884-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-240-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-885-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-241-    else if (typeof amount === 'number') {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:886:packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo:242:        return format(amount, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-887-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-243-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-888-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-244-    else {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:889:packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo:245:        return "".concat(format(amount.num1, 'financial'), " to ").concat(format(amount.num2, 'financial'));
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-890-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-246-    }
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-891-packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-247-}
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-893-packages/desktop-client/src/components/rules/RuleEditor.tsx-359-function formatAmount(amount, format) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-894-packages/desktop-client/src/components/rules/RuleEditor.tsx-360-  if (!amount) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:895:packages/desktop-client/src/components/rules/RuleEditor.tsx:361:    return format(0, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-896-packages/desktop-client/src/components/rules/RuleEditor.tsx-362-  } else if (typeof amount === 'number') {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:897:packages/desktop-client/src/components/rules/RuleEditor.tsx:363:    return format(amount, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-898-packages/desktop-client/src/components/rules/RuleEditor.tsx-364-  } else {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:899:packages/desktop-client/src/components/rules/RuleEditor.tsx:365:    return `${format(amount.num1, 'financial')} to ${format(
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-900-packages/desktop-client/src/components/rules/RuleEditor.tsx-366-      amount.num2,
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-901-packages/desktop-client/src/components/rules/RuleEditor.tsx-367-      'financial',
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-903-packages/desktop-client/src/components/rules/Value.js-65-            switch (field) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-904-packages/desktop-client/src/components/rules/Value.js-66-                case 'amount':
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:905:packages/desktop-client/src/components/rules/Value.js:67:                    return format(value, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-906-packages/desktop-client/src/components/rules/Value.js-68-                case 'date':
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-907-packages/desktop-client/src/components/rules/Value.js-69-                    if (value) {
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-909-packages/desktop-client/src/components/rules/Value.tsx-75-      switch (field) {
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-910-packages/desktop-client/src/components/rules/Value.tsx-76-        case 'amount':
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:911:packages/desktop-client/src/components/rules/Value.tsx:77:          return format(value, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-912-packages/desktop-client/src/components/rules/Value.tsx-78-        case 'date':
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-913-packages/desktop-client/src/components/rules/Value.tsx-79-          if (value) {
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-915-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-87-                case 'amount':
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-916-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-88-                    return (<table_1.Field key={i} width={75} style={__assign({ textAlign: 'right' }, styles_1.styles.tnum)}>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:917:packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js:89:                {format(transaction.amount, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-918-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-90-              </table_1.Field>);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-919-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-91-                default:
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-921-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-160-                style={{ textAlign: 'right', ...styles.tnum }}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-922-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-161-              >
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:923:packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx:162:                {format(transaction.amount, 'financial')}
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-924-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-163-              </Field>
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-925-packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-164-            );
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-927-packages/desktop-client/src/components/util/AmountInput.js-40-        return isEditing
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-928-packages/desktop-client/src/components/util/AmountInput.js-41-            ? format.forEdit(absoluteValue)
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:929:packages/desktop-client/src/components/util/AmountInput.js:42:            : format(absoluteValue, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-930-packages/desktop-client/src/components/util/AmountInput.js-43-    }, [format]);
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-931-packages/desktop-client/src/components/util/AmountInput.js-44-    var _g = (0, react_1.useState)(getDisplayValue(initialValue, false)), value = _g[0], setValue = _g[1];
--
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-933-packages/desktop-client/src/components/util/AmountInput.tsx-73-      return isEditing
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-934-packages/desktop-client/src/components/util/AmountInput.tsx-74-        ? format.forEdit(absoluteValue)
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md:935:packages/desktop-client/src/components/util/AmountInput.tsx:75:        : format(absoluteValue, 'financial');
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-936-packages/desktop-client/src/components/util/AmountInput.tsx-76-    },
packages/desktop-client/src/components/modals/FormatFinancialGrepResults.md-937-packages/desktop-client/src/components/util/AmountInput.tsx-77-    [format],
--
packages/desktop-client/src/components/reports/Change.js-23-    return (<block_1.Block style={__assign(__assign(__assign({}, styles_1.styles.smallText), { color: amount < 0 ? theme_1.theme.errorText : theme_1.theme.noticeTextLight }), style)}>
packages/desktop-client/src/components/reports/Change.js-24-      {amount >= 0 ? '+' : ''}
packages/desktop-client/src/components/reports/Change.js:25:      {format(amount, 'financial')}
packages/desktop-client/src/components/reports/Change.js-26-    </block_1.Block>);
packages/desktop-client/src/components/reports/Change.js-27-}
--
packages/desktop-client/src/components/reports/Change.tsx-25-    >
packages/desktop-client/src/components/reports/Change.tsx-26-      {amount >= 0 ? '+' : ''}
packages/desktop-client/src/components/reports/Change.tsx:27:      {format(amount, 'financial')}
packages/desktop-client/src/components/reports/Change.tsx-28-    </Block>
packages/desktop-client/src/components/reports/Change.tsx-29-  );
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-42-          </div>
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-43-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:44:            {['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Assets:')} right={format(payload[0].payload.totalAssets, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:45:            {['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Debts:')} right={format(payload[0].payload.totalDebts, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:46:            {['netAssets'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Assets:')} right={format(payload[0].payload.netAssets, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:47:            {['netDebts'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Debts:')} right={format(payload[0].payload.netDebts, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-48-            {['totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net:')} right={<strong>
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:49:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-50-                  </strong>}/>)}
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-51-          </div>
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-64-    var textAnchor = props.index === 0 ? 'start' : 'middle';
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-65-    var display = typeof props.value !== 'string' && props.value !== 0
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:66:        ? "".concat(format(props.value || 0, 'financial-no-decimals'))
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-67-        : '';
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-68-    var textSize = (0, adjustTextSize_1.adjustTextSize)({ sized: width, type: 'area' });
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-93-    var tickFormatter = function (tick) {
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-94-        if (!privacyMode)
packages/desktop-client/src/components/reports/graphs/AreaGraph.js:95:            return "".concat(format(tick, 'financial-no-decimals')); // Formats the tick values as strings with commas
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-96-        return '...';
packages/desktop-client/src/components/reports/graphs/AreaGraph.js-97-    };
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-75-              <AlignedText
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-76-                left={t('Assets:')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:77:                right={format(payload[0].payload.totalAssets, 'financial')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-78-              />
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-79-            )}
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-81-              <AlignedText
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-82-                left={t('Debts:')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:83:                right={format(payload[0].payload.totalDebts, 'financial')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-84-              />
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-85-            )}
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-87-              <AlignedText
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-88-                left={t('Net Assets:')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:89:                right={format(payload[0].payload.netAssets, 'financial')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-90-              />
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-91-            )}
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-93-              <AlignedText
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-94-                left={t('Net Debts:')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:95:                right={format(payload[0].payload.netDebts, 'financial')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-96-              />
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-97-            )}
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-101-                right={
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-102-                  <strong>
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:103:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-104-                  </strong>
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-105-                }
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-145-  const display =
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-146-    typeof props.value !== 'string' && props.value !== 0
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:147:      ? `${format(props.value || 0, 'financial-no-decimals')}`
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-148-      : '';
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-149-  const textSize = adjustTextSize({ sized: width, type: 'area' });
--
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-194-
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-195-  const tickFormatter = (tick: number) => {
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx:196:    if (!privacyMode) return `${format(tick, 'financial-no-decimals')}`; // Formats the tick values as strings with commas
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-197-    return '...';
packages/desktop-client/src/components/reports/graphs/AreaGraph.tsx-198-  };
--
packages/desktop-client/src/components/reports/graphs/BarGraph.js-49-          </div>
packages/desktop-client/src/components/reports/graphs/BarGraph.js-50-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/reports/graphs/BarGraph.js:51:            {['totalAssets', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Assets:')} right={format(payload[0].payload.totalAssets, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js:52:            {['totalDebts', 'totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Debts:')} right={format(payload[0].payload.totalDebts, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js:53:            {['netAssets'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Assets:')} right={format(payload[0].payload.netAssets, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js:54:            {['netDebts'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net Debts:')} right={format(payload[0].payload.netDebts, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js-55-            {['totalTotals'].includes(balanceTypeOp) && (<aligned_text_1.AlignedText left={t('Net:')} right={<strong>
packages/desktop-client/src/components/reports/graphs/BarGraph.js:56:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/reports/graphs/BarGraph.js-57-                  </strong>}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js-58-          </div>
--
packages/desktop-client/src/components/reports/graphs/BarGraph.js-65-    var calcY = props.y - (props.value > 0 ? 15 : -15);
packages/desktop-client/src/components/reports/graphs/BarGraph.js-66-    var textAnchor = 'middle';
packages/desktop-client/src/components/reports/graphs/BarGraph.js:67:    var display = props.value !== 0 && "".concat(format(props.value, 'financial-no-decimals'));
packages/desktop-client/src/components/reports/graphs/BarGraph.js-68-    var textSize = (0, adjustTextSize_1.adjustTextSize)({
packages/desktop-client/src/components/reports/graphs/BarGraph.js-69-        sized: props.width,
--
packages/desktop-client/src/components/reports/graphs/BarGraph.js-112-                {!compact && (<recharts_1.XAxis dataKey={yAxis} angle={-35} textAnchor="end" height={Math.sqrt(longestLabelLength) * 25} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js-113-                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
packages/desktop-client/src/components/reports/graphs/BarGraph.js:114:                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
packages/desktop-client/src/components/reports/graphs/BarGraph.js-115-                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
packages/desktop-client/src/components/reports/graphs/BarGraph.js-116-                {!compact && (<recharts_1.ReferenceLine y={0} stroke={theme_1.theme.pageTextLight}/>)}
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-97-              <AlignedText
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-98-                left={t('Assets:')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:99:                right={format(payload[0].payload.totalAssets, 'financial')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-100-              />
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-101-            )}
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-103-              <AlignedText
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-104-                left={t('Debts:')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:105:                right={format(payload[0].payload.totalDebts, 'financial')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-106-              />
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-107-            )}
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-109-              <AlignedText
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-110-                left={t('Net Assets:')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:111:                right={format(payload[0].payload.netAssets, 'financial')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-112-              />
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-113-            )}
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-115-              <AlignedText
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-116-                left={t('Net Debts:')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:117:                right={format(payload[0].payload.netDebts, 'financial')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-118-              />
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-119-            )}
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-123-                right={
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-124-                  <strong>
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:125:                    {format(payload[0].payload.totalTotals, 'financial')}
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-126-                  </strong>
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-127-                }
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-140-  const textAnchor = 'middle';
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-141-  const display =
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:142:    props.value !== 0 && `${format(props.value, 'financial-no-decimals')}`;
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-143-  const textSize = adjustTextSize({
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-144-    sized: props.width,
--
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-259-                    tickFormatter={value =>
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-260-                      getCustomTick(
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx:261:                        format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-262-                        privacyMode,
packages/desktop-client/src/components/reports/graphs/BarGraph.tsx-263-                      )
--
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-98-                    }}>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-99-                        {day.incomeValue !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js:100:                            {format(day.incomeValue, 'financial')}
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-101-                          </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-102-                      </view_1.View>
--
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-119-                    }}>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-120-                        {day.expenseValue !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js:121:                            {format(day.expenseValue, 'financial')}
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-122-                          </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/reports/graphs/CalendarGraph.js-123-                      </view_1.View>
--
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-144-                        {day.incomeValue !== 0 ? (
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-145-                          <PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx:146:                            {format(day.incomeValue, 'financial')}
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-147-                          </PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-148-                        ) : (
--
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-173-                        {day.expenseValue !== 0 ? (
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-174-                          <PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx:175:                            {format(day.expenseValue, 'financial')}
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-176-                          </PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/CalendarGraph.tsx-177-                        ) : (
--
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-41-        </div>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-42-        <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:43:          <aligned_text_1.AlignedText left={t('Income:')} right={format(data.income, 'financial')}/>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:44:          <aligned_text_1.AlignedText left={t('Expenses:')} right={format(data.expenses, 'financial')}/>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-45-          <aligned_text_1.AlignedText left={t('Change:')} right={<strong>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:46:                {format(data.income + data.expenses, 'financial')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-47-              </strong>}/>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:48:          {data.transfers !== 0 && (<aligned_text_1.AlignedText left={t('Transfers:')} right={format(data.transfers, 'financial')}/>)}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:49:          <aligned_text_1.AlignedText left={t('Balance:')} right={format(data.balance, 'financial')}/>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-50-        </div>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-51-      </div>
--
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-78-                return privacyMode && !yAxisIsHovered
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-79-                    ? '...'
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js:80:                    : format(value, 'financial-no-decimals');
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-81-            }} onMouseEnter={function () { return setYAxisIsHovered(true); }} onMouseLeave={function () { return setYAxisIsHovered(false); }}/>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.js-82-            <recharts_1.Tooltip labelFormatter={function (x) {
--
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-81-          <AlignedText
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-82-            left={t('Income:')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:83:            right={format(data.income, 'financial')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-84-          />
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-85-          <AlignedText
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-86-            left={t('Expenses:')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:87:            right={format(data.expenses, 'financial')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-88-          />
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-89-          <AlignedText
--
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-91-            right={
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-92-              <strong>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:93:                {format(data.income + data.expenses, 'financial')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-94-              </strong>
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-95-            }
--
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-98-            <AlignedText
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-99-              left={t('Transfers:')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:100:              right={format(data.transfers, 'financial')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-101-            />
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-102-          )}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-103-          <AlignedText
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-104-            left={t('Balance:')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:105:            right={format(data.balance, 'financial')}
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-106-          />
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-107-        </div>
--
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-169-                privacyMode && !yAxisIsHovered
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-170-                  ? '...'
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx:171:                  : format(value, 'financial-no-decimals')
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-172-              }
packages/desktop-client/src/components/reports/graphs/CashFlowGraph.tsx-173-              onMouseEnter={() => setYAxisIsHovered(true)}
--
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-41-      <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-42-        <text x={cx + outerRadius * Math.cos(-RADIAN * 240) - 30} y={ey} dy={0} textAnchor="end" fill={fill}>
packages/desktop-client/src/components/reports/graphs/DonutGraph.js:43:          {"".concat(format(value, 'financial'))}
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-44-        </text>
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-45-        <text x={cx + outerRadius * Math.cos(-RADIAN * 330) + 10} y={ey} dy={0} textAnchor="start" fill="#999">
--
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-72-      <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} textAnchor={textAnchor} fill={fill}>{"".concat(yAxis)}</text>
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-73-      <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/graphs/DonutGraph.js:74:        <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} dy={18} textAnchor={textAnchor} fill={fill}>{"".concat(format(value, 'financial'))}</text>
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-75-        <text x={ex + (cos <= 0 ? 1 : -1) * 16} y={ey} dy={36} textAnchor={textAnchor} fill="#999">
packages/desktop-client/src/components/reports/graphs/DonutGraph.js-76-          {"(".concat((percent * 100).toFixed(2), "%)")}
--
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-74-          fill={fill}
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-75-        >
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx:76:          {`${format(value, 'financial')}`}
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-77-        </text>
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-78-        <text
--
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-177-          textAnchor={textAnchor}
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-178-          fill={fill}
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx:179:        >{`${format(value, 'financial')}`}</text>
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-180-        <text
packages/desktop-client/src/components/reports/graphs/DonutGraph.tsx-181-          x={ex + (cos <= 0 ? 1 : -1) * 16}
--
packages/desktop-client/src/components/reports/graphs/LineGraph.js-60-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/reports/graphs/LineGraph.js-61-            {items.map(function (p, index) {
packages/desktop-client/src/components/reports/graphs/LineGraph.js:62:                return ((compact ? index < 4 : true) && (<aligned_text_1.AlignedText key={index} left={p.dataKey} right={format(p.value, 'financial')} style={{
packages/desktop-client/src/components/reports/graphs/LineGraph.js-63-                        color: p.color,
packages/desktop-client/src/components/reports/graphs/LineGraph.js-64-                        textDecoration: tooltip === p.dataKey ? 'underline' : 'inherit',
--
packages/desktop-client/src/components/reports/graphs/LineGraph.js-66-            })}
packages/desktop-client/src/components/reports/graphs/LineGraph.js-67-            {payload.length > 5 && compact && '...'}
packages/desktop-client/src/components/reports/graphs/LineGraph.js:68:            <aligned_text_1.AlignedText left={t('Total')} right={format(sumTotals, 'financial')} style={{
packages/desktop-client/src/components/reports/graphs/LineGraph.js-69-                fontWeight: 600,
packages/desktop-client/src/components/reports/graphs/LineGraph.js-70-            }}/>
--
packages/desktop-client/src/components/reports/graphs/LineGraph.js-114-                {!compact && (<recharts_1.XAxis dataKey="date" tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }}/>)}
packages/desktop-client/src/components/reports/graphs/LineGraph.js-115-                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
packages/desktop-client/src/components/reports/graphs/LineGraph.js:116:                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
packages/desktop-client/src/components/reports/graphs/LineGraph.js-117-                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
packages/desktop-client/src/components/reports/graphs/LineGraph.js-118-                {data.legend.map(function (entry, index) {
--
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-99-                    key={index}
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-100-                    left={p.dataKey}
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx:101:                    right={format(p.value, 'financial')}
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-102-                    style={{
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-103-                      color: p.color,
--
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-112-            <AlignedText
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-113-              left={t('Total')}
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx:114:              right={format(sumTotals, 'financial')}
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-115-              style={{
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-116-                fontWeight: 600,
--
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-226-                    tickFormatter={value =>
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-227-                      getCustomTick(
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx:228:                        format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-229-                        privacyMode,
packages/desktop-client/src/components/reports/graphs/LineGraph.tsx-230-                      )
--
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-104-                    left: compact
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-105-                        ? 0
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js:106:                        : (0, computePadding_1.computePadding)(graphData.data.map(function (item) { return item.y; }), function (value) { return format(value, 'financial-no-decimals'); }),
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-107-                    bottom: 0,
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.js-108-                }}>
--
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-180-                    : computePadding(
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-181-                        graphData.data.map(item => item.y),
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx:182:                        value => format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-183-                      ),
packages/desktop-client/src/components/reports/graphs/NetWorthGraph.tsx-184-                  bottom: 0,
--
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-96-    var tickFormatter = function (tick) {
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-97-        if (!privacyMode)
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js:98:            return "".concat(format(tick, 'financial-no-decimals'));
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-99-        return '...';
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-100-    };
--
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-131-                    left: (0, computePadding_1.computePadding)(data.intervalData
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-132-                        .map(function (item) { return getVal(item, maxYAxis ? compare : selection); })
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js:133:                        .filter(function (value) { return value !== undefined; }), function (value) { return format(value, 'financial-no-decimals'); }),
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-134-                    bottom: 0,
packages/desktop-client/src/components/reports/graphs/SpendingGraph.js-135-                }}>
--
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-177-
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-178-  const tickFormatter: ComponentProps<typeof YAxis>['tickFormatter'] = tick => {
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx:179:    if (!privacyMode) return `${format(tick, 'financial-no-decimals')}`;
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-180-    return '...';
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-181-  };
--
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-230-                      .map(item => getVal(item, maxYAxis ? compare : selection))
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-231-                      .filter(value => value !== undefined),
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx:232:                    (value: number) => format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-233-                  ),
packages/desktop-client/src/components/reports/graphs/SpendingGraph.tsx-234-                  bottom: 0,
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-63-            {items.map(function (pay, i) {
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-64-                return (pay.value !== 0 &&
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:65:                    (compact ? i < 5 : true) && (<aligned_text_1.AlignedText key={pay.name} left={pay.name} right={format(pay.value, 'financial')} style={{
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-66-                        color: pay.color,
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-67-                        textDecoration: tooltip === pay.name ? 'underline' : 'inherit',
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-69-            })}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-70-            {payload.length > 5 && compact && '...'}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:71:            <aligned_text_1.AlignedText left={t('Total')} right={format(sumTotals, 'financial')} style={{
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-72-                fontWeight: 600,
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-73-            }}/>
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-81-    var calcY = props.y + props.height / 2;
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-82-    var textAnchor = 'middle';
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:83:    var display = props.value && "".concat(props.format(props.value, 'financial-no-decimals'));
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-84-    var textSize = '12px';
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-85-    var showLabel = props.height;
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-113-                {!compact && <recharts_1.CartesianGrid strokeDasharray="3 3"/>}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-114-                {!compact && (<recharts_1.YAxis tickFormatter={function (value) {
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js:115:                        return (0, getCustomTick_1.getCustomTick)(format(value, 'financial-no-decimals'), privacyMode);
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-116-                    }} tick={{ fill: theme_1.theme.pageText }} tickLine={{ stroke: theme_1.theme.pageText }} tickSize={0}/>)}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.js-117-                {data.legend
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-105-                    key={pay.name}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-106-                    left={pay.name}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:107:                    right={format(pay.value, 'financial')}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-108-                    style={{
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-109-                      color: pay.color,
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-118-            <AlignedText
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-119-              left={t('Total')}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:120:              right={format(sumTotals, 'financial')}
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-121-              style={{
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-122-                fontWeight: 600,
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-135-  const textAnchor = 'middle';
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-136-  const display =
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:137:    props.value && `${props.format(props.value, 'financial-no-decimals')}`;
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-138-  const textSize = '12px';
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-139-  const showLabel = props.height;
--
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-241-                    tickFormatter={value =>
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-242-                      getCustomTick(
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx:243:                        format(value, 'financial-no-decimals'),
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-244-                        privacyMode,
packages/desktop-client/src/components/reports/graphs/StackedBarGraph.tsx-245-                      )
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-68-                        var value = _a.value;
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-69-                        return (<text_1.Text style={hoverUnderline}>{value}</text_1.Text>);
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:70:                    }} valueStyle={compactStyle} value={format(intervalItem[balanceTypeOp], 'financial')} title={Math.abs(intervalItem[balanceTypeOp]) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:71:                        ? format(intervalItem[balanceTypeOp], 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-72-                        : undefined} onClick={function () {
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-73-                        return !isNarrowWidth &&
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-93-            })
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-94-            : balanceTypeOp === 'totalTotals' && (<>
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:95:                  <table_1.Cell value={format(item.totalAssets, 'financial')} title={Math.abs(item.totalAssets) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:96:                    ? format(item.totalAssets, 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-97-                    : undefined} width="flex" privacyFilter style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-98-                    color: getAmountColor(item.totalAssets),
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-120-                        });
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-121-                }}/>
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:122:                  <table_1.Cell value={format(item.totalDebts, 'financial')} title={Math.abs(item.totalDebts) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:123:                    ? format(item.totalDebts, 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-124-                    : undefined} width="flex" privacyFilter style={__assign({ minWidth: compact ? 50 : 85 }, (colorized && {
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-125-                    color: getAmountColor(item.totalDebts),
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-148-                }}/>
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-149-                </>)}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:150:          <table_1.Cell value={format(item[balanceTypeOp], 'financial')} title={Math.abs(item[balanceTypeOp]) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:151:            ? format(item[balanceTypeOp], 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-152-            : undefined} style={__assign({ fontWeight: 600, minWidth: compact ? 50 : 85 }, (colorized && { color: getAmountColor(item[balanceTypeOp]) }))} unexposedContent={function (_a) {
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-153-            var value = _a.value;
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-173-                });
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-174-        }} width="flex" privacyFilter/>
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:175:          <table_1.Cell value={format(average, 'financial')} title={Math.abs(average / 100) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js:176:            ? format(average, 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-177-            : undefined} style={__assign({ fontWeight: 600, minWidth: compact ? 50 : 85 }, (colorized && { color: getAmountColor(average) }))} valueStyle={compactStyle} width="flex" privacyFilter/>
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.js-178-        </view_1.View>
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-148-                    )}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-149-                    valueStyle={compactStyle}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:150:                    value={format(intervalItem[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-151-                    title={
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-152-                      Math.abs(intervalItem[balanceTypeOp]) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:153:                        ? format(intervalItem[balanceTypeOp], 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-154-                        : undefined
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-155-                    }
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-183-                <>
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-184-                  <Cell
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:185:                    value={format(item.totalAssets, 'financial')}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-186-                    title={
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-187-                      Math.abs(item.totalAssets) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:188:                        ? format(item.totalAssets, 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-189-                        : undefined
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-190-                    }
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-223-                  />
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-224-                  <Cell
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:225:                    value={format(item.totalDebts, 'financial')}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-226-                    title={
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-227-                      Math.abs(item.totalDebts) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:228:                        ? format(item.totalDebts, 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-229-                        : undefined
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-230-                    }
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-265-              )}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-266-          <Cell
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:267:            value={format(item[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-268-            title={
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-269-              Math.abs(item[balanceTypeOp]) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:270:                ? format(item[balanceTypeOp], 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-271-                : undefined
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-272-            }
--
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-304-          />
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-305-          <Cell
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:306:            value={format(average, 'financial')}
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-307-            title={
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-308-              Math.abs(average / 100) > 100000
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx:309:                ? format(average, 'financial')
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-310-                : undefined
packages/desktop-client/src/components/reports/graphs/tableGraph/ReportTableRow.tsx-311-            }
--
packages/desktop-client/src/components/reports/reports/Calendar.js-586-        }} aria-label={t('Income')}>
packages/desktop-client/src/components/reports/reports/Calendar.js-587-            <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.js:588:              {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/Calendar.js-589-            </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.js-590-          </view_1.View>
--
packages/desktop-client/src/components/reports/reports/Calendar.js-597-        }} aria-label={t('Expenses')}>
packages/desktop-client/src/components/reports/reports/Calendar.js-598-            <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.js:599:              {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/reports/reports/Calendar.js-600-            </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.js-601-          </view_1.View>
--
packages/desktop-client/src/components/reports/reports/Calendar.js-651-            </view_1.View>
packages/desktop-client/src/components/reports/reports/Calendar.js-652-            <view_1.View style={{ color: chart_theme_1.chartTheme.colors.blue }}>
packages/desktop-client/src/components/reports/reports/Calendar.js:653:              <PrivacyFilter_1.PrivacyFilter>{format(totalIncome, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.js-654-            </view_1.View>
packages/desktop-client/src/components/reports/reports/Calendar.js-655-
--
packages/desktop-client/src/components/reports/reports/Calendar.js-661-            </view_1.View>
packages/desktop-client/src/components/reports/reports/Calendar.js-662-            <view_1.View style={{ color: chart_theme_1.chartTheme.colors.red }}>
packages/desktop-client/src/components/reports/reports/Calendar.js:663:              <PrivacyFilter_1.PrivacyFilter>{format(totalExpense, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.js-664-            </view_1.View>
packages/desktop-client/src/components/reports/reports/Calendar.js-665-          </view_1.View>
--
packages/desktop-client/src/components/reports/reports/Calendar.tsx-860-          >
packages/desktop-client/src/components/reports/reports/Calendar.tsx-861-            <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.tsx:862:              {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/Calendar.tsx-863-            </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-864-          </View>
--
packages/desktop-client/src/components/reports/reports/Calendar.tsx-878-          >
packages/desktop-client/src/components/reports/reports/Calendar.tsx-879-            <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.tsx:880:              {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/reports/reports/Calendar.tsx-881-            </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-882-          </View>
--
packages/desktop-client/src/components/reports/reports/Calendar.tsx-971-            </View>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-972-            <View style={{ color: chartTheme.colors.blue }}>
packages/desktop-client/src/components/reports/reports/Calendar.tsx:973:              <PrivacyFilter>{format(totalIncome, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-974-            </View>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-975-
--
packages/desktop-client/src/components/reports/reports/Calendar.tsx-983-            </View>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-984-            <View style={{ color: chartTheme.colors.red }}>
packages/desktop-client/src/components/reports/reports/Calendar.tsx:985:              <PrivacyFilter>{format(totalExpense, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-986-            </View>
packages/desktop-client/src/components/reports/reports/Calendar.tsx-987-          </View>
--
packages/desktop-client/src/components/reports/reports/CalendarCard.js-207-                          <view_1.View style={{ color: chart_theme_1.chartTheme.colors.blue }}>
packages/desktop-client/src/components/reports/reports/CalendarCard.js-208-                            {totalIncome !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.js:209:                                {format(totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.js-210-                              </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/reports/reports/CalendarCard.js-211-                          </view_1.View>
--
packages/desktop-client/src/components/reports/reports/CalendarCard.js-220-                          <view_1.View style={{ color: chart_theme_1.chartTheme.colors.red }}>
packages/desktop-client/src/components/reports/reports/CalendarCard.js-221-                            {totalExpense !== 0 ? (<PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.js:222:                                {format(totalExpense, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.js-223-                              </PrivacyFilter_1.PrivacyFilter>) : ('')}
packages/desktop-client/src/components/reports/reports/CalendarCard.js-224-                          </view_1.View>
--
packages/desktop-client/src/components/reports/reports/CalendarCard.js-367-                <v1_1.SvgArrowThickUp width={16} height={16} style={{ flexShrink: 0 }}/>
packages/desktop-client/src/components/reports/reports/CalendarCard.js-368-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.js:369:                  {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.js-370-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.js-371-              </>) : ('')}
--
packages/desktop-client/src/components/reports/reports/CalendarCard.js-379-                <v1_1.SvgArrowThickDown width={16} height={16} style={{ flexShrink: 0 }}/>
packages/desktop-client/src/components/reports/reports/CalendarCard.js-380-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.js:381:                  {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.js-382-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.js-383-              </>) : ('')}
--
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-245-                            {totalIncome !== 0 ? (
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-246-                              <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:247:                                {format(totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-248-                              </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-249-                            ) : (
--
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-266-                            {totalExpense !== 0 ? (
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-267-                              <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:268:                                {format(totalExpense, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-269-                              </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-270-                            ) : (
--
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-510-                />
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-511-                <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:512:                  {format(calendar.totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-513-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-514-              </>
--
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-533-                />
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-534-                <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx:535:                  {format(calendar.totalExpense, 'financial')}
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-536-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CalendarCard.tsx-537-              </>
--
packages/desktop-client/src/components/reports/reports/CashFlow.js-262-              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/reports/reports/CashFlow.js-263-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.js:264:                  {format(totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/CashFlow.js-265-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.js-266-              </text_1.Text>}/>
--
packages/desktop-client/src/components/reports/reports/CashFlow.js-270-              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/reports/reports/CashFlow.js-271-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.js:272:                  {format(totalExpenses, 'financial')}
packages/desktop-client/src/components/reports/reports/CashFlow.js-273-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.js-274-              </text_1.Text>}/>
--
packages/desktop-client/src/components/reports/reports/CashFlow.js-278-              </block_1.Block>} right={<text_1.Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/reports/reports/CashFlow.js-279-                <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.js:280:                  {format(totalTransfers, 'financial')}
packages/desktop-client/src/components/reports/reports/CashFlow.js-281-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.js-282-              </text_1.Text>}/>
--
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-323-              <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-324-                <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx:325:                  {format(totalIncome, 'financial')}
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-326-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-327-              </Text>
--
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-339-              <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-340-                <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx:341:                  {format(totalExpenses, 'financial')}
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-342-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-343-              </Text>
--
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-355-              <Text style={{ fontWeight: 600 }}>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-356-                <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx:357:                  {format(totalTransfers, 'financial')}
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-358-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlow.tsx-359-              </Text>
--
packages/desktop-client/src/components/reports/reports/CashFlowCard.js-91-      </text>
packages/desktop-client/src/components/reports/reports/CashFlowCard.js-92-      <text x={x + barWidth + valueXOffsets[position]} y={yOffset + 26} textAnchor={anchorValue[position]} fill={theme_1.theme.tableText}>
packages/desktop-client/src/components/reports/reports/CashFlowCard.js:93:        <PrivacyFilter_1.PrivacyFilter>{format(value, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlowCard.js-94-      </text>
packages/desktop-client/src/components/reports/reports/CashFlowCard.js-95-    </>);
--
packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-90-        fill={theme.tableText}
packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-91-      >
packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx:92:        <PrivacyFilter>{format(value, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-93-      </text>
packages/desktop-client/src/components/reports/reports/CashFlowCard.tsx-94-    </>
--
packages/desktop-client/src/components/reports/reports/CustomReport.js-674-                    <aligned_text_1.AlignedText left={<block_1.Block>{balanceType}:</block_1.Block>} right={<text_1.Text>
packages/desktop-client/src/components/reports/reports/CustomReport.js-675-                          <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CustomReport.js:676:                            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/reports/reports/CustomReport.js-677-                          </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CustomReport.js-678-                        </text_1.Text>}/>
--
packages/desktop-client/src/components/reports/reports/CustomReport.tsx-932-                        <Text>
packages/desktop-client/src/components/reports/reports/CustomReport.tsx-933-                          <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CustomReport.tsx:934:                            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/reports/reports/CustomReport.tsx-935-                          </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/CustomReport.tsx-936-                        </Text>
--
packages/desktop-client/src/components/reports/reports/NetWorth.js-259-        }}>
packages/desktop-client/src/components/reports/reports/NetWorth.js-260-          <view_1.View style={__assign(__assign({}, styles_1.styles.largeText), { fontWeight: 400, marginBottom: 5 })}>
packages/desktop-client/src/components/reports/reports/NetWorth.js:261:            <PrivacyFilter_1.PrivacyFilter>{format(data.netWorth, 'financial')}</PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/NetWorth.js-262-          </view_1.View>
packages/desktop-client/src/components/reports/reports/NetWorth.js-263-          <PrivacyFilter_1.PrivacyFilter>
--
packages/desktop-client/src/components/reports/reports/NetWorth.tsx-313-            style={{ ...styles.largeText, fontWeight: 400, marginBottom: 5 }}
packages/desktop-client/src/components/reports/reports/NetWorth.tsx-314-          >
packages/desktop-client/src/components/reports/reports/NetWorth.tsx:315:            <PrivacyFilter>{format(data.netWorth, 'financial')}</PrivacyFilter>
packages/desktop-client/src/components/reports/reports/NetWorth.tsx-316-          </View>
packages/desktop-client/src/components/reports/reports/NetWorth.tsx-317-          <PrivacyFilter>
--
packages/desktop-client/src/components/reports/reports/NetWorthCard.js-148-              <block_1.Block style={__assign(__assign({}, styles_1.styles.mediumText), { fontWeight: 500, marginBottom: 5 })}>
packages/desktop-client/src/components/reports/reports/NetWorthCard.js-149-                <PrivacyFilter_1.PrivacyFilter activationFilters={[!isCardHovered]}>
packages/desktop-client/src/components/reports/reports/NetWorthCard.js:150:                  {format(data.netWorth, 'financial')}
packages/desktop-client/src/components/reports/reports/NetWorthCard.js-151-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/NetWorthCard.js-152-              </block_1.Block>
--
packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-160-              >
packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-161-                <PrivacyFilter activationFilters={[!isCardHovered]}>
packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx:162:                  {format(data.netWorth, 'financial')}
packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-163-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/NetWorthCard.tsx-164-              </Block>
--
packages/desktop-client/src/components/reports/reports/SpendingCard.js-96-                  {data &&
packages/desktop-client/src/components/reports/reports/SpendingCard.js-97-                (difference && difference > 0 ? '+' : '') +
packages/desktop-client/src/components/reports/reports/SpendingCard.js:98:                    format(difference || 0, 'financial')}
packages/desktop-client/src/components/reports/reports/SpendingCard.js-99-                </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/reports/SpendingCard.js-100-              </block_1.Block>
--
packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-140-                  {data &&
packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-141-                    (difference && difference > 0 ? '+' : '') +
packages/desktop-client/src/components/reports/reports/SpendingCard.tsx:142:                      format(difference || 0, 'financial')}
packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-143-                </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/SpendingCard.tsx-144-              </Block>
--
packages/desktop-client/src/components/reports/reports/Summary.tsx-459-                >
packages/desktop-client/src/components/reports/reports/Summary.tsx-460-                  <PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Summary.tsx:461:                    {format(data?.dividend ?? 0, 'financial')}
packages/desktop-client/src/components/reports/reports/Summary.tsx-462-                  </PrivacyFilter>
packages/desktop-client/src/components/reports/reports/Summary.tsx-463-                </Text>
--
packages/desktop-client/src/components/reports/ReportSummary.js-71-        <text_1.Text style={__assign(__assign({}, styles_1.styles.veryLargeText), { alignItems: 'center', marginBottom: 2, fontWeight: 800 })}>
packages/desktop-client/src/components/reports/ReportSummary.js-72-          <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.js:73:            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/reports/ReportSummary.js-74-          </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.js-75-        </text_1.Text>
--
packages/desktop-client/src/components/reports/ReportSummary.js-94-        <text_1.Text style={__assign(__assign({}, styles_1.styles.veryLargeText), { alignItems: 'center', marginBottom: 2, fontWeight: 800 })}>
packages/desktop-client/src/components/reports/ReportSummary.js-95-          <PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.js:96:            {!isNaN(average) && format(average, 'financial')}
packages/desktop-client/src/components/reports/ReportSummary.js-97-          </PrivacyFilter_1.PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.js-98-        </text_1.Text>
--
packages/desktop-client/src/components/reports/ReportSummary.tsx-127-        >
packages/desktop-client/src/components/reports/ReportSummary.tsx-128-          <PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.tsx:129:            {format(data[balanceTypeOp], 'financial')}
packages/desktop-client/src/components/reports/ReportSummary.tsx-130-          </PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.tsx-131-        </Text>
--
packages/desktop-client/src/components/reports/ReportSummary.tsx-166-        >
packages/desktop-client/src/components/reports/ReportSummary.tsx-167-          <PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.tsx:168:            {!isNaN(average) && format(average, 'financial')}
packages/desktop-client/src/components/reports/ReportSummary.tsx-169-          </PrivacyFilter>
packages/desktop-client/src/components/reports/ReportSummary.tsx-170-        </Text>
--
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-217-          </div>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-218-          <div style={{ lineHeight: 1.5 }}>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:219:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Income:')} right={format(income, 'financial')}/>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:220:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Expenses:')} right={format(expense, 'financial')}/>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:221:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Change:')} right={<strong>{format(income + expense, 'financial')}</strong>}/>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:222:            {creditTransfers + debitTransfers !== 0 && (<aligned_text_1.AlignedText left={(0, i18next_1.t)('Transfers:')} right={format(creditTransfers + debitTransfers, 'financial')}/>)}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js:223:            <aligned_text_1.AlignedText left={(0, i18next_1.t)('Balance:')} right={format(balance, 'financial')}/>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-224-          </div>
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.js-225-        </div>);
--
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-222-            <AlignedText
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-223-              left={t('Income:')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:224:              right={format(income, 'financial')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-225-            />
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-226-            <AlignedText
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-227-              left={t('Expenses:')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:228:              right={format(expense, 'financial')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-229-            />
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-230-            <AlignedText
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-231-              left={t('Change:')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:232:              right={<strong>{format(income + expense, 'financial')}</strong>}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-233-            />
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-234-            {creditTransfers + debitTransfers !== 0 && (
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-235-              <AlignedText
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-236-                left={t('Transfers:')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:237:                right={format(creditTransfers + debitTransfers, 'financial')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-238-              />
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-239-            )}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-240-            <AlignedText
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-241-              left={t('Balance:')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx:242:              right={format(balance, 'financial')}
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-243-            />
packages/desktop-client/src/components/reports/spreadsheets/cash-flow-spreadsheet.tsx-244-          </div>
--
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-229-            x: d.format(x, displayFormat, { locale: locale }),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-230-            y: total,
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:231:            assets: format(assets, 'financial'),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:232:            debt: "-".concat(format(debt, 'financial')),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:233:            change: format(change, 'financial'),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js:234:            networth: format(total, 'financial'),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-235-            date: d.format(x, tooltipFormat, { locale: locale }),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.js-236-        };
--
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-252-      x: d.format(x, displayFormat, { locale }),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-253-      y: total,
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:254:      assets: format(assets, 'financial'),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:255:      debt: `-${format(debt, 'financial')}`,
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:256:      change: format(change, 'financial'),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts:257:      networth: format(total, 'financial'),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-258-      date: d.format(x, tooltipFormat, { locale }),
packages/desktop-client/src/components/reports/spreadsheets/net-worth-spreadsheet.ts-259-    };
--
packages/desktop-client/src/components/rules/RuleEditor.js-237-function formatAmount(amount, format) {
packages/desktop-client/src/components/rules/RuleEditor.js-238-    if (!amount) {
packages/desktop-client/src/components/rules/RuleEditor.js:239:        return format(0, 'financial');
packages/desktop-client/src/components/rules/RuleEditor.js-240-    }
packages/desktop-client/src/components/rules/RuleEditor.js-241-    else if (typeof amount === 'number') {
packages/desktop-client/src/components/rules/RuleEditor.js:242:        return format(amount, 'financial');
packages/desktop-client/src/components/rules/RuleEditor.js-243-    }
packages/desktop-client/src/components/rules/RuleEditor.js-244-    else {
packages/desktop-client/src/components/rules/RuleEditor.js:245:        return "".concat(format(amount.num1, 'financial'), " to ").concat(format(amount.num2, 'financial'));
packages/desktop-client/src/components/rules/RuleEditor.js-246-    }
packages/desktop-client/src/components/rules/RuleEditor.js-247-}
--
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-237-function formatAmount(amount, format) {
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-238-    if (!amount) {
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo:239:        return format(0, 'financial');
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-240-    }
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-241-    else if (typeof amount === 'number') {
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo:242:        return format(amount, 'financial');
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-243-    }
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-244-    else {
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo:245:        return "".concat(format(amount.num1, 'financial'), " to ").concat(format(amount.num2, 'financial'));
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-246-    }
packages/desktop-client/src/components/rules/RuleEditor.js.bak_undo-247-}
--
packages/desktop-client/src/components/rules/RuleEditor.tsx-359-function formatAmount(amount, format) {
packages/desktop-client/src/components/rules/RuleEditor.tsx-360-  if (!amount) {
packages/desktop-client/src/components/rules/RuleEditor.tsx:361:    return format(0, 'financial');
packages/desktop-client/src/components/rules/RuleEditor.tsx-362-  } else if (typeof amount === 'number') {
packages/desktop-client/src/components/rules/RuleEditor.tsx:363:    return format(amount, 'financial');
packages/desktop-client/src/components/rules/RuleEditor.tsx-364-  } else {
packages/desktop-client/src/components/rules/RuleEditor.tsx:365:    return `${format(amount.num1, 'financial')} to ${format(
packages/desktop-client/src/components/rules/RuleEditor.tsx-366-      amount.num2,
packages/desktop-client/src/components/rules/RuleEditor.tsx-367-      'financial',
--
packages/desktop-client/src/components/rules/Value.js-65-            switch (field) {
packages/desktop-client/src/components/rules/Value.js-66-                case 'amount':
packages/desktop-client/src/components/rules/Value.js:67:                    return format(value, 'financial');
packages/desktop-client/src/components/rules/Value.js-68-                case 'date':
packages/desktop-client/src/components/rules/Value.js-69-                    if (value) {
--
packages/desktop-client/src/components/rules/Value.tsx-75-      switch (field) {
packages/desktop-client/src/components/rules/Value.tsx-76-        case 'amount':
packages/desktop-client/src/components/rules/Value.tsx:77:          return format(value, 'financial');
packages/desktop-client/src/components/rules/Value.tsx-78-        case 'date':
packages/desktop-client/src/components/rules/Value.tsx-79-          if (value) {
--
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-87-                case 'amount':
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-88-                    return (<table_1.Field key={i} width={75} style={__assign({ textAlign: 'right' }, styles_1.styles.tnum)}>
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js:89:                {format(transaction.amount, 'financial')}
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-90-              </table_1.Field>);
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.js-91-                default:
--
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-160-                style={{ textAlign: 'right', ...styles.tnum }}
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-161-              >
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx:162:                {format(transaction.amount, 'financial')}
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-163-              </Field>
packages/desktop-client/src/components/transactions/SimpleTransactionsTable.tsx-164-            );
--
packages/desktop-client/src/components/util/AmountInput.js-40-        return isEditing
packages/desktop-client/src/components/util/AmountInput.js-41-            ? format.forEdit(absoluteValue)
packages/desktop-client/src/components/util/AmountInput.js:42:            : format(absoluteValue, 'financial');
packages/desktop-client/src/components/util/AmountInput.js-43-    }, [format]);
packages/desktop-client/src/components/util/AmountInput.js-44-    var _g = (0, react_1.useState)(getDisplayValue(initialValue, false)), value = _g[0], setValue = _g[1];
--
packages/desktop-client/src/components/util/AmountInput.tsx-73-      return isEditing
packages/desktop-client/src/components/util/AmountInput.tsx-74-        ? format.forEdit(absoluteValue)
packages/desktop-client/src/components/util/AmountInput.tsx:75:        : format(absoluteValue, 'financial');
packages/desktop-client/src/components/util/AmountInput.tsx-76-    },
packages/desktop-client/src/components/util/AmountInput.tsx-77-    [format],
