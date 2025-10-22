"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalArithmetic = evalArithmetic;
// @ts-strict-ignore
var util_1 = require("./util");
function fail(state, msg) {
    throw new Error(msg + ': ' + JSON.stringify(state.str.slice(state.index, 10)));
}
function char(state) {
    return state.str[state.index];
}
function next(state) {
    if (state.index >= state.str.length) {
        return null;
    }
    var ch = char(state);
    state.index++;
    return ch;
}
function nextOperator(state, op) {
    if (char(state) === op) {
        next(state);
        return true;
    }
    return false;
}
function parsePrimary(state) {
    // We only support numbers
    var isNegative = char(state) === '-';
    if (isNegative) {
        next(state);
    }
    var numberStr = '';
    while (char(state) && char(state).match(/[0-9,.’\u00A0\u202F ]|\p{Sc}/u)) {
        numberStr += next(state);
    }
    if (numberStr === '') {
        fail(state, 'Unexpected character');
    }
    var number = (0, util_1.currencyToAmount)(numberStr);
    return isNegative ? -number : number;
}
function parseParens(state) {
    if (char(state) === '(') {
        next(state);
        var expr = parseOperator(state);
        if (char(state) !== ')') {
            fail(state, 'Unbalanced parentheses');
        }
        next(state);
        return expr;
    }
    return parsePrimary(state);
}
function makeOperatorParser() {
    var ops = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ops[_i] = arguments[_i];
    }
    return ops.reduce(function (prevParser, op) {
        return function (state) {
            var node = prevParser(state);
            while (nextOperator(state, op)) {
                node = { op: op, left: node, right: prevParser(state) };
            }
            return node;
        };
    }, parseParens);
}
// These operators go from high to low order of precedence
var parseOperator = makeOperatorParser('^', '/', '*', '-', '+');
function parse(expression) {
    var state = { str: expression.replace(/\s/g, ''), index: 0 };
    return parseOperator(state);
}
function evaluate(ast) {
    if (typeof ast === 'number') {
        return ast;
    }
    var left = ast.left, right = ast.right, op = ast.op;
    switch (op) {
        case '+':
            return evaluate(left) + evaluate(right);
        case '-':
            return evaluate(left) - evaluate(right);
        case '*':
            return evaluate(left) * evaluate(right);
        case '/':
            return evaluate(left) / evaluate(right);
        case '^':
            return Math.pow(evaluate(left), evaluate(right));
        default:
            throw new Error('Unknown operator: ' + op);
    }
}
function evalArithmetic(expression, defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    // An empty expression always evals to the default
    if (expression === '') {
        return defaultValue;
    }
    var result;
    try {
        result = evaluate(parse(expression));
    }
    catch (e) {
        // If it errors, return the default value
        return defaultValue;
    }
    // Never return NaN
    return isNaN(result) ? defaultValue : result;
}
