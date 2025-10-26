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
