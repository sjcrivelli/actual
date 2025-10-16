/* eslint-disable no-template-curly-in-string */
import { t } from 'i18next';
import { type languages } from 'monaco-editor';

export const transactionModeFunctions: Omit<
  languages.CompletionItem,
  'range'
>[] = [
  // Text Functions (most useful for transaction fields)
  {
    label: 'CONCATENATE',
    kind: 1,
    insertText: 'CONCATENATE(${1:text1}, ${2:text2})',
    insertTextRules: 4,
    documentation: t(
      'Combines several text strings into one.\n\nSyntax: CONCATENATE(“Text1”, “Text2”, ...“TextN”)\n\nNote: You can also use the & operator.',
    ),
  },
  {
    label: 'UPPER',
    kind: 1,
    insertText: 'UPPER(${1:text})',
    insertTextRules: 4,
    documentation: t('Converts text to uppercase.\n\nSyntax: UPPER(Text)'),
  },
  {
    label: 'LOWER',
    kind: 1,
    insertText: 'LOWER(${1:text})',
    insertTextRules: 4,
    documentation: t('Converts text to lowercase.\n\nSyntax: LOWER(Text)'),
  },
  {
    label: 'PROPER',
    kind: 1,
    insertText: 'PROPER(${1:text})',
    insertTextRules: 4,
    documentation: t(
      'Capitalizes first letter of each word.\n\nSyntax: PROPER(“Text”)',
    ),
  },
  {
    label: 'LEFT',
    kind: 1,
    insertText: 'LEFT(${1:text}, ${2:num_chars})',
    insertTextRules: 4,
    documentation: t(
      'Returns leftmost characters from text.\n\nExample: LEFT(notes, 10)\n\nSyntax: LEFT(“Text”, Number)',
    ),
  },
  {
    label: 'RIGHT',
    kind: 1,
    insertText: 'RIGHT(${1:text}, ${2:num_chars})',
    insertTextRules: 4,
    documentation: t(
      'Returns rightmost characters from text.\n\nExample: RIGHT(imported_payee, 5)\n\nSyntax: RIGHT(“Text”, Number)',
    ),
  },
  {
    label: 'MID',
    kind: 1,
    insertText: 'MID(${1:text}, ${2:start_pos}, ${3:length})',
    insertTextRules: 4,
    documentation: t(
      'Returns substring from specified position.\n\nExample: MID(notes, 3, 5)\n\nSyntax: MID(Text, Start_position, Length)',
    ),
  },
  {
    label: 'LEN',
    kind: 1,
    insertText: 'LEN(${1:text})',
    insertTextRules: 4,
    documentation: t(
      'Returns length of text.\n\nExample: LEN(payee)\n\nSyntax: LEN(“Text”)',
    ),
  },
  {
    label: 'TRIM',
    kind: 1,
    insertText: 'TRIM(${1:text})',
    insertTextRules: 4,
    documentation: t(
      'Removes extra spaces from text.\n\nExample: TRIM(notes)\n\nSyntax: TRIM(“Text”)',
    ),
  },
  {
    label: 'SUBSTITUTE',
    kind: 1,
    insertText: 'SUBSTITUTE(${1:text}, ${2:old_text}, ${3:new_text})',
    insertTextRules: 4,
    documentation: t(
      'Replaces occurrences of text.\n\nExample: SUBSTITUTE(payee, “Inc.”, “Incorporated”)\n\nSyntax: SUBSTITUTE(Text, Old_text, New_text, [Occurrence])',
    ),
  },
  {
    label: 'REPLACE',
    kind: 1,
    insertText:
      'REPLACE(${1:text}, ${2:start_pos}, ${3:length}, ${4:new_text})',
    insertTextRules: 4,
    documentation: t(
      'Replaces substring at specified position.\n\nSyntax: REPLACE(Text, Start_position, Length, New_text)',
    ),
  },
  {
    label: 'FIND',
    kind: 1,
    insertText: 'FIND(${1:find_text}, ${2:within_text})',
    insertTextRules: 4,
    documentation: t(
      'Finds text within text (case-sensitive).\n\nExample: FIND(“Amazon”, payee)\n\nSyntax: FIND(“Text1”, “Text2”[, Number])',
    ),
  },
  {
    label: 'SEARCH',
    kind: 1,
    insertText: 'SEARCH(${1:search_text}, ${2:text})',
    insertTextRules: 4,
    documentation: t(
      'Finds text within text (case-insensitive, supports wildcards).\n\nExample: SEARCH(“amazon”, payee)\n\nSyntax: SEARCH(Search_string, Text[, Start_position])',
    ),
  },
  {
    label: 'TEXT',
    kind: 1,
    insertText: 'TEXT(${1:value}, ${2:format})',
    insertTextRules: 4,
    documentation: t(
      'Converts number to text with format.\n\nExample: TEXT(amount, “0.00”)\n\nSyntax: TEXT(Number, Format)',
    ),
  },
  {
    label: 'REPT',
    kind: 1,
    insertText: 'REPT(${1:text}, ${2:number})',
    insertTextRules: 4,
    documentation: t(
      'Repeats text specified number of times.\n\nSyntax: REPT(“Text”, Number)',
    ),
  },
  {
    label: 'CHAR',
    kind: 1,
    insertText: 'CHAR(${1:number})',
    insertTextRules: 4,
    documentation: t('Converts number to character.\n\nSyntax: CHAR(Number)'),
  },
  {
    label: 'CODE',
    kind: 1,
    insertText: 'CODE(${1:text})',
    insertTextRules: 4,
    documentation: t(
      'Returns numeric code for first character.\n\nSyntax: CODE(“Text”)',
    ),
  },
  {
    label: 'EXACT',
    kind: 1,
    insertText: 'EXACT(${1:text1}, ${2:text2})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if texts are exactly the same.\n\nSyntax: EXACT(Text, Text)',
    ),
  },
  {
    label: 'CLEAN',
    kind: 1,
    insertText: 'CLEAN(${1:text})',
    insertTextRules: 4,
    documentation: t(
      'Removes non-printable characters from text.\n\nSyntax: CLEAN(“Text”)',
    ),
  },
  {
    label: 'SPLIT',
    kind: 1,
    insertText: 'SPLIT(${1:text}, ${2:index})',
    insertTextRules: 4,
    documentation: t(
      'Splits text by space and returns part at index.\n\nExample: SPLIT(payee, 0) returns first word\n\nSyntax: SPLIT(Text, Index)',
    ),
  },

  // Math Functions (for amount calculations)
  {
    label: 'ABS',
    kind: 1,
    insertText: 'ABS(${1:number})',
    insertTextRules: 4,
    documentation: t(
      'Returns the absolute value of a number.\n\nExample: ABS(amount)\n\nSyntax: ABS(Number)',
    ),
  },
  {
    label: 'ROUND',
    kind: 1,
    insertText: 'ROUND(${1:number}, ${2:decimals})',
    insertTextRules: 4,
    documentation: t(
      'Rounds a number to specified decimals.\n\nExample: ROUND(amount, 2)\n\nSyntax: ROUND(Number, Decimals)',
    ),
  },
  {
    label: 'ROUNDDOWN',
    kind: 1,
    insertText: 'ROUNDDOWN(${1:number}, ${2:decimals})',
    insertTextRules: 4,
    documentation: t(
      'Rounds down to specified decimals.\n\nSyntax: ROUNDDOWN(Number, Decimals)',
    ),
  },
  {
    label: 'ROUNDUP',
    kind: 1,
    insertText: 'ROUNDUP(${1:number}, ${2:decimals})',
    insertTextRules: 4,
    documentation: t(
      'Rounds up to specified decimals.\n\nSyntax: ROUNDUP(Number, Decimals)',
    ),
  },
  {
    label: 'FLOOR',
    kind: 1,
    insertText: 'FLOOR(${1:number}, ${2:significance})',
    insertTextRules: 4,
    documentation: t(
      'Rounds down to nearest multiple of significance.\n\nExample: FLOOR(amount, 100) rounds to nearest hundred\n\nSyntax: FLOOR(Number, Significance)',
    ),
  },
  {
    label: 'CEILING',
    kind: 1,
    insertText: 'CEILING(${1:number}, ${2:significance})',
    insertTextRules: 4,
    documentation: t(
      'Rounds up to nearest multiple of significance.\n\nExample: CEILING(amount, 100) rounds up to nearest hundred\n\nSyntax: CEILING(Number, Significance)',
    ),
  },
  {
    label: 'INT',
    kind: 1,
    insertText: 'INT(${1:number})',
    insertTextRules: 4,
    documentation: t('Rounds down to nearest integer.\n\nSyntax: INT(Number)'),
  },
  {
    label: 'TRUNC',
    kind: 1,
    insertText: 'TRUNC(${1:number}, ${2:decimals})',
    insertTextRules: 4,
    documentation: t(
      'Truncates number to specified decimals.\n\nSyntax: TRUNC(Number, Decimals)',
    ),
  },
  {
    label: 'MOD',
    kind: 1,
    insertText: 'MOD(${1:dividend}, ${2:divisor})',
    insertTextRules: 4,
    documentation: t(
      'Returns the remainder of division.\n\nExample: MOD(amount, 10)\n\nSyntax: MOD(Dividend, Divisor)',
    ),
  },
  {
    label: 'POWER',
    kind: 1,
    insertText: 'POWER(${1:base}, ${2:exponent})',
    insertTextRules: 4,
    documentation: t(
      'Returns base raised to the power of exponent.\n\nSyntax: POWER(Base, Exponent)',
    ),
  },
  {
    label: 'SQRT',
    kind: 1,
    insertText: 'SQRT(${1:number})',
    insertTextRules: 4,
    documentation: t('Returns the square root.\n\nSyntax: SQRT(Number)'),
  },
  {
    label: 'SIGN',
    kind: 1,
    insertText: 'SIGN(${1:number})',
    insertTextRules: 4,
    documentation: t(
      'Returns -1 for negative, 0 for zero, 1 for positive.\n\nExample: SIGN(amount)\n\nSyntax: SIGN(Number)',
    ),
  },

  // Date and Time Functions
  {
    label: 'DATE',
    kind: 1,
    insertText: 'DATE(${1:year}, ${2:month}, ${3:day})',
    insertTextRules: 4,
    documentation: t(
      'Returns date as number of days since null date.\n\nExample: DATE(2024, 1, 15)\n\nSyntax: DATE(Year, Month, Day)',
    ),
  },
  {
    label: 'TODAY',
    kind: 1,
    insertText: 'TODAY()',
    insertTextRules: 4,
    documentation: t('Returns current date.\n\nSyntax: TODAY()'),
  },
  {
    label: 'NOW',
    kind: 1,
    insertText: 'NOW()',
    insertTextRules: 4,
    documentation: t('Returns current date and time.\n\nSyntax: NOW()'),
  },
  {
    label: 'YEAR',
    kind: 1,
    insertText: 'YEAR(${1:date})',
    insertTextRules: 4,
    documentation: t(
      'Returns the year from a date.\n\nExample: YEAR(date)\n\nSyntax: YEAR(Number)',
    ),
  },
  {
    label: 'MONTH',
    kind: 1,
    insertText: 'MONTH(${1:date})',
    insertTextRules: 4,
    documentation: t(
      'Returns the month from a date.\n\nExample: MONTH(date)\n\nSyntax: MONTH(Number)',
    ),
  },
  {
    label: 'DAY',
    kind: 1,
    insertText: 'DAY(${1:date})',
    insertTextRules: 4,
    documentation: t(
      'Returns the day from a date.\n\nExample: DAY(date)\n\nSyntax: DAY(Number)',
    ),
  },
  {
    label: 'WEEKDAY',
    kind: 1,
    insertText: 'WEEKDAY(${1:date}, ${2:type})',
    insertTextRules: 4,
    documentation: t(
      'Returns day of week (1-7).\n\nExample: WEEKDAY(date, 1)\n\nSyntax: WEEKDAY(Date, Type)',
    ),
  },
  {
    label: 'EDATE',
    kind: 1,
    insertText: 'EDATE(${1:start_date}, ${2:months})',
    insertTextRules: 4,
    documentation: t(
      'Returns date shifted by specified months.\n\nExample: EDATE(date, 1) adds one month\n\nSyntax: EDATE(Startdate, Months)',
    ),
  },
  {
    label: 'EOMONTH',
    kind: 1,
    insertText: 'EOMONTH(${1:start_date}, ${2:months})',
    insertTextRules: 4,
    documentation: t(
      'Returns last day of month after specified months.\n\nExample: EOMONTH(date, 0) returns last day of current month\n\nSyntax: EOMONTH(Startdate, Months)',
    ),
  },
  {
    label: 'DAYS',
    kind: 1,
    insertText: 'DAYS(${1:end_date}, ${2:start_date})',
    insertTextRules: 4,
    documentation: t(
      'Calculates difference between dates in days.\n\nExample: DAYS(today, date)\n\nSyntax: DAYS(Date2, Date1)',
    ),
  },
  {
    label: 'DATEDIF',
    kind: 1,
    insertText: 'DATEDIF(${1:start_date}, ${2:end_date}, “${3:D}”)',
    insertTextRules: 4,
    documentation: t(
      'Calculates distance between dates.\n\nUnits: “D” (days), “M” (months), “Y” (years), “MD”, “YM”, “YD”\n\nExample: DATEDIF(date, today, “D”)\n\nSyntax: DATEDIF(Date1, Date2, Unit)',
    ),
  },
  {
    label: 'DATEVALUE',
    kind: 1,
    insertText: 'DATEVALUE(${1:date_string})',
    insertTextRules: 4,
    documentation: t(
      'Parses a date string and returns it as a number.\n\nSyntax: DATEVALUE(Datestring)',
    ),
  },
  {
    label: 'WEEKNUM',
    kind: 1,
    insertText: 'WEEKNUM(${1:date}, ${2:type})',
    insertTextRules: 4,
    documentation: t(
      'Returns week number of year.\n\nExample: WEEKNUM(date, 1)\n\nSyntax: WEEKNUM(Date, Type)',
    ),
  },
  {
    label: 'ISOWEEKNUM',
    kind: 1,
    insertText: 'ISOWEEKNUM(${1:date})',
    insertTextRules: 4,
    documentation: t(
      'Returns ISO week number.\n\nExample: ISOWEEKNUM(date)\n\nSyntax: ISOWEEKNUM(Date)',
    ),
  },

  // Logical Functions
  {
    label: 'IF',
    kind: 1,
    insertText: 'IF(${1:condition}, ${2:value_if_true}, ${3:value_if_false})',
    insertTextRules: 4,
    documentation: t(
      'Returns one value if condition is TRUE, another if FALSE.\n\nExample: IF(amount > 0, “Income”, “Expense”)\n\nSyntax: IF(Condition, ValueIfTrue, ValueIfFalse)',
    ),
  },
  {
    label: 'IFS',
    kind: 1,
    insertText:
      'IFS(${1:condition1}, ${2:value1}, ${3:condition2}, ${4:value2})',
    insertTextRules: 4,
    documentation: t(
      'Checks multiple conditions and returns corresponding values.\n\nExample: IFS(amount > 1000, “Large”, amount > 100, “Medium”, TRUE, “Small”)\n\nSyntax: IFS(Condition1, Value1, Condition2, Value2, ...)',
    ),
  },
  {
    label: 'AND',
    kind: 1,
    insertText: 'AND(${1:condition1}, ${2:condition2})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if all arguments are TRUE.\n\nExample: AND(amount > 0, cleared)\n\nSyntax: AND(Condition1, Condition2, ...ConditionN)',
    ),
  },
  {
    label: 'OR',
    kind: 1,
    insertText: 'OR(${1:condition1}, ${2:condition2})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if any argument is TRUE.\n\nExample: OR(cleared, reconciled)\n\nSyntax: OR(Condition1, Condition2, ...ConditionN)',
    ),
  },
  {
    label: 'XOR',
    kind: 1,
    insertText: 'XOR(${1:condition1}, ${2:condition2})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if odd number of arguments are TRUE.\n\nSyntax: XOR(Condition1, Condition2, ...ConditionN)',
    ),
  },
  {
    label: 'NOT',
    kind: 1,
    insertText: 'NOT(${1:condition})',
    insertTextRules: 4,
    documentation: t(
      'Reverses the logical value.\n\nExample: NOT(cleared)\n\nSyntax: NOT(Condition)',
    ),
  },
  {
    label: 'TRUE',
    kind: 1,
    insertText: 'TRUE()',
    insertTextRules: 4,
    documentation: t('Returns the logical value TRUE.\n\nSyntax: TRUE()'),
  },
  {
    label: 'FALSE',
    kind: 1,
    insertText: 'FALSE()',
    insertTextRules: 4,
    documentation: t('Returns the logical value FALSE.\n\nSyntax: FALSE()'),
  },
  {
    label: 'IFERROR',
    kind: 1,
    insertText: 'IFERROR(${1:value}, ${2:value_if_error})',
    insertTextRules: 4,
    documentation: t(
      'Returns value if no error, otherwise returns alternative.\n\nExample: IFERROR(amount / 100, 0)\n\nSyntax: IFERROR(Value, ValueIfError)',
    ),
  },
  {
    label: 'IFNA',
    kind: 1,
    insertText: 'IFNA(${1:value}, ${2:value_if_na})',
    insertTextRules: 4,
    documentation: t(
      'Returns value if not #N/A error, otherwise returns alternative.\n\nSyntax: IFNA(Value, ValueIfNA)',
    ),
  },
  {
    label: 'SWITCH',
    kind: 1,
    insertText: 'SWITCH(${1:expression}, ${2:value1}, ${3:result1})',
    insertTextRules: 4,
    documentation: t(
      'Matches expression against values and returns corresponding result.\n\nExample: SWITCH(WEEKDAY(date), 1, “Sunday”, 2, “Monday”, “Weekday”)\n\nSyntax: SWITCH(Expression, Value1, Result1, ...)',
    ),
  },

  // Information Functions
  {
    label: 'ISBLANK',
    kind: 1,
    insertText: 'ISBLANK(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is blank.\n\nExample: ISBLANK(notes)\n\nSyntax: ISBLANK(Value)',
    ),
  },
  {
    label: 'ISERROR',
    kind: 1,
    insertText: 'ISERROR(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is any error.\n\nSyntax: ISERROR(Value)',
    ),
  },
  {
    label: 'ISNA',
    kind: 1,
    insertText: 'ISNA(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is #N/A error.\n\nSyntax: ISNA(Value)',
    ),
  },
  {
    label: 'ISNUMBER',
    kind: 1,
    insertText: 'ISNUMBER(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is a number.\n\nExample: ISNUMBER(amount)\n\nSyntax: ISNUMBER(Value)',
    ),
  },
  {
    label: 'ISTEXT',
    kind: 1,
    insertText: 'ISTEXT(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is text.\n\nExample: ISTEXT(payee)\n\nSyntax: ISTEXT(Value)',
    ),
  },
  {
    label: 'ISLOGICAL',
    kind: 1,
    insertText: 'ISLOGICAL(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is logical (TRUE/FALSE).\n\nExample: ISLOGICAL(cleared)\n\nSyntax: ISLOGICAL(Value)',
    ),
  },
  {
    label: 'ISREF',
    kind: 1,
    insertText: 'ISREF(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is a reference.\n\nSyntax: ISREF(Value)',
    ),
  },
  {
    label: 'ISEVEN',
    kind: 1,
    insertText: 'ISEVEN(${1:number})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if number is even.\n\nExample: ISEVEN(DAY(date))\n\nSyntax: ISEVEN(Number)',
    ),
  },
  {
    label: 'ISODD',
    kind: 1,
    insertText: 'ISODD(${1:number})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if number is odd.\n\nExample: ISODD(DAY(date))\n\nSyntax: ISODD(Number)',
    ),
  },

  // Conversion Functions
  {
    label: 'VALUE',
    kind: 1,
    insertText: 'VALUE(${1:text})',
    insertTextRules: 4,
    documentation: t('Converts text to a number.\n\nSyntax: VALUE(Text)'),
  },
  {
    label: 'T',
    kind: 1,
    insertText: 'T(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns text if value is text, empty string otherwise.\n\nSyntax: T(Value)',
    ),
  },
  {
    label: 'N',
    kind: 1,
    insertText: 'N(${1:value})',
    insertTextRules: 4,
    documentation: t('Converts value to a number.\n\nSyntax: N(Value)'),
  },
];
