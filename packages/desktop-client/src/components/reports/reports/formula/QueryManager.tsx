import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Input } from '@actual-app/components/input';
import { Select } from '@actual-app/components/select';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import {
  type RuleConditionEntity,
  type TimeFrame,
} from 'loot-core/types/models';

import { AppliedFilters } from '@desktop-client/components/filters/AppliedFilters';
import { FilterButton } from '@desktop-client/components/filters/FiltersMenu';
import { useRuleConditionFilters } from '@desktop-client/hooks/useRuleConditionFilters';

type QueryConfig = {
  conditions?: RuleConditionEntity[];
  conditionsOp?: 'and' | 'or';
  timeFrame?: TimeFrame;
};

type QueryManagerProps = {
  queries: Record<string, QueryConfig>;
  onQueriesChange: (queries: Record<string, QueryConfig>) => void;
};

export function QueryManager({ queries, onQueriesChange }: QueryManagerProps) {
  const { t } = useTranslation();
  const [newQueryName, setNewQueryName] = useState('');
  const [isAddingQuery, setIsAddingQuery] = useState(false);

  function handleAddQuery() {
    if (!newQueryName.trim()) return;

    if (queries[newQueryName]) {
      alert(t('Query with this name already exists'));
      return;
    }

    onQueriesChange({
      ...queries,
      [newQueryName]: {
        conditions: [],
        conditionsOp: 'and',
        timeFrame: {
          start: '',
          end: '',
          mode: 'full',
        },
      },
    });

    setNewQueryName('');
    setIsAddingQuery(false);
  }

  function handleRemoveQuery(queryName: string) {
    const newQueries = { ...queries };
    delete newQueries[queryName];
    onQueriesChange(newQueries);
  }

  function handleUpdateQuery(queryName: string, config: QueryConfig) {
    onQueriesChange({
      ...queries,
      [queryName]: config,
    });
  }

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          <Trans>Query Definitions</Trans>
        </Text>
        <Button
          variant="primary"
          onPress={() => setIsAddingQuery(!isAddingQuery)}
        >
          {isAddingQuery ? <Trans>Cancel</Trans> : <Trans>Add Query</Trans>}
        </Button>
      </View>

      {isAddingQuery && (
        <View
          style={{
            padding: 16,
            border: `1px solid ${theme.tableBorder}`,
            borderRadius: 4,
            marginBottom: 16,
            backgroundColor: theme.tableBackground,
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Input
              placeholder={t('Query name (e.g., ‘expenses’, ‘income’)')}
              value={newQueryName}
              onChange={e => setNewQueryName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleAddQuery();
                }
              }}
              style={{ flex: 1 }}
            />
            <Button variant="primary" onPress={handleAddQuery}>
              <Trans>Create</Trans>
            </Button>
          </View>
        </View>
      )}

      {Object.entries(queries).length === 0 ? (
        <View
          style={{
            padding: 32,
            textAlign: 'center',
            color: theme.pageTextSubdued,
            border: `1px dashed ${theme.tableBorder}`,
            borderRadius: 4,
            maxWidth: 400,
          }}
        >
          <Text>
            <Trans>
              No queries defined. Click ‘Add Query’ to create your first query.
            </Trans>
          </Text>
          <Text style={{ fontSize: 12, marginTop: 8 }}>
            <Trans>
              Queries allow you to reference filtered transaction data in your
              formulas using QUERY(‘queryName’)
            </Trans>
          </Text>
        </View>
      ) : (
        <View style={{ display: 'block' }}>
          {Object.entries(queries).map(([queryName, config]) => (
            <QueryItem
              key={queryName}
              queryName={queryName}
              defaultConfig={config}
              onUpdate={newConfig => handleUpdateQuery(queryName, newConfig)}
              onRemove={() => handleRemoveQuery(queryName)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

type QueryItemProps = {
  queryName: string;
  defaultConfig: QueryConfig;
  onUpdate: (config: QueryConfig) => void;
  onRemove: () => void;
};

function QueryItem({
  queryName,
  defaultConfig,
  onUpdate,
  onRemove,
}: QueryItemProps) {
  const { t } = useTranslation();

  const timeRangeRef = useRef<string>(defaultConfig.timeFrame?.mode || 'full');
  const conditionsRef = useRef<RuleConditionEntity[]>(
    defaultConfig.conditions || [],
  );
  const conditionsOpRef = useRef<'and' | 'or' | ''>(
    defaultConfig.conditionsOp || '',
  );

  useEffect(() => {
    if (conditionsRef.current.length === 0) {
      conditionsRef.current = defaultConfig.conditions || [];
    }

    if (conditionsOpRef.current === '') {
      conditionsOpRef.current = defaultConfig.conditionsOp || 'and';
    }
  }, [defaultConfig]);

  const filters = useRuleConditionFilters(
    conditionsRef.current,
    conditionsOpRef.current as 'and' | 'or',
  );

  const prevFiltersRef = useRef<{
    conditions: RuleConditionEntity[];
    conditionsOp: 'and' | 'or';
  }>({
    conditions: filters.conditions,
    conditionsOp: filters.conditionsOp,
  });

  const sendUpdate = useCallback(
    (conditions = filters.conditions, conditionsOp = filters.conditionsOp) => {
      onUpdate({
        conditions,
        conditionsOp,
        timeFrame: {
          start: '',
          end: '',
          mode: timeRangeRef.current as TimeFrame['mode'],
        },
      });
    },
    [filters.conditions, filters.conditionsOp, timeRangeRef, onUpdate],
  );

  useEffect(() => {
    const prev = prevFiltersRef.current;
    const conditionsChanged =
      JSON.stringify(prev.conditions) !== JSON.stringify(filters.conditions);
    const conditionsOpChanged = prev.conditionsOp !== filters.conditionsOp;

    if (conditionsChanged || conditionsOpChanged) {
      prevFiltersRef.current = {
        conditions: filters.conditions,
        conditionsOp: filters.conditionsOp,
      };
      sendUpdate();
    }
  }, [filters.conditions, filters.conditionsOp, sendUpdate]);

  const timeRangeOptions: Array<[string, string]> = [
    ['full', t('All time')],
    ['lastYear', t('Last year')],
    ['yearToDate', t('Year to date')],
    ['priorYearToDate', t('Prior year to date')],
    ['last12Months', t('Last 12 months')],
    ['last6Months', t('Last 6 months')],
    ['last3Months', t('Last 3 months')],
    ['lastMonth', t('Last month')],
    ['thisMonth', t('This month')],
  ];

  function handleTimeRangeChange(newMode: string) {
    timeRangeRef.current = newMode;
    setTimeout(() => sendUpdate(), 0);
  }

  return (
    <View
      style={{
        padding: 16,
        marginBottom: 16,
        border: `1px solid ${theme.tableBorder}`,
        borderRadius: 4,
        backgroundColor: theme.tableBackground,
        display: 'block',
        flex: 1,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: 600, fontFamily: 'monospace' }}>
            <Trans>QUERY(‘{queryName}’)</Trans>
          </Text>
          <Text style={{ color: theme.pageTextSubdued, fontSize: 12 }}>
            {filters.conditions.length === 0
              ? t('All transactions')
              : t('{{count}} filter(s)', { count: filters.conditions.length })}
          </Text>
        </View>
        <Button variant="bare" onPress={onRemove} style={{ marginBottom: 8 }}>
          <Trans>Remove</Trans>
        </Button>
      </View>

      <View style={{ marginBottom: 12 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: theme.pageTextSubdued,
            }}
          >
            <Trans>Time range:</Trans>
          </Text>
        </View>
        <Select
          value={timeRangeRef.current as TimeFrame['mode']}
          onChange={handleTimeRangeChange}
          options={timeRangeOptions}
          style={{ width: '100%' }}
        />
      </View>

      <View style={{ marginBottom: 8, flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 500,
            marginBottom: 6,
            color: theme.pageTextSubdued,
          }}
        >
          <Trans>Filters:</Trans>
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            maxWidth: 400,
            flex: 1,
          }}
        >
          {filters.conditions.length > 0 && (
            <AppliedFilters
              conditions={filters.conditions}
              onUpdate={filters.onUpdate}
              onDelete={filters.onDelete}
              conditionsOp={filters.conditionsOp}
              onConditionsOpChange={filters.onConditionsOpChange}
            />
          )}
          <FilterButton
            compact={false}
            onApply={filters.onApply}
            hover={false}
            exclude={undefined}
          />
        </View>
      </View>
    </View>
  );
}
