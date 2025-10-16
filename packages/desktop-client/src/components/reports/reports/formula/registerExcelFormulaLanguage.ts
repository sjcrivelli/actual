/* eslint-disable actual/typography */
import { t } from 'i18next';
import { type IDisposable } from 'monaco-editor';
import type * as monacoEditor from 'monaco-editor';

import { queryModeFunctions } from './queryModeFunctions';
import { transactionModeFunctions } from './transactionModeFunctions';

type FormulaMode = 'query' | 'transaction';

type MonacoEditor = typeof monacoEditor;

// Keep track of completion providers for each language
const completionProviders: Record<string, IDisposable | null> = {};

// Keep track of hover providers for each language
const hoverProviders: Record<string, IDisposable | null> = {};

function registerCompletionProvider(
  monaco: MonacoEditor,
  languageId: string,
  mode: FormulaMode,
  queries?: Record<string, unknown>,
) {
  if (!monaco) {
    return;
  }

  // Dispose old provider if it exists
  if (completionProviders[languageId]) {
    completionProviders[languageId]?.dispose();
  }

  // Register new provider
  completionProviders[languageId] =
    monaco.languages.registerCompletionItemProvider(languageId, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: monacoEditor.languages.CompletionItem[] = [];

        // Transaction field variables (for rule templating)
        if (mode === 'transaction') {
          suggestions.push(
            {
              label: 'amount',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Transaction amount in cents. Use for calculations and comparisons.\n\nExample: `=amount / 100` to get dollar value',
                ),
              },
              insertText: 'amount',
              range,
            },
            {
              label: 'date',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Transaction date in YYYY-MM-DD format. Use with date functions.\n\nExample: `=TEXT(date, "MMMM" ")` to get month name',
                ),
              },
              insertText: 'date',
              range,
            },
            {
              label: 'notes',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Transaction notes/memo text. Use for string operations.\n\nExample: `=UPPER(notes)` to convert to uppercase',
                ),
              },
              insertText: 'notes',
              range,
            },
            {
              label: 'imported_payee',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Original imported payee name from bank import. Contains the raw text before matching.\n\nExample: `=LEFT(imported_payee, 10)` to get first 10 characters',
                ),
              },
              insertText: 'imported_payee',
              range,
            },
            {
              label: 'payee',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Payee name (string). The human-readable name of the payee.\n\nExample: `=UPPER(payee)` or `=CONCATENATE(“Payment to ”, payee)`',
                ),
              },
              insertText: 'payee',
              range,
            },
            {
              label: 'account',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Account name (string). The human-readable name of the account.\n\nExample: `=CONCATENATE(“Paid from ”, account)`',
                ),
              },
              insertText: 'account',
              range,
            },
            {
              label: 'category',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Category name (string). The human-readable name of the category.\n\nExample: `=IF(category="Groceries", "Food", "Other")`',
                ),
              },
              insertText: 'category',
              range,
            },
            {
              label: 'cleared',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Boolean cleared status. TRUE if transaction is cleared, FALSE otherwise.\n\nExample: `=IF(cleared, “Cleared”, “Pending”)`',
                ),
              },
              insertText: 'cleared',
              range,
            },
            {
              label: 'reconciled',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Boolean reconciled status. TRUE if transaction is reconciled, FALSE otherwise.',
                ),
              },
              insertText: 'reconciled',
              range,
            },
            {
              label: 'today',
              kind: monaco.languages.CompletionItemKind.Variable,
              documentation: {
                value: t(
                  'Current date in YYYY-MM-DD format. Automatically updated.\n\nExample: `=today` to use current date',
                ),
              },
              insertText: 'today',
              range,
            },
          );
        }

        // Add function suggestions based on mode
        const functionList =
          mode === 'query' ? queryModeFunctions : transactionModeFunctions;
        functionList.forEach(func => {
          suggestions.push({
            ...func,
            kind: monaco.languages.CompletionItemKind.Function,
            range,
          });
        });

        // Query function (only for query mode)
        if (mode === 'query') {
          debugger;
          // Add individual suggestions for each defined query
          if (queries && Object.keys(queries).length > 0) {
            Object.keys(queries).forEach(queryName => {
              suggestions.push({
                label: `QUERY("${queryName}")`,
                kind: monaco.languages.CompletionItemKind.Function,
                documentation: {
                  value: t(
                    // eslint-disable-next-line no-template-curly-in-string
                    '**QUERY("${queryName}")**\n\nRetrieves aggregated transaction data from the "${queryName}" query.\n\n**Returns:** Sum of transaction amounts matching the query filters',
                  ),
                },
                insertText: `QUERY("${queryName}")`,
                sortText: `0_${queryName}`, // Sort defined queries first
                range,
              });
            });
          }

          // Also add generic QUERY function for manual typing
          suggestions.push({
            // eslint-disable-next-line no-template-curly-in-string
            label: 'QUERY("${1:queryName}")',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: {
              value: t(
                '**QUERY("queryName")**\n\nRetrieves aggregated transaction data based on a named query.\n\n**Parameters:**\n- `queryName` (required): Name of the query defined in Query Manager\n\n**Returns:** Sum of transaction amounts matching the query filters\n\n**Example:**\n```\n=QUERY("expenses")\n=QUERY("income") - QUERY("expenses")\n```',
              ),
            },
            // eslint-disable-next-line no-template-curly-in-string
            insertText: 'QUERY("${1:queryName}")',
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            sortText: '1_QUERY', // Sort generic QUERY after defined queries
            range,
          });
        }

        return { suggestions };
      },
    });
}

function registerHoverProvider(
  monaco: MonacoEditor,
  languageId: string,
  mode: FormulaMode,
  queries?: Record<string, unknown>,
) {
  if (!monaco) {
    return;
  }

  // Dispose old provider if it exists
  if (hoverProviders[languageId]) {
    hoverProviders[languageId]?.dispose();
  }

  // Create a map of function names to their documentation for quick lookup
  const functionList =
    mode === 'query' ? queryModeFunctions : transactionModeFunctions;
  const functionMap = new Map<string, string>();

  functionList.forEach(func => {
    const labelText =
      typeof func.label === 'string' ? func.label : func.label.label;
    const funcName = labelText.toUpperCase();
    functionMap.set(
      funcName,
      typeof func.documentation === 'string'
        ? func.documentation
        : func.documentation?.value || '',
    );
  });

  // Add transaction field variables to the map for transaction mode
  if (mode === 'transaction') {
    functionMap.set(
      'AMOUNT',
      t(
        'Transaction amount in cents. Use for calculations and comparisons.\n\nExample: `=amount / 100` to get dollar value',
      ),
    );
    functionMap.set(
      'DATE',
      t(
        'Transaction date in YYYY-MM-DD format. Use with date functions.\n\nExample: `=TEXT(date, "MMMM")` to get month name',
      ),
    );
    functionMap.set(
      'NOTES',
      t(
        'Transaction notes/memo text. Use for string operations.\n\nExample: `=UPPER(notes)` to convert to uppercase',
      ),
    );
    functionMap.set(
      'IMPORTED_PAYEE',
      t(
        'Original imported payee name from bank import. Contains the raw text before matching.\n\nExample: `=LEFT(imported_payee, 10)` to get first 10 characters',
      ),
    );
    functionMap.set(
      'PAYEE',
      t(
        'Payee name (string). The human-readable name of the payee.\n\nExample: `=UPPER(payee)` or `=CONCATENATE("Payment to ", payee)`',
      ),
    );
    functionMap.set(
      'ACCOUNT',
      t(
        'Account name (string). The human-readable name of the account.\n\nExample: `=CONCATENATE("Paid from ", account)`',
      ),
    );
    functionMap.set(
      'CATEGORY',
      t(
        'Category name (string). The human-readable name of the category.\n\nExample: `=IF(category="Groceries", "Food", "Other")`',
      ),
    );
    functionMap.set(
      'CLEARED',
      t(
        'Boolean cleared status. TRUE if transaction is cleared, FALSE otherwise.\n\nExample: `=IF(cleared, "Cleared", "Pending")`',
      ),
    );
    functionMap.set(
      'RECONCILED',
      t(
        'Boolean reconciled status. TRUE if transaction is reconciled, FALSE otherwise.',
      ),
    );
    functionMap.set(
      'TODAY',
      t(
        'Current date in YYYY-MM-DD format. Automatically updated.\n\nExample: `=today` to use current date',
      ),
    );
  }

  // Add QUERY function for query mode
  if (mode === 'query') {
    functionMap.set(
      'QUERY',
      t(
        '**QUERY("queryName")**\n\nRetrieves aggregated transaction data based on a named query.\n\n**Parameters:**\n- `queryName` (required): Name of the query defined in Query Manager\n\n**Returns:** Sum of transaction amounts matching the query filters\n\n**Example:**\n```\n=QUERY("expenses")\n=QUERY("income") - QUERY("expenses")\n```',
      ),
    );
  }

  // Register hover provider
  hoverProviders[languageId] = monaco.languages.registerHoverProvider(
    languageId,
    {
      provideHover: (model, position) => {
        // Get the word at the current position
        const word = model.getWordAtPosition(position);
        if (!word) {
          return null;
        }

        const wordUpper = word.word.toUpperCase();

        // Check if it's a known function or variable
        const documentation = functionMap.get(wordUpper);
        if (documentation) {
          return {
            range: new monaco.Range(
              position.lineNumber,
              word.startColumn,
              position.lineNumber,
              word.endColumn,
            ),
            contents: [{ value: `**${wordUpper}**` }, { value: documentation }],
          };
        }

        // Check for QUERY function with specific query name in query mode
        if (mode === 'query' && queries) {
          // Check if we're hovering over a QUERY function call
          const lineContent = model.getLineContent(position.lineNumber);
          const queryMatch = lineContent.match(/QUERY\s*\(\s*"([^"]+)"\s*\)/i);

          if (
            queryMatch &&
            Object.prototype.hasOwnProperty.call(queries, queryMatch[1])
          ) {
            const queryName = queryMatch[1];
            return {
              range: new monaco.Range(
                position.lineNumber,
                word.startColumn,
                position.lineNumber,
                word.endColumn,
              ),
              contents: [
                { value: `**QUERY("${queryName}")**` },
                {
                  value: t(
                    `Retrieves aggregated transaction data from the {{queryName}} query.\n\n**Returns:** Sum of transaction amounts matching the query filters`,
                  ),
                  arguments: {
                    queryName,
                  },
                },
              ],
            };
          }
        }

        return null;
      },
    },
  );
}

export function updateCompletionProvider(
  monaco: MonacoEditor,
  mode: FormulaMode,
  queries: Record<string, unknown>,
) {
  const languageId = `excelFormula-${mode}`;
  if (!monaco) {
    return;
  }

  registerCompletionProvider(monaco, languageId, mode, queries);
  registerHoverProvider(monaco, languageId, mode, queries);
}

export function registerExcelFormulaLanguage(
  monaco: MonacoEditor,
  mode: FormulaMode = 'query',
): string {
  const languageId = `excelFormula-${mode}`;
  if (!monaco) {
    return languageId;
  }

  // Check if language is already registered
  const languages = monaco.languages.getLanguages();
  if (languages.some(lang => lang.id === languageId)) {
    return languageId;
  }

  // Register a new language
  monaco.languages.register({ id: languageId });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider(languageId, {
    tokenizer: {
      root: [
        // Formula start
        [/^=/, 'keyword'],

        // Math and Trigonometry Functions (Blue)
        [
          /\b(SUM|SUMIF|SUMIFS|SUMPRODUCT|SUMSQ|AVERAGE|AVERAGEA|COUNT|COUNTA|COUNTBLANK|COUNTIF|COUNTIFS|MAX|MAXA|MIN|MINA|ABS|ROUND|ROUNDDOWN|ROUNDUP|FLOOR|CEILING|INT|TRUNC|MOD|POWER|SQRT|SIGN|PRODUCT|PI|SIN|COS|TAN|LN|LOG|LOG10|EXP)\b/,
          'function.math',
        ],

        // Date and Time Functions (Purple)
        [
          /\b(DATE|TODAY|NOW|YEAR|MONTH|DAY|WEEKDAY|EDATE|EOMONTH|DAYS|DATEDIF|DATEVALUE|WEEKNUM|ISOWEEKNUM|NETWORKDAYS)\b/,
          'function.date',
        ],

        // Text Functions (Orange)
        [
          /\b(CONCATENATE|UPPER|LOWER|PROPER|LEFT|RIGHT|MID|LEN|TRIM|SUBSTITUTE|REPLACE|FIND|SEARCH|TEXT|REPT|CHAR|CODE|EXACT|CLEAN|SPLIT)\b/,
          'function.text',
        ],

        // Logical Functions (Green)
        [
          /\b(IF|IFS|AND|OR|XOR|NOT|TRUE|FALSE|IFERROR|IFNA|SWITCH)\b/,
          'function.logical',
        ],

        // Statistical Functions (Teal)
        [
          /\b(MEDIAN|MODE|STDEV|STDEVP|VAR|VARP|PERCENTILE|QUARTILE|RANK)\b/,
          'function.statistical',
        ],

        // Lookup and Reference Functions (Brown)
        [/\b(VLOOKUP|HLOOKUP|INDEX|MATCH|CHOOSE)\b/, 'function.lookup'],

        // Financial Functions (Dark Green)
        [/\b(PMT|FV|PV|NPV|IRR|RATE)\b/, 'function.financial'],

        // Information Functions (Pink)
        [
          /\b(ISBLANK|ISERROR|ISNA|ISNUMBER|ISTEXT|ISLOGICAL|ISREF|ISEVEN|ISODD)\b/,
          'function.information',
        ],

        // Conversion Functions (Gray)
        [/\b(VALUE|T|N)\b/, 'function.conversion'],

        // Custom Query Function (Magenta)
        [/\b(QUERY)\b/, 'function.query'],

        // Numbers
        [/\d+(\.\d+)?/, 'number'],

        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],

        // Operators
        [/[+\-*/^]/, 'operator'],

        // Parentheses
        [/[()]/, 'delimiter.parenthesis'],

        // Comma
        [/,/, 'delimiter.comma'],

        // Cell references (A1, B2, etc.) - not used but kept for future
        [/\$?[A-Z]+\$?\d+/, 'variable'],

        // Whitespace
        [/\s+/, 'white'],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop'],
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, 'string', '@pop'],
      ],
    },
  });

  // Define light theme with categorized function colors
  monaco.editor.defineTheme('excelFormulaLight', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'ff0000', fontStyle: 'bold' },
      { token: 'function.math', foreground: '0066cc', fontStyle: 'bold' }, // Blue
      { token: 'function.date', foreground: '7c3aed', fontStyle: 'bold' }, // Purple
      { token: 'function.text', foreground: 'ea580c', fontStyle: 'bold' }, // Orange
      { token: 'function.logical', foreground: '16a34a', fontStyle: 'bold' }, // Green
      {
        token: 'function.statistical',
        foreground: '0891b2',
        fontStyle: 'bold',
      }, // Teal
      { token: 'function.lookup', foreground: '92400e', fontStyle: 'bold' }, // Brown
      { token: 'function.financial', foreground: '15803d', fontStyle: 'bold' }, // Dark Green
      {
        token: 'function.information',
        foreground: 'db2777',
        fontStyle: 'bold',
      }, // Pink
      { token: 'function.conversion', foreground: '6b7280', fontStyle: 'bold' }, // Gray
      { token: 'function.query', foreground: 'c026d3', fontStyle: 'bold' }, // Magenta
      { token: 'number', foreground: '098658' },
      { token: 'string', foreground: 'a31515' },
      { token: 'operator', foreground: '000000' },
      { token: 'variable', foreground: '001080' },
    ],
    colors: {},
  });

  // Define dark theme with categorized function colors
  monaco.editor.defineTheme('excelFormulaDark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'ff6b6b', fontStyle: 'bold' },
      { token: 'function.math', foreground: '60a5fa', fontStyle: 'bold' }, // Light Blue
      { token: 'function.date', foreground: 'a78bfa', fontStyle: 'bold' }, // Light Purple
      { token: 'function.text', foreground: 'fb923c', fontStyle: 'bold' }, // Light Orange
      { token: 'function.logical', foreground: '4ade80', fontStyle: 'bold' }, // Light Green
      {
        token: 'function.statistical',
        foreground: '22d3ee',
        fontStyle: 'bold',
      }, // Light Teal
      { token: 'function.lookup', foreground: 'd97706', fontStyle: 'bold' }, // Light Brown
      { token: 'function.financial', foreground: '4ade80', fontStyle: 'bold' }, // Light Dark Green
      {
        token: 'function.information',
        foreground: 'f472b6',
        fontStyle: 'bold',
      }, // Light Pink
      { token: 'function.conversion', foreground: '9ca3af', fontStyle: 'bold' }, // Light Gray
      { token: 'function.query', foreground: 'e879f9', fontStyle: 'bold' }, // Light Magenta
      { token: 'number', foreground: '4ec9b0' },
      { token: 'string', foreground: 'ce9178' },
      { token: 'operator', foreground: 'd4d4d4' },
      { token: 'variable', foreground: '9cdcfe' },
    ],
    colors: {},
  });

  // Register initial auto-completion provider
  registerCompletionProvider(monaco, languageId, mode);

  // Register hover provider for function documentation
  registerHoverProvider(monaco, languageId, mode);

  // Register signature help provider for function parameters
  monaco.languages.registerSignatureHelpProvider(languageId, {
    signatureHelpTriggerCharacters: ['(', ','],
    provideSignatureHelp: () => null,
  });

  return languageId;
}
