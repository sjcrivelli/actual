/* eslint-disable no-template-curly-in-string */
import { t } from 'i18next';
import { type languages } from 'monaco-editor';

export const queryModeFunctions: Omit<languages.CompletionItem, 'range'>[] = [
  // Math and Trigonometry
  {
    label: 'SUM',
    kind: 1,
    insertText: 'SUM(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the sum of all numbers in a range.\n\nSyntax: SUM(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'AVERAGE',
    kind: 1,
    insertText: 'AVERAGE(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the average of all numbers in a range.\n\nSyntax: AVERAGE(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'AVERAGEA',
    kind: 1,
    insertText: 'AVERAGEA(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the average, including text and logical values.\n\nSyntax: AVERAGEA(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'COUNT',
    kind: 1,
    insertText: 'COUNT(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Counts the number of numeric values.\n\nSyntax: COUNT(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'COUNTA',
    kind: 1,
    insertText: 'COUNTA(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Counts non-empty values.\n\nSyntax: COUNTA(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'COUNTBLANK',
    kind: 1,
    insertText: 'COUNTBLANK(${1:range})',
    insertTextRules: 4,
    documentation: t('Counts empty cells.\n\nSyntax: COUNTBLANK(Range)'),
  },
  {
    label: 'COUNTIF',
    kind: 1,
    insertText: 'COUNTIF(${1:range}, ${2:criteria})',
    insertTextRules: 4,
    documentation: t(
      'Counts cells that meet a criteria.\n\nSyntax: COUNTIF(Range, Criteria)',
    ),
  },
  {
    label: 'COUNTIFS',
    kind: 1,
    insertText: 'COUNTIFS(${1:range1}, ${2:criteria1})',
    insertTextRules: 4,
    documentation: t(
      'Counts cells that meet multiple criteria.\n\nSyntax: COUNTIFS(Range1, Criteria1, Range2, Criteria2, ...)',
    ),
  },
  {
    label: 'MAX',
    kind: 1,
    insertText: 'MAX(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the maximum value.\n\nSyntax: MAX(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'MAXA',
    kind: 1,
    insertText: 'MAXA(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the maximum value, including text and logical values.\n\nSyntax: MAXA(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'MIN',
    kind: 1,
    insertText: 'MIN(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the minimum value.\n\nSyntax: MIN(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'MINA',
    kind: 1,
    insertText: 'MINA(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the minimum value, including text and logical values.\n\nSyntax: MINA(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'ABS',
    kind: 1,
    insertText: 'ABS(${1:number})',
    insertTextRules: 4,
    documentation: t(
      'Returns the absolute value of a number.\n\nSyntax: ABS(Number)',
    ),
  },
  {
    label: 'ROUND',
    kind: 1,
    insertText: 'ROUND(${1:number}, ${2:decimals})',
    insertTextRules: 4,
    documentation: t(
      'Rounds a number to specified decimals.\n\nSyntax: ROUND(Number, Decimals)',
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
      'Rounds down to nearest multiple of significance.\n\nSyntax: FLOOR(Number, Significance)',
    ),
  },
  {
    label: 'CEILING',
    kind: 1,
    insertText: 'CEILING(${1:number}, ${2:significance})',
    insertTextRules: 4,
    documentation: t(
      'Rounds up to nearest multiple of significance.\n\nSyntax: CEILING(Number, Significance)',
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
    label: 'MOD',
    kind: 1,
    insertText: 'MOD(${1:dividend}, ${2:divisor})',
    insertTextRules: 4,
    documentation: t(
      'Returns the remainder of division.\n\nSyntax: MOD(Dividend, Divisor)',
    ),
  },
  {
    label: 'PI',
    kind: 1,
    insertText: 'PI()',
    insertTextRules: 4,
    documentation: t('Returns the value of PI.\n\nSyntax: PI()'),
  },
  {
    label: 'SIN',
    kind: 1,
    insertText: 'SIN(${1:angle})',
    insertTextRules: 4,
    documentation: t('Returns the sine of an angle.\n\nSyntax: SIN(Angle)'),
  },
  {
    label: 'COS',
    kind: 1,
    insertText: 'COS(${1:angle})',
    insertTextRules: 4,
    documentation: t('Returns the cosine of an angle.\n\nSyntax: COS(Angle)'),
  },
  {
    label: 'TAN',
    kind: 1,
    insertText: 'TAN(${1:angle})',
    insertTextRules: 4,
    documentation: t('Returns the tangent of an angle.\n\nSyntax: TAN(Angle)'),
  },
  {
    label: 'LN',
    kind: 1,
    insertText: 'LN(${1:number})',
    insertTextRules: 4,
    documentation: t('Returns the natural logarithm.\n\nSyntax: LN(Number)'),
  },
  {
    label: 'LOG',
    kind: 1,
    insertText: 'LOG(${1:number}, ${2:base})',
    insertTextRules: 4,
    documentation: t(
      'Returns the logarithm to specified base.\n\nSyntax: LOG(Number, Base)',
    ),
  },
  {
    label: 'LOG10',
    kind: 1,
    insertText: 'LOG10(${1:number})',
    insertTextRules: 4,
    documentation: t('Returns the base-10 logarithm.\n\nSyntax: LOG10(Number)'),
  },
  {
    label: 'EXP',
    kind: 1,
    insertText: 'EXP(${1:number})',
    insertTextRules: 4,
    documentation: t(
      'Returns e raised to the power of number.\n\nSyntax: EXP(Number)',
    ),
  },
  {
    label: 'PRODUCT',
    kind: 1,
    insertText: 'PRODUCT(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the product of all numbers.\n\nSyntax: PRODUCT(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'SUMIF',
    kind: 1,
    insertText: 'SUMIF(${1:range}, ${2:criteria}, ${3:sum_range})',
    insertTextRules: 4,
    documentation: t(
      'Sums cells that meet a criteria.\n\nSyntax: SUMIF(Range, Criteria, SumRange)',
    ),
  },
  {
    label: 'SUMIFS',
    kind: 1,
    insertText: 'SUMIFS(${1:sum_range}, ${2:range1}, ${3:criteria1})',
    insertTextRules: 4,
    documentation: t(
      'Sums cells that meet multiple criteria.\n\nSyntax: SUMIFS(SumRange, Range1, Criteria1, ...)',
    ),
  },
  {
    label: 'SUMPRODUCT',
    kind: 1,
    insertText: 'SUMPRODUCT(${1:array1}, ${2:array2})',
    insertTextRules: 4,
    documentation: t(
      'Multiplies corresponding elements and returns the sum.\n\nSyntax: SUMPRODUCT(Array1, Array2, ...ArrayN)',
    ),
  },
  {
    label: 'SUMSQ',
    kind: 1,
    insertText: 'SUMSQ(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the sum of the squares.\n\nSyntax: SUMSQ(Number1, Number2, ...NumberN)',
    ),
  },

  // Statistical Functions
  {
    label: 'MEDIAN',
    kind: 1,
    insertText: 'MEDIAN(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the median value.\n\nSyntax: MEDIAN(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'MODE',
    kind: 1,
    insertText: 'MODE(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the most frequently occurring value.\n\nSyntax: MODE(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'STDEV',
    kind: 1,
    insertText: 'STDEV(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the standard deviation of a sample.\n\nSyntax: STDEV(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'STDEVP',
    kind: 1,
    insertText: 'STDEVP(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the standard deviation of a population.\n\nSyntax: STDEVP(Number1, Number2, ...NumberN)',
    ),
  },
  {
    label: 'VAR',
    kind: 1,
    insertText: 'VAR(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the variance of a sample.\n\nSyntax: VAR(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'VARP',
    kind: 1,
    insertText: 'VARP(${1:range})',
    insertTextRules: 4,
    documentation: t(
      'Returns the variance of a population.\n\nSyntax: VARP(Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'PERCENTILE',
    kind: 1,
    insertText: 'PERCENTILE(${1:range}, ${2:k})',
    insertTextRules: 4,
    documentation: t(
      'Returns the k-th percentile.\n\nSyntax: PERCENTILE(Array, K)',
    ),
  },
  {
    label: 'QUARTILE',
    kind: 1,
    insertText: 'QUARTILE(${1:range}, ${2:quart})',
    insertTextRules: 4,
    documentation: t(
      'Returns the quartile of a dataset.\n\nSyntax: QUARTILE(Array, Quart)',
    ),
  },
  {
    label: 'RANK',
    kind: 1,
    insertText: 'RANK(${1:value}, ${2:array}, ${3:order})',
    insertTextRules: 4,
    documentation: t(
      'Returns the rank of a number in a list.\n\nSyntax: RANK(Value, Array, Order)',
    ),
  },

  // Logical Functions
  {
    label: 'IF',
    kind: 1,
    insertText: 'IF(${1:condition}, ${2:value_if_true}, ${3:value_if_false})',
    insertTextRules: 4,
    documentation: t(
      'Returns one value if condition is TRUE, another if FALSE.\n\nSyntax: IF(Condition, ValueIfTrue, ValueIfFalse)',
    ),
  },
  {
    label: 'IFS',
    kind: 1,
    insertText:
      'IFS(${1:condition1}, ${2:value1}, ${3:condition2}, ${4:value2})',
    insertTextRules: 4,
    documentation: t(
      'Checks multiple conditions and returns corresponding values.\n\nSyntax: IFS(Condition1, Value1, Condition2, Value2, ...)',
    ),
  },
  {
    label: 'AND',
    kind: 1,
    insertText: 'AND(${1:condition1}, ${2:condition2})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if all arguments are TRUE.\n\nSyntax: AND(Condition1, Condition2, ...ConditionN)',
    ),
  },
  {
    label: 'OR',
    kind: 1,
    insertText: 'OR(${1:condition1}, ${2:condition2})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if any argument is TRUE.\n\nSyntax: OR(Condition1, Condition2, ...ConditionN)',
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
    documentation: t('Reverses the logical value.\n\nSyntax: NOT(Condition)'),
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
      'Returns value if no error, otherwise returns alternative.\n\nSyntax: IFERROR(Value, ValueIfError)',
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
      'Matches expression against values and returns corresponding result.\n\nSyntax: SWITCH(Expression, Value1, Result1, ...)',
    ),
  },

  // Text Functions
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
      'Returns leftmost characters from text.\n\nSyntax: LEFT(“Text”, Number)',
    ),
  },
  {
    label: 'RIGHT',
    kind: 1,
    insertText: 'RIGHT(${1:text}, ${2:num_chars})',
    insertTextRules: 4,
    documentation: t(
      'Returns rightmost characters from text.\n\nSyntax: RIGHT(“Text”, Number)',
    ),
  },
  {
    label: 'MID',
    kind: 1,
    insertText: 'MID(${1:text}, ${2:start_pos}, ${3:length})',
    insertTextRules: 4,
    documentation: t(
      'Returns substring from specified position.\n\nSyntax: MID(Text, Start_position, Length)',
    ),
  },
  {
    label: 'LEN',
    kind: 1,
    insertText: 'LEN(${1:text})',
    insertTextRules: 4,
    documentation: t('Returns length of text.\n\nSyntax: LEN(“Text”)'),
  },
  {
    label: 'TRIM',
    kind: 1,
    insertText: 'TRIM(${1:text})',
    insertTextRules: 4,
    documentation: t('Removes extra spaces from text.\n\nSyntax: TRIM(“Text”)'),
  },
  {
    label: 'SUBSTITUTE',
    kind: 1,
    insertText: 'SUBSTITUTE(${1:text}, ${2:old_text}, ${3:new_text})',
    insertTextRules: 4,
    documentation: t(
      'Replaces occurrences of text.\n\nSyntax: SUBSTITUTE(Text, Old_text, New_text, [Occurrence])',
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
      'Finds text within text (case-sensitive).\n\nSyntax: FIND(“Text1”, “Text2”[, Number])',
    ),
  },
  {
    label: 'SEARCH',
    kind: 1,
    insertText: 'SEARCH(${1:search_text}, ${2:text})',
    insertTextRules: 4,
    documentation: t(
      'Finds text within text (case-insensitive, supports wildcards).\n\nSyntax: SEARCH(Search_string, Text[, Start_position])',
    ),
  },
  {
    label: 'TEXT',
    kind: 1,
    insertText: 'TEXT(${1:value}, ${2:format})',
    insertTextRules: 4,
    documentation: t(
      'Converts number to text with format.\n\nSyntax: TEXT(Number, Format)',
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

  // Date and Time Functions
  {
    label: 'DATE',
    kind: 1,
    insertText: 'DATE(${1:year}, ${2:month}, ${3:day})',
    insertTextRules: 4,
    documentation: t(
      'Returns date as number of days since null date.\n\nSyntax: DATE(Year, Month, Day)',
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
    documentation: t('Returns the year from a date.\n\nSyntax: YEAR(Number)'),
  },
  {
    label: 'MONTH',
    kind: 1,
    insertText: 'MONTH(${1:date})',
    insertTextRules: 4,
    documentation: t('Returns the month from a date.\n\nSyntax: MONTH(Number)'),
  },
  {
    label: 'DAY',
    kind: 1,
    insertText: 'DAY(${1:date})',
    insertTextRules: 4,
    documentation: t('Returns the day from a date.\n\nSyntax: DAY(Number)'),
  },
  {
    label: 'WEEKDAY',
    kind: 1,
    insertText: 'WEEKDAY(${1:date}, ${2:type})',
    insertTextRules: 4,
    documentation: t(
      'Returns day of week (1-7).\n\nSyntax: WEEKDAY(Date, Type)',
    ),
  },
  {
    label: 'EDATE',
    kind: 1,
    insertText: 'EDATE(${1:start_date}, ${2:months})',
    insertTextRules: 4,
    documentation: t(
      'Returns date shifted by specified months.\n\nSyntax: EDATE(Startdate, Months)',
    ),
  },
  {
    label: 'EOMONTH',
    kind: 1,
    insertText: 'EOMONTH(${1:start_date}, ${2:months})',
    insertTextRules: 4,
    documentation: t(
      'Returns last day of month after specified months.\n\nSyntax: EOMONTH(Startdate, Months)',
    ),
  },
  {
    label: 'DAYS',
    kind: 1,
    insertText: 'DAYS(${1:end_date}, ${2:start_date})',
    insertTextRules: 4,
    documentation: t(
      'Calculates difference between dates in days.\n\nSyntax: DAYS(Date2, Date1)',
    ),
  },
  {
    label: 'DATEDIF',
    kind: 1,
    insertText: 'DATEDIF(${1:start_date}, ${2:end_date}, “${3:D}”)',
    insertTextRules: 4,
    documentation: t(
      'Calculates distance between dates.\n\nUnits: “D” (days), “M” (months), “Y” (years), “MD”, “YM”, “YD”\n\nSyntax: DATEDIF(Date1, Date2, Unit)',
    ),
  },
  {
    label: 'NETWORKDAYS',
    kind: 1,
    insertText: 'NETWORKDAYS(${1:start_date}, ${2:end_date})',
    insertTextRules: 4,
    documentation: t(
      'Returns number of working days between dates.\n\nSyntax: NETWORKDAYS(Date1, Date2[, Holidays])',
    ),
  },
  {
    label: 'WEEKNUM',
    kind: 1,
    insertText: 'WEEKNUM(${1:date}, ${2:type})',
    insertTextRules: 4,
    documentation: t(
      'Returns week number of year.\n\nSyntax: WEEKNUM(Date, Type)',
    ),
  },

  // Lookup and Reference
  {
    label: 'VLOOKUP',
    kind: 1,
    insertText:
      'VLOOKUP(${1:lookup_value}, ${2:table_array}, ${3:col_index}, ${4:FALSE})',
    insertTextRules: 4,
    documentation: t(
      'Searches vertically in first column and returns value.\n\nSyntax: VLOOKUP(LookupValue, TableArray, ColIndex, RangeLookup)',
    ),
  },
  {
    label: 'HLOOKUP',
    kind: 1,
    insertText:
      'HLOOKUP(${1:lookup_value}, ${2:table_array}, ${3:row_index}, ${4:FALSE})',
    insertTextRules: 4,
    documentation: t(
      'Searches horizontally in first row and returns value.\n\nSyntax: HLOOKUP(LookupValue, TableArray, RowIndex, RangeLookup)',
    ),
  },
  {
    label: 'INDEX',
    kind: 1,
    insertText: 'INDEX(${1:array}, ${2:row}, ${3:column})',
    insertTextRules: 4,
    documentation: t(
      'Returns value at specified row and column.\n\nSyntax: INDEX(Array, Row, Column)',
    ),
  },
  {
    label: 'MATCH',
    kind: 1,
    insertText: 'MATCH(${1:lookup_value}, ${2:lookup_array}, ${3:0})',
    insertTextRules: 4,
    documentation: t(
      'Returns position of value in array.\n\nSyntax: MATCH(LookupValue, LookupArray, MatchType)',
    ),
  },
  {
    label: 'CHOOSE',
    kind: 1,
    insertText: 'CHOOSE(${1:index}, ${2:value1}, ${3:value2})',
    insertTextRules: 4,
    documentation: t(
      'Returns value from list based on index.\n\nSyntax: CHOOSE(Index, Value1, Value2, ...ValueN)',
    ),
  },

  // Information Functions
  {
    label: 'ISBLANK',
    kind: 1,
    insertText: 'ISBLANK(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is blank.\n\nSyntax: ISBLANK(Value)',
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
      'Returns TRUE if value is a number.\n\nSyntax: ISNUMBER(Value)',
    ),
  },
  {
    label: 'ISTEXT',
    kind: 1,
    insertText: 'ISTEXT(${1:value})',
    insertTextRules: 4,
    documentation: t('Returns TRUE if value is text.\n\nSyntax: ISTEXT(Value)'),
  },
  {
    label: 'ISLOGICAL',
    kind: 1,
    insertText: 'ISLOGICAL(${1:value})',
    insertTextRules: 4,
    documentation: t(
      'Returns TRUE if value is logical (TRUE/FALSE).\n\nSyntax: ISLOGICAL(Value)',
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

  // Financial Functions
  {
    label: 'PMT',
    kind: 1,
    insertText: 'PMT(${1:rate}, ${2:nper}, ${3:pv})',
    insertTextRules: 4,
    documentation: t(
      'Calculates payment for a loan.\n\nSyntax: PMT(Rate, Nper, PV, FV, Type)',
    ),
  },
  {
    label: 'FV',
    kind: 1,
    insertText: 'FV(${1:rate}, ${2:nper}, ${3:pmt})',
    insertTextRules: 4,
    documentation: t(
      'Calculates future value of investment.\n\nSyntax: FV(Rate, Nper, PMT, PV, Type)',
    ),
  },
  {
    label: 'PV',
    kind: 1,
    insertText: 'PV(${1:rate}, ${2:nper}, ${3:pmt})',
    insertTextRules: 4,
    documentation: t(
      'Calculates present value of investment.\n\nSyntax: PV(Rate, Nper, PMT, FV, Type)',
    ),
  },
  {
    label: 'NPV',
    kind: 1,
    insertText: 'NPV(${1:rate}, ${2:value1}, ${3:value2})',
    insertTextRules: 4,
    documentation: t(
      'Calculates net present value.\n\nSyntax: NPV(Rate, Value1, Value2, ...ValueN)',
    ),
  },
  {
    label: 'IRR',
    kind: 1,
    insertText: 'IRR(${1:values})',
    insertTextRules: 4,
    documentation: t(
      'Calculates internal rate of return.\n\nSyntax: IRR(Values, Guess)',
    ),
  },
  {
    label: 'RATE',
    kind: 1,
    insertText: 'RATE(${1:nper}, ${2:pmt}, ${3:pv})',
    insertTextRules: 4,
    documentation: t(
      'Calculates interest rate per period.\n\nSyntax: RATE(Nper, PMT, PV, FV, Type, Guess)',
    ),
  },
];
