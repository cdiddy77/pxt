
namespace pxt.blocks {

    interface FieldEditorOptions {
        field: Blockly.FieldCustomConstructor;
        validator?: any;
    }

    let registeredFieldEditors: Map<FieldEditorOptions> = {};
    export const registeredBlockDefinitions: Map<() => void> = {};
    export const registeredBlockCompilers: Map<BlockCompiler> = {};

    export function initFieldEditors() {
        // Initialize PXT custom editors
        const noteValidator = (text: string): string => {
            if (text === null) {
                return null;
            }
            text = String(text);

            let n = parseFloat(text || '0');
            if (isNaN(n) || n < 0) {
                // Invalid number.
                return null;
            }
            // Get the value in range.
            return String(Math.round(Number(text)));
        };
        registerFieldEditor('note', pxtblockly.FieldNote, noteValidator);
        registerFieldEditor('gridpicker', pxtblockly.FieldGridPicker);
    }

    export function registerFieldEditor(selector: string, field: Blockly.FieldCustomConstructor, validator?: any) {
        if (registeredFieldEditors[selector] == undefined) {
            registeredFieldEditors[selector] = {
                field: field,
                validator: validator
            }
        }
    }

    export function createFieldEditor(selector: string, text: string, params: any): Blockly.FieldCustom {
        if (registeredFieldEditors[selector] == undefined) {
            console.error(`Field editor ${selector} not registered`);
            return null;
        }
        let customField = registeredFieldEditors[selector];
        let instance = new customField.field(text, params, customField.validator);
        return instance;
    }

    export function registerBlockDefinition(id: string, init: () => void, compiler?: BlockCompiler) {
        if (registeredBlockDefinitions[id] == undefined) {
            registeredBlockDefinitions[id] = init;
            if (compiler) {
                registeredBlockCompilers[id] = compiler;
            }
        }
    }
}