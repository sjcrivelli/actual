"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@testing-library/react");
const InitialFocus_1 = require("./InitialFocus");
const View_1 = require("./View");
describe('InitialFocus', () => {
    it('should focus a text input', async () => {
        const component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <input type="text" title="focused"/>
        </InitialFocus_1.InitialFocus>
        <input type="text" title="unfocused"/>
      </View_1.View>);
        // This is needed bc of the `setTimeout` in the `InitialFocus` component.
        await new Promise(resolve => setTimeout(resolve, 0));
        const input = component.getByTitle('focused');
        const unfocusedInput = component.getByTitle('unfocused');
        expect(document.activeElement).toBe(input);
        expect(document.activeElement).not.toBe(unfocusedInput);
    });
    it('should focus a textarea', async () => {
        const component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <textarea title="focused"/>
        </InitialFocus_1.InitialFocus>
        <textarea title="unfocused"/>
      </View_1.View>);
        // This is needed bc of the `setTimeout` in the `InitialFocus` component.
        await new Promise(resolve => setTimeout(resolve, 0));
        const textarea = component.getByTitle('focused');
        const unfocusedTextarea = component.getByTitle('unfocused');
        expect(document.activeElement).toBe(textarea);
        expect(document.activeElement).not.toBe(unfocusedTextarea);
    });
    it('should select text in an input', async () => {
        const component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <input type="text" title="focused" defaultValue="Hello World"/>
        </InitialFocus_1.InitialFocus>
        <input type="text" title="unfocused"/>
      </View_1.View>);
        // This is needed bc of the `setTimeout` in the `InitialFocus` component.
        await new Promise(resolve => setTimeout(resolve, 0));
        const input = component.getByTitle('focused');
        expect(document.activeElement).toBe(input);
        expect(input.selectionStart).toBe(0);
        expect(input.selectionEnd).toBe(11); // Length of "Hello World"
    });
    it('should focus a button', async () => {
        const component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          <button title="focused">Click me</button>
        </InitialFocus_1.InitialFocus>
        <button title="unfocused">Do not click me</button>
      </View_1.View>);
        // This is needed bc of the `setTimeout` in the `InitialFocus` component.
        await new Promise(resolve => setTimeout(resolve, 0));
        const button = component.getByTitle('focused');
        const unfocusedButton = component.getByTitle('unfocused');
        expect(document.activeElement).toBe(button);
        expect(document.activeElement).not.toBe(unfocusedButton);
    });
    it('should focus a custom component with ref forwarding', async () => {
        const CustomInput = (0, react_1.forwardRef)((props, ref) => (<input type="text" ref={ref} {...props} title="focused"/>));
        CustomInput.displayName = 'CustomInput';
        const component = (0, react_2.render)(<View_1.View>
        <InitialFocus_1.InitialFocus>
          {node => <CustomInput ref={node}/>}
        </InitialFocus_1.InitialFocus>
        <input type="text" title="unfocused"/>
      </View_1.View>);
        // This is needed bc of the `setTimeout` in the `InitialFocus` component.
        await new Promise(resolve => setTimeout(resolve, 0));
        const input = component.getByTitle('focused');
        const unfocusedInput = component.getByTitle('unfocused');
        expect(document.activeElement).toBe(input);
        expect(document.activeElement).not.toBe(unfocusedInput);
    });
});
