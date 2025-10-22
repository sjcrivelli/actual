"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_2 = require("@testing-library/react");
var user_event_1 = require("@testing-library/user-event");
var CategorySelector_1 = require("./CategorySelector");
function makeCategory(_a) {
    var id = _a.id, name = _a.name, _b = _a.hidden, hidden = _b === void 0 ? false : _b, _c = _a.group, group = _c === void 0 ? '' : _c;
    return { id: id, name: name, hidden: hidden, group: group };
}
function makeCategoryGroup(_a) {
    var id = _a.id, name = _a.name, categories = _a.categories;
    return { id: id, name: name, categories: categories };
}
var cat1 = makeCategory({ id: 'cat1', name: 'Category 1' });
var cat2 = makeCategory({ id: 'cat2', name: 'Category 2' });
var cat3 = makeCategory({ id: 'cat3', name: 'Category 3', hidden: true });
var group1 = makeCategoryGroup({
    id: 'group1',
    name: 'Group 1',
    categories: [cat1, cat2, cat3],
});
var cat4 = makeCategory({ id: 'cat4', name: 'Category 4' });
var group2 = makeCategoryGroup({
    id: 'group2',
    name: 'Group 2',
    categories: [cat4],
});
var categoryGroups = [group1, group2];
var defaultProps = {
    categoryGroups: categoryGroups,
    selectedCategories: [],
    setSelectedCategories: vi.fn(),
    showHiddenCategories: true,
};
describe('CategorySelector', function () {
    it('renders category group and category checkboxes', function () {
        (0, react_2.render)(<CategorySelector_1.CategorySelector {...defaultProps}/>);
        expect(react_2.screen.getByLabelText('Group 1')).toBeInTheDocument();
        expect(react_2.screen.getByLabelText('Category 1')).toBeInTheDocument();
        expect(react_2.screen.getByLabelText('Category 2')).toBeInTheDocument();
        expect(react_2.screen.getByLabelText('Category 3')).toBeInTheDocument();
        expect(react_2.screen.getByLabelText('Group 2')).toBeInTheDocument();
        expect(react_2.screen.getByLabelText('Category 4')).toBeInTheDocument();
    });
    it('calls setSelectedCategories when a category is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setSelectedCategories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedCategories = vi.fn();
                    (0, react_2.render)(<CategorySelector_1.CategorySelector {...defaultProps} setSelectedCategories={setSelectedCategories}/>);
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByLabelText('Category 1'))];
                case 1:
                    _a.sent();
                    expect(setSelectedCategories).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('calls setSelectedCategories when a group is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setSelectedCategories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedCategories = vi.fn();
                    (0, react_2.render)(<CategorySelector_1.CategorySelector {...defaultProps} setSelectedCategories={setSelectedCategories}/>);
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByLabelText('Group 1'))];
                case 1:
                    _a.sent();
                    expect(setSelectedCategories).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('selects all categories when Select All is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setSelectedCategories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedCategories = vi.fn();
                    (0, react_2.render)(<CategorySelector_1.CategorySelector {...defaultProps} setSelectedCategories={setSelectedCategories}/>);
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByRole('button', { name: 'Select All' }))];
                case 1:
                    _a.sent();
                    expect(setSelectedCategories).toHaveBeenCalledWith([
                        cat1,
                        cat2,
                        cat3,
                        cat4,
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('unselects all categories when Unselect All is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setSelectedCategories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedCategories = vi.fn();
                    (0, react_2.render)(<CategorySelector_1.CategorySelector {...defaultProps} selectedCategories={[cat1, cat2, cat3, cat4]} setSelectedCategories={setSelectedCategories}/>);
                    return [4 /*yield*/, user_event_1.default.click(react_2.screen.getByRole('button', { name: 'Unselect All' }))];
                case 1:
                    _a.sent();
                    expect(setSelectedCategories).toHaveBeenCalledWith([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
