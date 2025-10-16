import { useState, useEffect } from 'react';

import { HyperFormula } from 'hyperformula';

import { useLocale } from './useLocale';

type TransactionContext = {
  amount?: number;
  date?: string;
  notes?: string;
  imported_payee?: string;
  account?: string;
  category?: string;
  payee?: string;
  cleared?: boolean;
  reconciled?: boolean;
  [key: string]: string | number | boolean | undefined;
};

export function useTransactionFormulaExecution(
  formula: string,
  transaction: TransactionContext,
) {
  const locale = useLocale();
  const [result, setResult] = useState<number | string | boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function executeFormula() {
      if (!formula || !formula.startsWith('=')) {
        setResult(null);
        setError('Formula must start with =');
        return;
      }

      try {
        // Create HyperFormula instance
        const hfInstance = HyperFormula.buildEmpty({
          licenseKey: 'gpl-v3',
          localeLang: typeof locale === 'string' ? locale : 'en-US',
        });

        // Add a sheet
        const sheetName = hfInstance.addSheet('Sheet1');
        const sheetId = hfInstance.getSheetId(sheetName);

        if (sheetId === undefined) {
          throw new Error('Failed to create sheet');
        }

        // Add named ranges for each transaction field
        let row = 1;
        const fieldValues: Record<string, number | string | boolean> = {
          today: new Date().toISOString().split('T')[0],
          ...transaction,
        };

        for (const [key, value] of Object.entries(fieldValues)) {
          if (value !== undefined && value !== null) {
            // Set the value in a cell
            hfInstance.setCellContents({ sheet: sheetId, col: 0, row }, [
              [value],
            ]);

            // Create a named range for this field
            hfInstance.addNamedExpression(
              key,
              `=Sheet1!$A$${row + 1}`, // +1 because HyperFormula uses 0-based rows but formulas use 1-based
            );

            row++;
          }
        }

        // Set the formula in row 0
        hfInstance.setCellContents({ sheet: sheetId, col: 0, row: 0 }, [
          [formula],
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
          setResult(cellValue as number | string | boolean);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Formula execution error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setResult(null);
      }
    }

    executeFormula();

    return () => {
      cancelled = true;
    };
  }, [formula, transaction, locale]);

  return { result, error };
}

// Synchronous version for server-side use
export function executeTransactionFormula(
  formula: string,
  transaction: TransactionContext,
  locale = 'en-US',
): number | string | boolean | null {
  if (!formula || !formula.startsWith('=')) {
    throw new Error('Formula must start with =');
  }

  try {
    const hfInstance = HyperFormula.buildEmpty({
      licenseKey: 'gpl-v3',
      localeLang: locale,
    });

    const sheetName = hfInstance.addSheet('Sheet1');
    const sheetId = hfInstance.getSheetId(sheetName);

    if (sheetId === undefined) {
      throw new Error('Failed to create sheet');
    }

    // Add named ranges for each transaction field
    let row = 1;
    const fieldValues: Record<string, number | string | boolean> = {
      today: new Date().toISOString().split('T')[0],
      ...transaction,
    };

    for (const [key, value] of Object.entries(fieldValues)) {
      if (value !== undefined && value !== null) {
        hfInstance.setCellContents({ sheet: sheetId, col: 0, row }, [[value]]);
        hfInstance.addNamedExpression(key, `=Sheet1!$A$${row + 1}`);
        row++;
      }
    }

    // Set the formula
    hfInstance.setCellContents({ sheet: sheetId, col: 0, row: 0 }, [[formula]]);

    // Get the result
    const cellValue = hfInstance.getCellValue({
      sheet: sheetId,
      col: 0,
      row: 0,
    });

    // Check if there's an error
    if (cellValue && typeof cellValue === 'object' && 'type' in cellValue) {
      throw new Error(`Formula error: ${cellValue.type}`);
    }

    return cellValue as number | string | boolean;
  } catch (err) {
    console.error('Formula execution error:', err);
    throw err;
  }
}
