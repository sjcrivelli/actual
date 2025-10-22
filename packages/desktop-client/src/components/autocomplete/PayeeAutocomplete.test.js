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
var react_1 = require("@testing-library/react");
var user_event_1 = require("@testing-library/user-event");
var vitest_1 = require("vitest");
var mocks_1 = require("loot-core/mocks");
var PayeeAutocomplete_1 = require("./PayeeAutocomplete");
var AuthProvider_1 = require("@desktop-client/auth/AuthProvider");
var usePayees_1 = require("@desktop-client/hooks/usePayees");
var mock_1 = require("@desktop-client/redux/mock");
var PAYEE_SELECTOR = '[data-testid][role=option]';
var PAYEE_SECTION_SELECTOR = '[data-testid$="-item-group"]';
var payees = [
    makePayee('Bob', { favorite: true }),
    makePayee('Alice', { favorite: true }),
    makePayee('This guy on the side of the road'),
];
var accounts = [
    (0, mocks_1.generateAccount)('Bank of Montreal', false, false),
];
var defaultProps = {
    value: null,
    embedded: true,
    payees: payees,
    accounts: accounts,
};
function makePayee(name, options) {
    return {
        id: name.toLowerCase() + '-id',
        name: name,
        favorite: (options === null || options === void 0 ? void 0 : options.favorite) ? true : false,
        transfer_acct: undefined,
    };
}
function extractPayeesAndHeaderNames(screen) {
    var autocompleteElement = screen.getByTestId('autocomplete');
    // Get all elements that match either selector, but query them separately
    // and then sort by their position in the DOM to maintain document order
    var headers = __spreadArray([], autocompleteElement.querySelectorAll(PAYEE_SECTION_SELECTOR), true);
    var items = __spreadArray([], autocompleteElement.querySelectorAll(PAYEE_SELECTOR), true);
    // Combine all elements and sort by their position in the DOM
    var allElements = __spreadArray(__spreadArray([], headers, true), items, true);
    allElements.sort(function (a, b) {
        // Compare document position to maintain DOM order
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1;
    });
    return allElements
        .map(function (e) { return e.getAttribute('data-testid'); })
        .map(firstOrIncorrect);
}
function renderPayeeAutocomplete(props) {
    var autocompleteProps = __assign(__assign({}, defaultProps), props);
    (0, react_1.render)(<mock_1.TestProvider>
      <AuthProvider_1.AuthProvider>
        <div data-testid="autocomplete-test">
          <PayeeAutocomplete_1.PayeeAutocomplete {...autocompleteProps} onSelect={vitest_1.vi.fn()} type="single" value={null} embedded={false}/>
        </div>
      </AuthProvider_1.AuthProvider>
    </mock_1.TestProvider>);
    return react_1.screen.getByTestId('autocomplete-test');
}
// Not good, see `Autocomplete.js` for details
function waitForAutocomplete() {
    return new Promise(function (resolve) { return setTimeout(resolve, 0); });
}
function clickAutocomplete(autocomplete) {
    return __awaiter(this, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = autocomplete.querySelector("input");
                    if (!(input != null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, user_event_1.default.click(input)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, waitForAutocomplete()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
vitest_1.vi.mock('../../hooks/usePayees', function () { return ({
    useCommonPayees: vitest_1.vi.fn(),
    usePayees: vitest_1.vi.fn().mockReturnValue([]),
}); });
function firstOrIncorrect(id) {
    return (id === null || id === void 0 ? void 0 : id.split('-', 1)[0]) || 'incorrect';
}
describe('PayeeAutocomplete.getPayeeSuggestions', function () {
    beforeEach(function () {
        vitest_1.vi.mocked(usePayees_1.useCommonPayees).mockReturnValue([]);
    });
    test('favorites get sorted alphabetically', function () { return __awaiter(void 0, void 0, void 0, function () {
        var autocomplete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    autocomplete = renderPayeeAutocomplete();
                    return [4 /*yield*/, clickAutocomplete(autocomplete)];
                case 1:
                    _a.sent();
                    expect(__spreadArray([], react_1.screen.getByTestId('autocomplete').querySelectorAll(PAYEE_SELECTOR), true).map(function (e) { return e.getAttribute('data-testid'); })).toStrictEqual([
                        'Alice-payee-item',
                        'Bob-payee-item',
                        'This guy on the side of the road-payee-item',
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    test('list with less than the maximum favorites adds common payees', function () { return __awaiter(void 0, void 0, void 0, function () {
        var payees, expectedPayeeOrder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payees = [
                        makePayee('Alice'),
                        makePayee('Bob'),
                        makePayee('Eve', { favorite: true }),
                        makePayee('Bruce'),
                        makePayee('Carol'),
                        makePayee('Natasha'),
                        makePayee('Steve'),
                        makePayee('Tony'),
                    ];
                    vitest_1.vi.mocked(usePayees_1.useCommonPayees).mockReturnValue([
                        makePayee('Bruce'),
                        makePayee('Natasha'),
                        makePayee('Steve'),
                        makePayee('Tony'),
                        makePayee('Carol'),
                    ]);
                    expectedPayeeOrder = [
                        'Suggested Payees',
                        'Eve',
                        'Bruce',
                        'Natasha',
                        'Steve',
                        'Tony',
                        'Payees',
                        'Alice',
                        'Bob',
                        'Carol',
                    ];
                    return [4 /*yield*/, clickAutocomplete(renderPayeeAutocomplete({ payees: payees }))];
                case 1:
                    _a.sent();
                    expect(extractPayeesAndHeaderNames(react_1.screen)).toStrictEqual(expectedPayeeOrder);
                    return [2 /*return*/];
            }
        });
    }); });
    test('list with more than the maximum favorites only lists favorites', function () { return __awaiter(void 0, void 0, void 0, function () {
        var payees, expectedPayeeOrder, autocomplete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payees = [
                        makePayee('Alice', { favorite: true }),
                        makePayee('Bob', { favorite: true }),
                        makePayee('Eve', { favorite: true }),
                        makePayee('Bruce', { favorite: true }),
                        makePayee('Carol', { favorite: true }),
                        makePayee('Natasha'),
                        makePayee('Steve'),
                        makePayee('Tony', { favorite: true }),
                    ];
                    vitest_1.vi.mocked(usePayees_1.useCommonPayees).mockReturnValue([
                        makePayee('Bruce'),
                        makePayee('Natasha'),
                        makePayee('Steve'),
                        makePayee('Tony'),
                        makePayee('Carol'),
                    ]);
                    expectedPayeeOrder = [
                        'Suggested Payees',
                        'Alice',
                        'Bob',
                        'Bruce',
                        'Carol',
                        'Eve',
                        'Tony',
                        'Payees',
                        'Natasha',
                        'Steve',
                    ];
                    autocomplete = renderPayeeAutocomplete({ payees: payees });
                    return [4 /*yield*/, clickAutocomplete(autocomplete)];
                case 1:
                    _a.sent();
                    expect(extractPayeesAndHeaderNames(react_1.screen)).toStrictEqual(expectedPayeeOrder);
                    return [2 /*return*/];
            }
        });
    }); });
    test('list with no favorites shows just the payees list', function () { return __awaiter(void 0, void 0, void 0, function () {
        var payees, expectedPayeeOrder, autocomplete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payees = [
                        makePayee('Alice'),
                        makePayee('Bob'),
                        makePayee('Eve'),
                        makePayee('Natasha'),
                        makePayee('Steve'),
                    ];
                    expectedPayeeOrder = ['Alice', 'Bob', 'Eve', 'Natasha', 'Steve'];
                    autocomplete = renderPayeeAutocomplete({ payees: payees });
                    return [4 /*yield*/, clickAutocomplete(autocomplete)];
                case 1:
                    _a.sent();
                    expect(__spreadArray([], react_1.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid][role=option]'), true).map(function (e) { return e.getAttribute('data-testid'); })
                        .flatMap(firstOrIncorrect)).toStrictEqual(expectedPayeeOrder);
                    expect(__spreadArray([], react_1.screen
                        .getByTestId('autocomplete')
                        .querySelectorAll('[data-testid$="-item-group"]'), true).map(function (e) { return e.getAttribute('data-testid'); })
                        .flatMap(firstOrIncorrect)).toStrictEqual(['Payees']);
                    return [2 /*return*/];
            }
        });
    }); });
});
