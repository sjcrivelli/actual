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
var React = require("react");
var react_1 = require("react");
var react_2 = require("@testing-library/react");
var InitialFocus_1 = require("./InitialFocus");
var View_1 = require("./View");
describe('InitialFocus', function () {
    it('should focus a text input', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, input, unfocusedInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <input type="text" title="focused"/>
        </InitialFocus_1.InitialFocus>
        <input type="text" title="unfocused"/>
      </View_1.View>);
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1:
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    _a.sent();
                    input = component.getByTitle('focused');
                    unfocusedInput = component.getByTitle('unfocused');
                    expect(document.activeElement).toBe(input);
                    expect(document.activeElement).not.toBe(unfocusedInput);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should focus a textarea', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, textarea, unfocusedTextarea;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <textarea title="focused"/>
        </InitialFocus_1.InitialFocus>
        <textarea title="unfocused"/>
      </View_1.View>);
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1:
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    _a.sent();
                    textarea = component.getByTitle('focused');
                    unfocusedTextarea = component.getByTitle('unfocused');
                    expect(document.activeElement).toBe(textarea);
                    expect(document.activeElement).not.toBe(unfocusedTextarea);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should select text in an input', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <input type="text" title="focused" defaultValue="Hello World"/>
        </InitialFocus_1.InitialFocus>
        <input type="text" title="unfocused"/>
      </View_1.View>);
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1:
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    _a.sent();
                    input = component.getByTitle('focused');
                    expect(document.activeElement).toBe(input);
                    expect(input.selectionStart).toBe(0);
                    expect(input.selectionEnd).toBe(11); // Length of "Hello World"
                    return [2 /*return*/];
            }
        });
    }); });
    it('should focus a button', function () { return __awaiter(void 0, void 0, void 0, function () {
        var component, button, unfocusedButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <button title="focused">Click me</button>
        </InitialFocus_1.InitialFocus>
        <button title="unfocused">Do not click me</button>
      </View_1.View>);
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1:
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    _a.sent();
                    button = component.getByTitle('focused');
                    unfocusedButton = component.getByTitle('unfocused');
                    expect(document.activeElement).toBe(button);
                    expect(document.activeElement).not.toBe(unfocusedButton);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should focus a custom component with ref forwarding', function () { return __awaiter(void 0, void 0, void 0, function () {
        var CustomInput, component, input, unfocusedInput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CustomInput = (0, react_1.forwardRef)(function (props, ref) { return (<input type="text" ref={ref} {...props} title="focused"/>); });
                    CustomInput.displayName = 'CustomInput';
                    component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          {function (node) { return <CustomInput ref={node}/>; }}
        </InitialFocus_1.InitialFocus>
        <input type="text" title="unfocused"/>
      </View_1.View>);
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 0); })];
                case 1:
                    // This is needed bc of the `setTimeout` in the `InitialFocus` component.
                    _a.sent();
                    input = component.getByTitle('focused');
                    unfocusedInput = component.getByTitle('unfocused');
                    expect(document.activeElement).toBe(input);
                    expect(document.activeElement).not.toBe(unfocusedInput);
                    return [2 /*return*/];
            }
        });
    }); });
});
