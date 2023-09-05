// Imports
import fs from 'fs';
import crypto from 'crypto';

// Constants
const WASM_PATH = './build/release.wasm';

// Variables
let wasmModule;
let inputBytes;
let inputLength;
let outputBytes;
let outputLength;

// Temporary parameters
inputBytes = crypto.randomBytes(2);
inputLength = inputBytes.byteLength;

// Helper functions
const printBytes = (bytes) => {
    return Array.prototype.map.call(new Uint8Array(bytes), x => ('00' + x.toString(16)).slice(-2)).join(' ');
}

// Main function
const main = () => {
    console.log('');
    console.log('-----------------');
    console.log('| Start program |');
    console.log('-----------------');
    console.log('');

    console.log('-----------------');
    console.log('Inputs');
    console.log(`Bytes(HEX): ${printBytes(inputBytes)}`);
    console.log('Length: ' + inputLength);
    console.log('-----------------');
    console.log('');

    console.log('-----------------');
    console.log('Calling user_entrypoint');
    const { user_entrypoint } = wasmModule.exports;
    const result = user_entrypoint(inputLength);
    console.log('-----------------');
    console.log('');

    console.log('-----------------');
    console.log('| Final summary |');
    console.log('-----------------');
    console.log(`Input(HEX): ${printBytes(inputBytes)}`);
    console.log(`Output(HEX): ${printBytes(outputBytes)}`)
    console.log(`Result: ${result}`);
    console.log('-----------------');
    console.log('');
}

// Imports object
const wasmImports = {
    vm_hooks: {
        memory_grow: () => {
            console.log('');
            console.log('* Calling memory_grow *');
            console.log('* END *');
            console.log('');
        },

        read_args: (memoryPtr) => {
            console.log('');
            console.log('* Calling read_args *');
            console.log('Params');
            console.log(`memoryPtr => ${memoryPtr}`);
            const memory = new Uint8Array(wasmModule.exports.memory.buffer);
            const inputArray = new Uint8Array(inputBytes);

            for (let i = memoryPtr; i < (memoryPtr + inputArray.length); i++) {
                memory[i] = inputArray[i - memoryPtr];
            }

            console.log('* END *');
            console.log('');
            return;
        },

        write_result: (memoryPtr, length) => {
            console.log('');
            console.log('* Calling write_result *');
            console.log('Params');
            console.log(`memoryPtr => ${memoryPtr}`);
            console.log(`length => ${length}`);

            const outputMemorySlice = wasmModule.exports.memory.buffer.slice(memoryPtr, memoryPtr+length);
            outputBytes = new Uint8Array(outputMemorySlice);
            outputLength = outputMemorySlice.byteLength;
            console.log(`* Output = ${printBytes(outputBytes)} *`);

            console.log('* END *');
        },
    }
}

////////////////
// Init point //
////////////////

console.log('***********************');
console.log('* Stylus local tester *');
console.log('***********************');
console.log('');

// Loading wasm file
console.log(`Loading WASM module in ${WASM_PATH}...`);
const wasmBuffer = fs.readFileSync(WASM_PATH);
WebAssembly.instantiate(wasmBuffer, wasmImports).then(wM => {
    console.log('Module loaded!');
    wasmModule = wM.instance;
    main();
});