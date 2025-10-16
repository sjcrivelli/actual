import { useState, useEffect } from 'react';

import { HyperFormula } from 'hyperformula';

import { send } from 'loot-core/platform/client/fetch';
import * as monthUtils from 'loot-core/shared/months';
import { q } from 'loot-core/shared/query';
import {
  type RuleConditionEntity,
  type TimeFrame,
} from 'loot-core/types/models';

import { useLocale } from './useLocale';

type QueryConfig = {
  conditions?: RuleConditionEntity[];
  conditionsOp?: 'and' | 'or';
  timeFrame?: TimeFrame;
};

type QueriesMap = Record<string, QueryConfig>;

export function useFormulaExecution(
  formula: string,
  queries: QueriesMap,
  queriesVersion?: number,
) {
  const locale = useLocale();
  const [result, setResult] = useState<number | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function executeFormula() {
      if (!formula || !formula.startsWith('=')) {
        setResult(null);
        setError('Formula must start with =');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Extract QUERY() function calls
        const queryMatches = Array.from(
          formula.matchAll(/QUERY\s*\(\s*["']([^"']+)["']\s*\)/gi),
        );

        // Fetch data for each query
        const queryData: Record<string, number> = {};

        for (const match of queryMatches) {
          const queryName = match[1];
          const queryConfig = queries[queryName];

          if (!queryConfig) {
            console.warn(`Query “${queryName}” not found in queries config`);
            queryData[queryName] = 0;
            continue;
          }

          // Fetch the actual transaction data based on the query config
          // For now, we'll use a simplified approach
          // In a real implementation, this would call a backend API
          const data = await fetchQueryData(queryConfig);
          queryData[queryName] = data;
        }

        // Replace QUERY() calls with actual values in the formula
        let processedFormula = formula;
        for (const [queryName, value] of Object.entries(queryData)) {
          const regex = new RegExp(
            `QUERY\\s*\\(\\s*["']${queryName}["']\\s*\\)`,
            'gi',
          );
          processedFormula = processedFormula.replace(regex, String(value));
        }

        // Create HyperFormula instance
        const hfInstance = HyperFormula.buildEmpty({
          licenseKey: 'gpl-v3',
          localeLang: typeof locale === 'string' ? locale : 'en-US',
        });

        // Add a sheet and set the formula in cell A1
        const sheetName = hfInstance.addSheet('Sheet1');
        const sheetId = hfInstance.getSheetId(sheetName);

        if (sheetId === undefined) {
          throw new Error('Failed to create sheet');
        }

        // Set the formula
        hfInstance.setCellContents({ sheet: sheetId, col: 0, row: 0 }, [
          [processedFormula],
        ]);

        // Get the result
        const cellValue = hfInstance.getCellValue({
          sheet: sheetId,
          col: 0,
          row: 0,
        });

        if (cancelled) return;

        // Check if there's an error
        if (cellValue && typeof cellValue === 'object' && 'type' in cellValue) {
          setError(`Formula error: ${cellValue.type}`);
          setResult(null);
        } else {
          setResult(cellValue as number | string);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Formula execution error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setResult(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    executeFormula();

    return () => {
      cancelled = true;
    };
  }, [formula, queriesVersion, locale, queries]);

  return { result, isLoading, error };
}

// Helper function to calculate date range based on time frame mode
function getDateRangeForMode(
  mode: string,
): { start: string; end: string } | null {
  const today = monthUtils.currentDay();
  const currentMonth = monthUtils.currentMonth();

  switch (mode) {
    case 'full':
      return null; // No date filtering

    case 'thisMonth':
      return {
        start: monthUtils.firstDayOfMonth(currentMonth),
        end: monthUtils.lastDayOfMonth(currentMonth),
      };

    case 'lastMonth': {
      const lastMonth = monthUtils.subMonths(currentMonth, 1);
      return {
        start: monthUtils.firstDayOfMonth(lastMonth),
        end: monthUtils.lastDayOfMonth(lastMonth),
      };
    }

    case 'last3Months':
      return {
        start: monthUtils.firstDayOfMonth(
          monthUtils.subMonths(currentMonth, 2),
        ),
        end: monthUtils.lastDayOfMonth(currentMonth),
      };

    case 'last6Months':
      return {
        start: monthUtils.firstDayOfMonth(
          monthUtils.subMonths(currentMonth, 5),
        ),
        end: monthUtils.lastDayOfMonth(currentMonth),
      };

    case 'last12Months':
      return {
        start: monthUtils.firstDayOfMonth(
          monthUtils.subMonths(currentMonth, 11),
        ),
        end: monthUtils.lastDayOfMonth(currentMonth),
      };

    case 'yearToDate': {
      const year = parseInt(currentMonth.slice(0, 4));
      const yearStart = `${year}-01`;
      return {
        start: monthUtils.firstDayOfMonth(yearStart),
        end: today,
      };
    }

    case 'lastYear': {
      const year = parseInt(currentMonth.slice(0, 4)) - 1;
      const yearStart = `${year}-01`;
      const yearEnd = `${year}-12`;
      return {
        start: monthUtils.firstDayOfMonth(yearStart),
        end: monthUtils.lastDayOfMonth(yearEnd),
      };
    }

    case 'priorYearToDate': {
      const year = parseInt(currentMonth.slice(0, 4)) - 1;
      const yearStart = `${year}-01`;
      const priorYearMonth = `${year}-${currentMonth.slice(5, 7)}`;
      return {
        start: monthUtils.firstDayOfMonth(yearStart),
        end: monthUtils.lastDayOfMonth(priorYearMonth),
      };
    }

    case 'sliding-window':
    case 'static':
      // These require actual start/end dates in the timeFrame
      return null;

    default:
      return null;
  }
}

// Helper function to fetch query data
async function fetchQueryData(config: QueryConfig): Promise<number> {
  try {
    const conditions = config.conditions || [];
    const conditionsOp = config.conditionsOp || 'and';
    const timeFrame = config.timeFrame;

    // Convert conditions to query filters
    const { filters: queryFilters } = await send(
      'make-filters-from-conditions',
      {
        conditions,
      },
    );

    const conditionsOpKey = conditionsOp === 'or' ? '$or' : '$and';

    // Start building the query
    let transQuery = q('transactions');

    // Add date range filter if provided
    if (timeFrame && timeFrame.mode) {
      const dateRange = getDateRangeForMode(timeFrame.mode);

      if (dateRange) {
        transQuery = transQuery.filter({
          $and: [
            { date: { $gte: dateRange.start } },
            { date: { $lte: dateRange.end } },
          ],
        });
      }
    }

    // Add user-defined filters
    if (queryFilters.length > 0) {
      transQuery = transQuery.filter({ [conditionsOpKey]: queryFilters });
    }

    // Calculate sum
    transQuery = transQuery.calculate({ $sum: '$amount' });

    const { data } = await send('query', transQuery.serialize());
    return data || 0;
  } catch (err) {
    console.error('Error fetching query data:', err);
    return 0;
  }
}
