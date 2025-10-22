"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
var user_event_1 = require("@testing-library/user-event");
var date_fns_1 = require("date-fns");
var uuid_1 = require("uuid");
var mocks_1 = require("loot-core/mocks");
var fetch_1 = require("loot-core/platform/client/fetch");
var transactions_1 = require("loot-core/shared/transactions");
var util_1 = require("loot-core/shared/util");
var TransactionsTable_1 = require("./TransactionsTable");
var AuthProvider_1 = require("@desktop-client/auth/AuthProvider");
var useCachedSchedules_1 = require("@desktop-client/hooks/useCachedSchedules");
var useSelected_1 = require("@desktop-client/hooks/useSelected");
var useSplitsExpanded_1 = require("@desktop-client/hooks/useSplitsExpanded");
var useSpreadsheet_1 = require("@desktop-client/hooks/useSpreadsheet");
var mock_1 = require("@desktop-client/redux/mock");
vi.mock('loot-core/platform/client/fetch');
vi.mock('../../hooks/useFeatureFlag', function () { return ({
    default: vi.fn().mockReturnValue(false),
}); });
vi.mock('../../hooks/useSyncedPref', function () { return ({
    useSyncedPref: vi.fn().mockReturnValue([undefined, vi.fn()]),
}); });
vi.mock('../../hooks/useFeatureFlag', function () { return ({
    useFeatureFlag: function () { return false; },
}); });
var accounts = [(0, mocks_1.generateAccount)('Bank of America')];
vi.mock('../../hooks/useAccounts', function () { return ({
    useAccounts: function () { return accounts; },
}); });
var payees = [
    {
        id: 'bob-id',
        name: 'Bob',
        favorite: true,
    },
    {
        id: 'alice-id',
        name: 'Alice',
        favorite: true,
    },
    {
        id: 'guy',
        favorite: false,
        name: 'This guy on the side of the road',
    },
];
vi.mock('../../hooks/usePayees', function (importOriginal) { return __awaiter(void 0, void 0, void 0, function () {
    var actual;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // eslint-disable-next-line @typescript-eslint/consistent-type-imports
            return [4 /*yield*/, importOriginal()];
            case 1:
                actual = 
                // eslint-disable-next-line @typescript-eslint/consistent-type-imports
                _a.sent();
                return [2 /*return*/, __assign(__assign({}, actual), { usePayees: function () { return payees; }, usePayeesById: function () {
                            var payeesById = {};
                            payees.forEach(function (payee) {
                                payeesById[payee.id] = payee;
                            });
                            return payeesById;
                        } })];
        }
    });
}); });
var categoryGroups = (0, mocks_1.generateCategoryGroups)([
    {
        name: 'Investments and Savings',
        categories: [{ name: 'Savings' }],
    },
    {
        name: 'Usual Expenses',
        categories: [{ name: 'Food' }, { name: 'General' }, { name: 'Home' }],
    },
    {
        name: 'Projects',
        categories: [{ name: 'Big Projects' }, { name: 'Shed' }],
    },
]);
vi.mock('../../hooks/useCategories', function () { return ({
    useCategories: function () { return ({
        list: categoryGroups.flatMap(function (g) { return g.categories; }),
        grouped: categoryGroups,
    }); },
}); });
var usualGroup = categoryGroups[1];
function generateTransactions(count, splitAtIndexes, showError) {
    var _a, _b;
    if (splitAtIndexes === void 0) { splitAtIndexes = []; }
    if (showError === void 0) { showError = false; }
    var transactions = [];
    for (var i = 0; i < count; i++) {
        var isSplit = splitAtIndexes.includes(i);
        transactions.push.apply(transactions, (0, mocks_1.generateTransaction)({
            account: accounts[0].id,
            payee: 'alice-id',
            category: i === 0
                ? undefined
                : i === 1
                    ? (_a = usualGroup.categories) === null || _a === void 0 ? void 0 : _a[1].id
                    : (_b = usualGroup.categories) === null || _b === void 0 ? void 0 : _b[0].id,
            amount: isSplit ? 50 : undefined,
            sort_order: i,
        }, isSplit ? 30 : undefined, showError));
    }
    return transactions;
}
function LiveTransactionTable(props) {
    var _this = this;
    var transactionsProp = props.transactions, onTransactionsChange = props.onTransactionsChange;
    var _a = (0, react_1.useState)(transactionsProp), transactions = _a[0], setTransactions = _a[1];
    (0, react_1.useEffect)(function () {
        if (transactions === transactionsProp)
            return;
        onTransactionsChange === null || onTransactionsChange === void 0 ? void 0 : onTransactionsChange(transactions);
    }, [transactions, transactionsProp, onTransactionsChange]);
    var onSplit = function (id) {
        var _a = (0, transactions_1.splitTransaction)(transactions, id), data = _a.data, diff = _a.diff;
        setTransactions(data);
        return diff.added[0].id;
    };
    var onSave = function (transaction) {
        var data = (0, transactions_1.updateTransaction)(transactions, transaction).data;
        setTransactions(data);
    };
    var onAdd = function (newTransactions) {
        newTransactions = (0, transactions_1.realizeTempTransactions)(newTransactions);
        setTransactions(function (trans) { return __spreadArray(__spreadArray([], newTransactions, true), trans, true); });
    };
    var onAddSplit = function (id) {
        var _a = (0, transactions_1.addSplitTransaction)(transactions, id), data = _a.data, diff = _a.diff;
        setTransactions(data);
        return diff.added[0].id;
    };
    var onCreatePayee = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, 'id'];
    }); }); };
    // It's important that these functions are they same instances
    // across renders. Doing so tests that the transaction table
    // implementation properly uses the right latest state even if the
    // hook dependencies haven't changed
    return (<mock_1.TestProvider>
      <AuthProvider_1.AuthProvider>
        <useSpreadsheet_1.SpreadsheetProvider>
          <useCachedSchedules_1.SchedulesProvider>
            <useSelected_1.SelectedProviderWithItems name="transactions" items={transactions} fetchAllIds={function () { return Promise.resolve(transactions.map(function (t) { return t.id; })); }}>
              <useSplitsExpanded_1.SplitsExpandedProvider>
                <TransactionsTable_1.TransactionTable {...props} transactions={transactions} loadMoreTransactions={function () { }} 
    // @ts-ignore TODO:
    commonPayees={[]} payees={payees} addNotification={console.log} onSave={onSave} onSplit={onSplit} onAdd={onAdd} onAddSplit={onAddSplit} onCreatePayee={onCreatePayee} showSelection={true} allowSplitTransaction={true}/>
              </useSplitsExpanded_1.SplitsExpandedProvider>
            </useSelected_1.SelectedProviderWithItems>
          </useCachedSchedules_1.SchedulesProvider>
        </useSpreadsheet_1.SpreadsheetProvider>
      </AuthProvider_1.AuthProvider>
    </mock_1.TestProvider>);
}
function initBasicServer() {
    var _this = this;
    (0, fetch_1.initServer)({
        query: function (query) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (query.table) {
                    case 'payees':
                        return [2 /*return*/, { data: payees, dependencies: [] }];
                    case 'accounts':
                        return [2 /*return*/, { data: accounts, dependencies: [] }];
                    case 'transactions':
                        return [2 /*return*/, {
                                data: generateTransactions(5, [6]),
                                dependencies: [],
                            }];
                    default:
                        throw new Error("queried unknown table: ".concat(query.table));
                }
                return [2 /*return*/];
            });
        }); },
        'get-cell': function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        name: 'test-cell',
                        value: 12987,
                    })];
            });
        }); },
        'get-categories': function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, ({
                        grouped: categoryGroups,
                        list: categories,
                    })];
            });
        }); },
    });
}
beforeEach(function () {
    initBasicServer();
});
afterEach(function () {
    global.__resetWorld();
});
// Not good, see `Autocomplete.js` for details
function waitForAutocomplete() {
    return new Promise(function (resolve) { return setTimeout(resolve, 0); });
}
var categories = categoryGroups.reduce(function (all, group) { return (group.categories ? __spreadArray(__spreadArray([], all, true), group.categories, true) : all); }, []);
function prettyDate(date) {
    return (0, date_fns_1.format)((0, date_fns_1.parse)(date, 'yyyy-MM-dd', new Date()), 'MM/dd/yyyy');
}
function renderTransactions(extraProps) {
    var transactions = generateTransactions(5, [6]);
    // Hardcoding the first value makes it easier for tests to do
    // various this
    transactions[0].amount = -2777;
    var defaultProps = {
        transactions: transactions,
        payees: payees,
        accounts: accounts,
        categoryGroups: categoryGroups,
        currentAccountId: accounts[0].id,
        showAccount: true,
        showCategory: true,
        showCleared: true,
        isAdding: false,
        onTransactionsChange: function (t) {
            transactions = t;
        },
    };
    var result = (0, react_2.render)(<LiveTransactionTable {...defaultProps} {...extraProps}/>);
    return __assign(__assign({}, result), { getTransactions: function () { return transactions; }, updateProps: function (props) {
            return (0, react_2.render)(<LiveTransactionTable {...defaultProps} {...extraProps} {...props}/>, { container: result.container });
        } });
}
function queryNewField(container, name, subSelector, idx) {
    if (subSelector === void 0) { subSelector = ''; }
    if (idx === void 0) { idx = 0; }
    var field = container.querySelectorAll("[data-testid=\"new-transaction\"] [data-testid=\"".concat(name, "\"]"))[idx];
    if (subSelector !== '') {
        return field.querySelector(subSelector);
    }
    return field;
}
function queryField(container, name, subSelector, idx) {
    if (subSelector === void 0) { subSelector = ''; }
    var field = container.querySelectorAll("[data-testid=\"transaction-table\"] [data-testid=\"".concat(name, "\"]"))[idx];
    if (subSelector !== '') {
        return field.querySelector(subSelector);
    }
    return field;
}
function _editField(field, container) {
    return __awaiter(this, void 0, void 0, function () {
        var input, element, buttonQuery, btn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = field.querySelector("input");
                    if (input) {
                        expect(container.ownerDocument.activeElement).toBe(input);
                        return [2 /*return*/, input];
                    }
                    buttonQuery = 'button,div[data-testid=cell-button]';
                    if (!field.querySelector(buttonQuery)) return [3 /*break*/, 2];
                    btn = field.querySelector(buttonQuery);
                    return [4 /*yield*/, user_event_1.default.click(btn)];
                case 1:
                    _a.sent();
                    element = field.querySelector(':focus');
                    expect(element).toBeTruthy();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, user_event_1.default.click(field.querySelector('div'))];
                case 3:
                    _a.sent();
                    element = field.querySelector('input');
                    expect(element).toBeTruthy();
                    expect(container.ownerDocument.activeElement).toBe(element);
                    _a.label = 4;
                case 4: return [2 /*return*/, element];
            }
        });
    });
}
function editNewField(container, name, rowIndex) {
    var field = queryNewField(container, name, '', rowIndex);
    return _editField(field, container);
}
function editField(container, name, rowIndex) {
    var field = queryField(container, name, '', rowIndex);
    return _editField(field, container);
}
expect.extend({
    payeesToHaveFavoriteStars: function (container, validPayeeListWithFavorite) {
        var incorrectStarList = [];
        var foundStarList = [];
        validPayeeListWithFavorite.forEach(function (payeeItem) {
            var shouldHaveFavorite = payeeItem != null;
            var found = false;
            if (container[0].querySelectorAll('svg').length === 1) {
                found = true;
                foundStarList.push(payeeItem);
            }
            if (shouldHaveFavorite !== found) {
                incorrectStarList.push(payeeItem);
            }
        });
        if (foundStarList.length !== validPayeeListWithFavorite.length ||
            incorrectStarList.length > 0) {
            return {
                message: function () {
                    return "Expected ".concat(validPayeeListWithFavorite.join(', '), " to have favorite stars.") +
                        "Received ".concat(foundStarList.length, " items with favorite stars. Incorrect: ").concat(incorrectStarList.join(', '));
                },
                pass: false,
            };
        }
        else {
            return {
                message: function () {
                    return "Expected ".concat(validPayeeListWithFavorite, " to have favorite stars");
                },
                pass: true,
            };
        }
    },
});
function expectToBeEditingField(container, name, rowIndex, isNew) {
    var field;
    if (isNew) {
        field = queryNewField(container, name, '', rowIndex);
    }
    else {
        field = queryField(container, name, '', rowIndex);
    }
    var input = field.querySelector(':focus');
    expect(input).toBeTruthy();
    expect(container.ownerDocument.activeElement).toBe(input);
    return input;
}
describe('Transactions', function () {
    test('transactions table shows the correct data', function () {
        var _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
        getTransactions().forEach(function (transaction, idx) {
            var _a, _b, _c;
            expect(queryField(container, 'date', 'div', idx).textContent).toBe(prettyDate(transaction.date));
            expect(queryField(container, 'account', 'div', idx).textContent).toBe((_a = accounts.find(function (acct) { return acct.id === transaction.account; })) === null || _a === void 0 ? void 0 : _a.name);
            expect(queryField(container, 'payee', 'div', idx).textContent).toBe((_b = payees.find(function (p) { return p.id === transaction.payee; })) === null || _b === void 0 ? void 0 : _b.name);
            expect(queryField(container, 'notes', 'div', idx).textContent).toBe(transaction.notes);
            expect(queryField(container, 'category', 'div', idx).textContent).toBe(transaction.category
                ? (_c = categories.find(function (category) { return category.id === transaction.category; })) === null || _c === void 0 ? void 0 : _c.name
                : 'Categorize');
            if (transaction.amount <= 0) {
                expect(queryField(container, 'debit', 'div', idx).textContent).toBe((0, util_1.integerToCurrency)(-transaction.amount));
                expect(queryField(container, 'credit', 'div', idx).textContent).toBe('');
            }
            else {
                expect(queryField(container, 'debit', 'div', idx).textContent).toBe('');
                expect(queryField(container, 'credit', 'div', idx).textContent).toBe((0, util_1.integerToCurrency)(transaction.amount));
            }
        });
    });
    test('keybindings enter/tab/alt should move around', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = renderTransactions().container;
                    return [4 /*yield*/, editField(container, 'notes', 2)];
                case 1:
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '[Enter]')];
                case 2:
                    _a.sent();
                    expectToBeEditingField(container, 'notes', 3);
                    return [4 /*yield*/, editField(container, 'payee', 2)];
                case 3:
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '[Tab]')];
                case 4:
                    _a.sent();
                    expectToBeEditingField(container, 'notes', 2);
                    return [4 /*yield*/, editField(container, 'notes', 2)];
                case 5:
                    // Shift+enter/tab goes up/left
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '{Shift>}[Enter]{/Shift}')];
                case 6:
                    _a.sent();
                    expectToBeEditingField(container, 'notes', 1);
                    return [4 /*yield*/, editField(container, 'payee', 2)];
                case 7:
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '{Shift>}[Tab]{/Shift}')];
                case 8:
                    _a.sent();
                    expectToBeEditingField(container, 'account', 2);
                    return [4 /*yield*/, editField(container, 'cleared', 2)];
                case 9:
                    // Moving forward on the last cell moves to the next row
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '[Tab]')];
                case 10:
                    _a.sent();
                    expectToBeEditingField(container, 'select', 3);
                    // Moving backward on the first cell moves to the previous row
                    return [4 /*yield*/, editField(container, 'date', 2)];
                case 11:
                    // Moving backward on the first cell moves to the previous row
                    _a.sent();
                    return [4 /*yield*/, editField(container, 'select', 2)];
                case 12:
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '{Shift>}[Tab]{/Shift}')];
                case 13:
                    _a.sent();
                    expectToBeEditingField(container, 'cleared', 1);
                    return [4 /*yield*/, editField(container, 'credit', 1)];
                case 14:
                    // Blurring should close the input
                    input = _a.sent();
                    react_2.fireEvent.blur(input);
                    expect(container.querySelector('input')).toBe(null);
                    return [4 /*yield*/, editField(container, 'notes', 4)];
                case 15:
                    // When reaching the bottom it shouldn't error
                    input = _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '[Enter]')];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test('keybinding escape resets the value', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, input, oldValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = renderTransactions().container;
                    return [4 /*yield*/, editField(container, 'notes', 2)];
                case 1:
                    input = _a.sent();
                    oldValue = input.value;
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'yo new value')];
                case 3:
                    _a.sent();
                    expect(input.value).toEqual('yo new value');
                    return [4 /*yield*/, user_event_1.default.type(input, '[Escape]')];
                case 4:
                    _a.sent();
                    expect(input.value).toEqual(oldValue);
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 5:
                    input = _a.sent();
                    oldValue = input.value;
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'Gener')];
                case 7:
                    _a.sent();
                    expect(input.value).toEqual('Gener');
                    return [4 /*yield*/, user_event_1.default.type(input, '[Escape]')];
                case 8:
                    _a.sent();
                    expect(input.value).toEqual(oldValue);
                    return [2 /*return*/];
            }
        });
    }); });
    test('text fields save when moved away from', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, ks, _b, _c, _d, _i, idx, input_1, oldValue_1, input, oldValue;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
                    ks = [
                        '[Tab]',
                        '[Enter]',
                        '{Shift>}[Tab]{/Shift}',
                        '{Shift>}[Enter]{/Shift}',
                    ];
                    _b = ks;
                    _c = [];
                    for (_d in _b)
                        _c.push(_d);
                    _i = 0;
                    _e.label = 1;
                case 1:
                    if (!(_i < _c.length)) return [3 /*break*/, 7];
                    _d = _c[_i];
                    if (!(_d in _b)) return [3 /*break*/, 6];
                    idx = _d;
                    return [4 /*yield*/, editField(container, 'notes', 2)];
                case 2:
                    input_1 = _e.sent();
                    oldValue_1 = input_1.value;
                    return [4 /*yield*/, user_event_1.default.clear(input_1)];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, user_event_1.default.type(input_1, 'a happy little note' + idx)];
                case 4:
                    _e.sent();
                    // It's not saved yet
                    expect(getTransactions()[2].notes).toBe(oldValue_1);
                    return [4 /*yield*/, user_event_1.default.type(input_1, '[Tab]')];
                case 5:
                    _e.sent();
                    // Now it should be saved!
                    expect(getTransactions()[2].notes).toBe('a happy little note' + idx);
                    expect(queryField(container, 'notes', 'div', 2).textContent).toBe('a happy little note' + idx);
                    _e.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7: return [4 /*yield*/, editField(container, 'notes', 2)];
                case 8:
                    input = _e.sent();
                    oldValue = input.value;
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'another happy note')];
                case 10:
                    _e.sent();
                    // It's not saved yet
                    expect(getTransactions()[2].notes).toBe(oldValue);
                    // Blur the input to make it stop editing
                    return [4 /*yield*/, user_event_1.default.tab()];
                case 11:
                    // Blur the input to make it stop editing
                    _e.sent();
                    expect(getTransactions()[2].notes).toBe('another happy note');
                    return [2 /*return*/];
            }
        });
    }); });
    test('dropdown automatically opens and can be filtered', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, categories, input, items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = renderTransactions().container;
                    categories = categoryGroups.flatMap(function (group) { return group.categories; });
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 1:
                    input = _a.sent();
                    expect(__spreadArray([], react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid*="category-item"]'), true).length).toBe(categoryGroups.length + categories.length);
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'Gener')];
                case 3:
                    _a.sent();
                    items = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid*="category-item"]');
                    expect(items.length).toBe(2);
                    expect(items[0].textContent).toBe('Usual Expenses');
                    expect(items[1].textContent).toBe('General 129.87');
                    // @ts-expect-error fix me
                    expect(items[1].dataset['highlighted']).toBeDefined();
                    // It should not allow filtering on group names
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 4:
                    // It should not allow filtering on group names
                    _a.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'Usual Expenses')];
                case 5:
                    _a.sent();
                    items = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid$="category-item"]');
                    expect(items.length).toBe(3);
                    return [2 /*return*/];
            }
        });
    }); }, 30000);
    test('dropdown selects an item with keyboard', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, input, highlighted;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 1:
                    input = _d.sent();
                    highlighted = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelector('[data-highlighted]');
                    expect(highlighted).toBeNull();
                    return [4 /*yield*/, user_event_1.default.keyboard('[ArrowDown][ArrowDown][ArrowDown][ArrowDown]')];
                case 2:
                    _d.sent();
                    // The right item should be highlighted
                    highlighted = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelector('[data-highlighted]');
                    expect(highlighted).not.toBeNull();
                    expect(highlighted.textContent).toBe('General 129.87');
                    expect(getTransactions()[2].category).toBe((_b = categories.find(function (category) { return category.name === 'Food'; })) === null || _b === void 0 ? void 0 : _b.id);
                    return [4 /*yield*/, user_event_1.default.type(input, '[Enter]')];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 4:
                    _d.sent();
                    // The transactions data should be updated with the right category
                    expect(getTransactions()[2].category).toBe((_c = categories.find(function (category) { return category.name === 'General'; })) === null || _c === void 0 ? void 0 : _c.id);
                    // The category field should still be editing
                    expectToBeEditingField(container, 'category', 2);
                    // No dropdown should be open
                    expect(react_2.screen.queryByTestId('autocomplete')).toBe(null);
                    // Pressing enter should now move down
                    return [4 /*yield*/, user_event_1.default.type(input, '[Enter]')];
                case 5:
                    // Pressing enter should now move down
                    _d.sent();
                    expectToBeEditingField(container, 'category', 3);
                    return [2 /*return*/];
            }
        });
    }); });
    test('dropdown selects an item when clicking', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, items, highlighted;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 1:
                    _d.sent();
                    items = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid$="category-item"]');
                    highlighted = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelector('[data-highlighted]');
                    expect(highlighted).toBeNull();
                    // Hover over an item
                    return [4 /*yield*/, user_event_1.default.hover(items[2])];
                case 2:
                    // Hover over an item
                    _d.sent();
                    // Make sure the expected category is highlighted
                    highlighted = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelector('[data-highlighted]');
                    expect(highlighted).not.toBeNull();
                    expect(highlighted.textContent).toBe('General 129.87');
                    // Click the item and check the before/after values
                    expect(getTransactions()[2].category).toBe((_b = categories.find(function (c) { return c.name === 'Food'; })) === null || _b === void 0 ? void 0 : _b.id);
                    return [4 /*yield*/, user_event_1.default.click(items[2])];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 4:
                    _d.sent();
                    expect(getTransactions()[2].category).toBe((_c = categories.find(function (c) { return c.name === 'General'; })) === null || _c === void 0 ? void 0 : _c.id);
                    // It should still be editing the category
                    expect(react_2.screen.queryByTestId('autocomplete')).toBe(null);
                    expectToBeEditingField(container, 'category', 2);
                    return [2 /*return*/];
            }
        });
    }); });
    test('dropdown hovers but doesn’t change value', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, input, oldCategory, items, highlighted, currentCategory;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 1:
                    input = _c.sent();
                    oldCategory = getTransactions()[2].category;
                    items = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid$="category-item"]');
                    // Hover over a few of the items to highlight them
                    return [4 /*yield*/, user_event_1.default.hover(items[2])];
                case 2:
                    // Hover over a few of the items to highlight them
                    _c.sent();
                    return [4 /*yield*/, user_event_1.default.hover(items[3])];
                case 3:
                    _c.sent();
                    highlighted = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-highlighted]');
                    expect(highlighted).toHaveLength(1);
                    // Navigate away from the field with the keyboard
                    return [4 /*yield*/, user_event_1.default.type(input, '[Tab]')];
                case 4:
                    // Navigate away from the field with the keyboard
                    _c.sent();
                    currentCategory = getTransactions()[2].category;
                    expect(currentCategory).toBe(oldCategory);
                    // @ts-expect-error fix me
                    expect(highlighted.textContent).not.toBe((_b = categories.find(function (c) { return c.id === currentCategory; })) === null || _b === void 0 ? void 0 : _b.name);
                    return [2 /*return*/];
            }
        });
    }); });
    test('dropdown payee displays on new transaction with account list column', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, updateProps, queryByTestId, renderedPayees;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions({
                        currentAccountId: null,
                    }), container = _a.container, updateProps = _a.updateProps, queryByTestId = _a.queryByTestId;
                    updateProps({ isAdding: true });
                    expect(queryByTestId('new-transaction')).toBeTruthy();
                    return [4 /*yield*/, editNewField(container, 'payee')];
                case 1:
                    _b.sent();
                    renderedPayees = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid$="payee-item"]');
                    expect(Array.from(renderedPayees.values()).map(function (p) {
                        return p.getAttribute('data-testid');
                    })).toStrictEqual([
                        'Alice-payee-item',
                        'Bob-payee-item',
                        'This guy on the side of the road-payee-item',
                    ]);
                    // @ts-expect-error fix me
                    expect(renderedPayees).payeesToHaveFavoriteStars([
                        'Alice-payee-item',
                        'Bob-payee-item',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('dropdown payee displays on existing non-transfer transaction', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, renderedPayees;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = renderTransactions().container;
                    return [4 /*yield*/, editField(container, 'payee', 2)];
                case 1:
                    _a.sent();
                    renderedPayees = react_2.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid$="payee-item"]');
                    expect(Array.from(renderedPayees.values()).map(function (p) {
                        return p.getAttribute('data-testid');
                    })).toStrictEqual([
                        'Alice-payee-item',
                        'Bob-payee-item',
                        'This guy on the side of the road-payee-item',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    // TODO: fix this test
    test.skip('dropdown invalid value resets correctly', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, input, tooltipItems;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 1:
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'aaabbbccc')];
                case 3:
                    _b.sent();
                    tooltipItems = container.querySelectorAll('[data-testid="category-item-group"]');
                    expect(tooltipItems.length).toBe(0);
                    expect(getTransactions()[2].category).not.toBe(null);
                    return [4 /*yield*/, user_event_1.default.tab()];
                case 4:
                    _b.sent();
                    expect(getTransactions()[2].category).toBe(null);
                    return [4 /*yield*/, editField(container, 'category', 3)];
                case 5:
                    // Clear out the category value
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 6:
                    _b.sent();
                    // The category should be null when the value is cleared
                    expect(getTransactions()[3].category).not.toBe(null);
                    return [4 /*yield*/, user_event_1.default.tab()];
                case 7:
                    _b.sent();
                    expect(getTransactions()[3].category).toBe(null);
                    return [4 /*yield*/, editField(container, 'payee', 3)];
                case 8:
                    // Clear out the payee value
                    input = _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 10:
                    _b.sent();
                    // The payee should be empty when the value is cleared
                    expect(getTransactions()[3].payee).not.toBe('');
                    return [4 /*yield*/, user_event_1.default.tab()];
                case 11:
                    _b.sent();
                    expect(getTransactions()[3].payee).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    test('dropdown escape resets the value ', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, input, oldValue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = renderTransactions().container;
                    return [4 /*yield*/, editField(container, 'category', 2)];
                case 1:
                    input = _a.sent();
                    oldValue = input.value;
                    return [4 /*yield*/, user_event_1.default.type(input, 'aaabbbccc[Escape]')];
                case 2:
                    _a.sent();
                    expect(input.value).toBe(oldValue);
                    // The tooltip be closed
                    expect(react_2.screen.queryByTestId('autocomplete')).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    test('adding a new transaction works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, queryByTestId, container, getTransactions, updateProps, input;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions(), queryByTestId = _a.queryByTestId, container = _a.container, getTransactions = _a.getTransactions, updateProps = _a.updateProps;
                    expect(getTransactions().length).toBe(5);
                    expect(queryByTestId('new-transaction')).toBe(null);
                    updateProps({ isAdding: true });
                    expect(queryByTestId('new-transaction')).toBeTruthy();
                    input = queryNewField(container, 'date', 'input');
                    // The date input should exist and have a default value
                    expect(input).toBeTruthy();
                    expect(container.ownerDocument.activeElement).toBe(input);
                    expect(input.value).not.toBe('');
                    return [4 /*yield*/, editNewField(container, 'notes')];
                case 1:
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, 'a transaction')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, editNewField(container, 'debit')];
                case 4:
                    input = _b.sent();
                    expect(input.value).toBe('0.00');
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '100[Enter]')];
                case 6:
                    _b.sent();
                    expect(getTransactions().length).toBe(6);
                    expect(getTransactions()[0].amount).toBe(-10000);
                    expect(getTransactions()[0].notes).toBe('a transaction');
                    // The date field should be re-focused to enter a new transaction
                    expect(container.ownerDocument.activeElement).toBe(queryNewField(container, 'date', 'input'));
                    expect(queryNewField(container, 'debit').textContent).toBe('0.00');
                    return [2 /*return*/];
            }
        });
    }); });
    test('adding a new split transaction works', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, updateProps, input, addButton;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions, updateProps = _a.updateProps;
                    updateProps({ isAdding: true });
                    return [4 /*yield*/, editNewField(container, 'debit')];
                case 1:
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '55.00')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, editNewField(container, 'category')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByTestId('split-transaction-button'))];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.click(container.querySelector('[data-testid="add-split-button"]'))];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, editNewField(container, 'debit', 1)];
                case 10:
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '45.00')];
                case 12:
                    _b.sent();
                    expect(container.querySelector('[data-testid="transaction-error"]')).toBeTruthy();
                    return [4 /*yield*/, editNewField(container, 'debit', 2)];
                case 13:
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '10.00')];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.tab()];
                case 16:
                    _b.sent();
                    expect(container.querySelector('[data-testid="transaction-error"]')).toBe(null);
                    addButton = container.querySelector('[data-testid="add-button"]');
                    expect(getTransactions().length).toBe(5);
                    return [4 /*yield*/, user_event_1.default.click(addButton)];
                case 17:
                    _b.sent();
                    expect(getTransactions().length).toBe(8);
                    expect(getTransactions()[0].is_parent).toBe(true);
                    expect(getTransactions()[0].amount).toBe(-5500);
                    expect(getTransactions()[1].is_child).toBe(true);
                    expect(getTransactions()[1].amount).toBe(-4500);
                    expect(getTransactions()[2].is_child).toBe(true);
                    expect(getTransactions()[2].amount).toBe(-1000);
                    return [2 /*return*/];
            }
        });
    }); });
    test('escape closes the new transaction rows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, updateProps, input, cancelButton;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions({
                        onCloseAddTransaction: function () {
                            updateProps({ isAdding: false });
                        },
                    }), container = _a.container, updateProps = _a.updateProps;
                    updateProps({ isAdding: true });
                    input = expectToBeEditingField(container, 'date', 0, true);
                    return [4 /*yield*/, user_event_1.default.type(input, '[Tab]')];
                case 1:
                    _b.sent();
                    input = expectToBeEditingField(container, 'account', 0, true);
                    // The first escape closes the dropdown
                    return [4 /*yield*/, user_event_1.default.type(input, '[Escape]')];
                case 2:
                    // The first escape closes the dropdown
                    _b.sent();
                    expect(container.querySelector('[data-testid="new-transaction"]')).toBeTruthy();
                    // TODO: Fix this
                    // Now it should close the new transaction form
                    // await userEvent.type(input, '[Escape]');
                    // expect(
                    //   container.querySelector('[data-testid="new-transaction"]')
                    // ).toBeNull();
                    // The cancel button should also close the new transaction form
                    updateProps({ isAdding: true });
                    cancelButton = container.querySelectorAll('[data-testid="new-transaction"] [data-testid="cancel-button"]')[0];
                    return [4 /*yield*/, user_event_1.default.click(cancelButton)];
                case 3:
                    _b.sent();
                    expect(container.querySelector('[data-testid="new-transaction"]')).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    test('transaction can be selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, selectCell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    container = renderTransactions().container;
                    return [4 /*yield*/, editField(container, 'date', 2)];
                case 1:
                    _a.sent();
                    selectCell = queryField(container, 'select', '[data-testid=cell-button]', 2);
                    return [4 /*yield*/, user_event_1.default.click(selectCell)];
                case 2:
                    _a.sent();
                    // The header is is selected as well as the single transaction
                    expect(container.querySelectorAll('[data-testid=select] svg').length).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
    test('transaction can be split, updated, and deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        function expectErrorToNotExist(transactions) {
            transactions.forEach(function (transaction) {
                expect(transaction.error).toBeFalsy();
            });
        }
        function expectErrorToExist(transactions) {
            transactions.forEach(function (transaction, idx) {
                if (idx === 0) {
                    expect(transaction.error).toBeTruthy();
                }
                else {
                    expect(transaction.error).toBeFalsy();
                }
            });
        }
        var _a, container, getTransactions, updateProps, transactions, input, toolbars, toolbar, parentId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions, updateProps = _a.updateProps;
                    transactions = __spreadArray([], getTransactions(), true);
                    // Change the id to simulate a new transaction being added, and
                    // work with that one. This makes sure that the transaction table
                    // properly references new data.
                    transactions[0] = __assign(__assign({}, transactions[0]), { id: (0, uuid_1.v4)() });
                    updateProps({ transactions: transactions });
                    return [4 /*yield*/, editField(container, 'category', 0)];
                case 1:
                    input = _b.sent();
                    // Make it clear that we are expected a negative transaction
                    expect(getTransactions()[0].amount).toBe(-2777);
                    expectErrorToNotExist([getTransactions()[0]]);
                    // Make sure splitting a transaction works
                    expect(getTransactions().length).toBe(5);
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByTestId('split-transaction-button'))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 3:
                    _b.sent();
                    expect(getTransactions().length).toBe(6);
                    expect(getTransactions()[0].is_parent).toBe(true);
                    expect(getTransactions()[1].is_child).toBe(true);
                    expect(getTransactions()[1].amount).toBe(0);
                    expectErrorToExist(getTransactions().slice(0, 2));
                    toolbars = react_2.screen.queryAllByTestId('transaction-error');
                    // Make sure the toolbar has appeared
                    expect(toolbars.length).toBe(1);
                    toolbar = toolbars[0];
                    return [4 /*yield*/, editField(container, 'debit', 1)];
                case 4:
                    // Enter an amount for the new split transaction and make sure the
                    // toolbar updates
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '10.00[tab]')];
                case 6:
                    _b.sent();
                    expect(toolbar.innerHTML.includes('17.77')).toBeTruthy();
                    // Add another split transaction and make sure everything is
                    // updated properly
                    return [4 /*yield*/, user_event_1.default.click(toolbar.querySelector('[data-testid="add-split-button"]'))];
                case 7:
                    // Add another split transaction and make sure everything is
                    // updated properly
                    _b.sent();
                    expect(getTransactions().length).toBe(7);
                    expect(getTransactions()[2].amount).toBe(0);
                    expectErrorToExist(getTransactions().slice(0, 3));
                    return [4 /*yield*/, editField(container, 'debit', 2)];
                case 8:
                    // Change the amount to resolve the whole transaction. The toolbar
                    // should disappear and no error should exist
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.clear(input)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '17.77[tab]')];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.tab()];
                case 11:
                    _b.sent();
                    expect(react_2.screen.queryAllByTestId('transaction-error')).toHaveLength(0);
                    expectErrorToNotExist(getTransactions().slice(0, 3));
                    parentId = getTransactions()[0].id;
                    expect(getTransactions().slice(0, 3)).toEqual([
                        {
                            account: accounts[0].id,
                            amount: -2777,
                            category: undefined,
                            cleared: false,
                            date: '2017-01-01',
                            error: null,
                            id: expect.any(String),
                            is_parent: true,
                            notes: 'Notes',
                            payee: 'alice-id',
                            sort_order: 0,
                        },
                        {
                            account: accounts[0].id,
                            amount: -1000,
                            category: undefined,
                            cleared: false,
                            date: '2017-01-01',
                            error: null,
                            id: expect.any(String),
                            is_child: true,
                            parent_id: parentId,
                            payee: 'alice-id',
                            reconciled: undefined,
                            sort_order: -1,
                            starting_balance_flag: null,
                        },
                        {
                            account: accounts[0].id,
                            amount: -1777,
                            category: undefined,
                            cleared: false,
                            date: '2017-01-01',
                            error: null,
                            id: expect.any(String),
                            is_child: true,
                            parent_id: parentId,
                            payee: 'alice-id',
                            reconciled: undefined,
                            sort_order: -2,
                            starting_balance_flag: null,
                        },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('transaction with splits shows 0 in correct column', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, getTransactions, input;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = renderTransactions(), container = _a.container, getTransactions = _a.getTransactions;
                    return [4 /*yield*/, editField(container, 'category', 0)];
                case 1:
                    input = _b.sent();
                    // The first transaction should always be a negative amount
                    expect(getTransactions()[0].amount).toBe(-2777);
                    // Add two new split transactions
                    expect(getTransactions().length).toBe(5);
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByTestId('split-transaction-button'))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, waitForAutocomplete()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByTestId('add-split-button'))];
                case 4:
                    _b.sent();
                    expect(getTransactions().length).toBe(7);
                    // The debit field should show the zeros
                    expect(queryField(container, 'debit', '', 1).textContent).toBe('0.00');
                    expect(queryField(container, 'credit', '', 1).textContent).toBe('');
                    expect(queryField(container, 'debit', '', 2).textContent).toBe('0.00');
                    expect(queryField(container, 'credit', '', 2).textContent).toBe('');
                    return [4 /*yield*/, editField(container, 'credit', 0)];
                case 5:
                    // Change it to a credit transaction
                    input = _b.sent();
                    return [4 /*yield*/, user_event_1.default.type(input, '55.00{Tab}')];
                case 6:
                    _b.sent();
                    // The zeros should now display in the credit column
                    expect(queryField(container, 'debit', '', 1).textContent).toBe('');
                    expect(queryField(container, 'credit', '', 1).textContent).toBe('0.00');
                    expect(queryField(container, 'debit', '', 2).textContent).toBe('');
                    expect(queryField(container, 'credit', '', 2).textContent).toBe('0.00');
                    return [2 /*return*/];
            }
        });
    }); });
});
