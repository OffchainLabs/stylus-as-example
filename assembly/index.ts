
/**
 * The `ENTRYPOINT` macro handles importing this hostio, which is required if the
 * program's memory grows. Otherwise compilation through the `ArbWasm` precompile will revert.
 * Internally the Stylus VM forces calls to this hostio whenever new WASM pages are allocated.
 * Calls made voluntarily will unproductively consume gas.
 */
// @ts-ignore
@external("vm_hooks", "memory_grow")
declare function memory_grow(pages: usize): void;

/**
 * Reads the program calldata. The semantics are equivalent to that of the EVM's
 * [`CALLDATA_COPY`] opcode when requesting the entirety of the current call's calldata.
 * 
 * [`CALLDATA_COPY`]: https://www.evm.codes/#37
 */
// @ts-ignore
@external("vm_hooks", "read_args")
declare function read_args(data: usize): void;

/**
 * Writes the final return data. If not called before the program exists, the return data will
 * be 0 bytes long. Note that this hostio does not cause the program to exit, which happens
 * naturally when [`user_entrypoint`] returns.
 */
// @ts-ignore
@external("vm_hooks", "write_result")
declare function write_result(data: usize, len: i32): void;

// Fallback functions
function myAbort(message: usize, fileName: usize, line: u32, column: u32): void {
    return;
}

// Helper functions
export function mark_used(): void {
    memory_grow(0);
}

function increment(number: u8): u8 {
    return number+1;
}

function getInput(len: i32): Uint8Array | null {
    const input = new Uint8Array(len);
    read_args(input.dataStart);
    return input;
}

function sendOutput(output: Uint8Array): void {
    write_result(output.dataStart, output.byteLength);
}

// Main entrypoint
export function user_entrypoint(len: i32): i32 {
    const data = getInput(len);
    if (!data) {
        return 1;
    }

    for (let i = 0; i < data.length; i++) {
        data[i] = increment(data[i]);
    }

    sendOutput(data);
    return 0;
}