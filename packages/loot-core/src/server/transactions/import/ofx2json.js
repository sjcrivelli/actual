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
exports.html2Plain = html2Plain;
exports.ofx2json = ofx2json;
// @ts-strict-ignore
var xml2js_1 = require("xml2js");
var months_1 = require("../../../shared/months");
function sgml2Xml(sgml) {
    return sgml
        .replace(/&/g, '&#038;') // Replace ampersands
        .replace(/&amp;/g, '&#038;')
        .replace(/>\s+</g, '><') // remove whitespace inbetween tag close/open
        .replace(/\s+</g, '<') // remove whitespace before a close tag
        .replace(/>\s+/g, '>') // remove whitespace after a close tag
        .replace(/\.(?=[^<>]*>)/g, '') // Remove dots in tag names
        .replace(/<(\w+?)>([^<]+)/g, '<$1>$2</<added>$1>') // Add a new end-tags for the ofx elements
        .replace(/<\/<added>(\w+?)>(<\/\1>)?/g, '</$1>'); // Remove duplicate end-tags
}
function html2Plain(value) {
    return value === null || value === void 0 ? void 0 : value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/(&amp;|&#038;)/g, '&'); // ampersands
}
function parseXml(content) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, xml2js_1.parseStringPromise)(content, {
                        explicitArray: false,
                        trim: true,
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getStmtTrn(data) {
    var ofx = data === null || data === void 0 ? void 0 : data['OFX'];
    if ((ofx === null || ofx === void 0 ? void 0 : ofx['CREDITCARDMSGSRSV1']) != null) {
        return getCcStmtTrn(ofx);
    }
    else if ((ofx === null || ofx === void 0 ? void 0 : ofx['INVSTMTMSGSRSV1']) != null) {
        return getInvStmtTrn(ofx);
    }
    else {
        return getBankStmtTrn(ofx);
    }
}
function getBankStmtTrn(ofx) {
    // Somes values could be an array or a single object.
    // xml2js serializes single item to an object and multiple to an array.
    var msg = ofx === null || ofx === void 0 ? void 0 : ofx['BANKMSGSRSV1'];
    var stmtTrnRs = getAsArray(msg === null || msg === void 0 ? void 0 : msg['STMTTRNRS']);
    var result = stmtTrnRs.flatMap(function (s) {
        var stmtRs = s === null || s === void 0 ? void 0 : s['STMTRS'];
        var tranList = stmtRs === null || stmtRs === void 0 ? void 0 : stmtRs['BANKTRANLIST'];
        var stmtTrn = tranList === null || tranList === void 0 ? void 0 : tranList['STMTTRN'];
        return getAsArray(stmtTrn);
    });
    return result;
}
function getCcStmtTrn(ofx) {
    // Some values could be an array or a single object.
    // xml2js serializes single item to an object and multiple to an array.
    var msg = ofx === null || ofx === void 0 ? void 0 : ofx['CREDITCARDMSGSRSV1'];
    var stmtTrnRs = getAsArray(msg === null || msg === void 0 ? void 0 : msg['CCSTMTTRNRS']);
    var result = stmtTrnRs.flatMap(function (s) {
        var stmtRs = s === null || s === void 0 ? void 0 : s['CCSTMTRS'];
        var tranList = stmtRs === null || stmtRs === void 0 ? void 0 : stmtRs['BANKTRANLIST'];
        var stmtTrn = tranList === null || tranList === void 0 ? void 0 : tranList['STMTTRN'];
        return getAsArray(stmtTrn);
    });
    return result;
}
function getInvStmtTrn(ofx) {
    // Somes values could be an array or a single object.
    // xml2js serializes single item to an object and multiple to an array.
    var msg = ofx === null || ofx === void 0 ? void 0 : ofx['INVSTMTMSGSRSV1'];
    var stmtTrnRs = getAsArray(msg === null || msg === void 0 ? void 0 : msg['INVSTMTTRNRS']);
    var result = stmtTrnRs.flatMap(function (s) {
        var _a;
        var stmtRs = s === null || s === void 0 ? void 0 : s['INVSTMTRS'];
        var tranList = stmtRs === null || stmtRs === void 0 ? void 0 : stmtRs['INVTRANLIST'];
        var stmtTrn = (_a = tranList === null || tranList === void 0 ? void 0 : tranList['INVBANKTRAN']) === null || _a === void 0 ? void 0 : _a.flatMap(function (t) { return t === null || t === void 0 ? void 0 : t['STMTTRN']; });
        return getAsArray(stmtTrn);
    });
    return result;
}
function getAsArray(value) {
    return Array.isArray(value) ? value : value === undefined ? [] : [value];
}
function mapOfxTransaction(stmtTrn) {
    // YYYYMMDDHHMMSS format. We just need the date.
    var dtPosted = stmtTrn['DTPOSTED'];
    var transactionDate = dtPosted
        ? new Date(Number(dtPosted.substring(0, 4)), // year
        Number(dtPosted.substring(4, 6)) - 1, // month (zero-based index)
        Number(dtPosted.substring(6, 8)))
        : null;
    return {
        amount: stmtTrn['TRNAMT'],
        type: stmtTrn['TRNTYPE'],
        fitId: stmtTrn['FITID'],
        date: (0, months_1.dayFromDate)(transactionDate),
        name: html2Plain(stmtTrn['NAME']),
        memo: html2Plain(stmtTrn['MEMO']),
    };
}
function ofx2json(ofx) {
    return __awaiter(this, void 0, void 0, function () {
        var contents, headerString, headers, content, dataParsed, e_1, sanitized;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contents = ofx.split(/<OFX\s?>/, 2);
                    headerString = contents[0].split(/\r?\n/);
                    headers = {};
                    headerString.forEach(function (attrs) {
                        if (attrs) {
                            var headAttr = attrs.split(/:/, 2);
                            headers[headAttr[0]] = headAttr[1];
                        }
                    });
                    content = "<OFX>".concat(contents[1]);
                    dataParsed = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, parseXml(content)];
                case 2:
                    dataParsed = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    e_1 = _a.sent();
                    sanitized = sgml2Xml(content);
                    return [4 /*yield*/, parseXml(sanitized)];
                case 4:
                    dataParsed = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, {
                        headers: headers,
                        transactions: getStmtTrn(dataParsed).map(mapOfxTransaction),
                    }];
            }
        });
    });
}
