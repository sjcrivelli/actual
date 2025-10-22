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
var i18next_1 = require("i18next");
var i18n_1 = require("./i18n");
vi.mock('i18next', function () {
    var i18nMock = {
        use: vi.fn().mockReturnThis(),
        init: vi.fn().mockResolvedValue(undefined),
        changeLanguage: vi.fn(),
    };
    return {
        default: i18nMock,
    };
});
vi.hoisted(vi.resetModules);
describe('setI18NextLanguage', function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            vi.clearAllMocks();
            return [2 /*return*/];
        });
    }); });
    afterEach(vi.unstubAllGlobals);
    test('should set system default language when no language is provided', function () {
        vi.stubGlobal('navigator', { language: 'uk' });
        (0, i18n_1.setI18NextLanguage)('');
        expect(i18next_1.default.changeLanguage).toHaveBeenCalledWith('uk');
    });
    test('should set the provided language if it is available', function () {
        var language = i18n_1.availableLanguages[0];
        (0, i18n_1.setI18NextLanguage)(language);
        expect(i18next_1.default.changeLanguage).toHaveBeenCalledWith(language);
    });
    test('should fallback to English if the provided language is unavailable', function () {
        vi.spyOn(console, 'info');
        (0, i18n_1.setI18NextLanguage)('unknown');
        expect(console.info).toHaveBeenCalledWith('Unknown locale unknown, falling back to en');
        expect(i18next_1.default.changeLanguage).toHaveBeenCalledWith('en');
    });
    test('should successfully use a language with a region code if it is known', function () {
        var language = 'pt-BR';
        (0, i18n_1.setI18NextLanguage)(language);
        expect(i18next_1.default.changeLanguage).toHaveBeenCalledWith(language);
    });
    test('should fallback to base language if the provided language has an unknown region code', function () {
        vi.spyOn(console, 'info');
        (0, i18n_1.setI18NextLanguage)('uk-ZZ');
        expect(console.info).toHaveBeenCalledWith('Unknown locale uk-ZZ, falling back to uk');
        expect(i18next_1.default.changeLanguage).toHaveBeenCalledWith('uk');
    });
    test('should fallback to lowercase language if the provided language has uppercase letters', function () {
        vi.spyOn(console, 'info');
        (0, i18n_1.setI18NextLanguage)('EN');
        expect(console.info).toHaveBeenCalledWith('Unknown locale EN, falling back to en');
        expect(i18next_1.default.changeLanguage).toHaveBeenCalledWith('en');
    });
});
