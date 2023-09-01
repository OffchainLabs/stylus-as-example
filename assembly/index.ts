// External imports provided to all WASM programs on Stylus. These functions
// can be use to read input arguments coming into the program and output arguments to callers.

/**
 * Reads the program calldata. The semantics are equivalent to that of the EVM's
 * [`CALLDATA_COPY`] opcode when requesting the entirety of the current call's calldata.
 * 
 * [`CALLDATA_COPY`]: https://www.evm.codes/#37
 */
// @external("vm_hooks", "read_args")
// export declare function read_args(data: usize): void;

/**
 * Writes the final return data. If not called before the program exists, the return data will
 * be 0 bytes long. Note that this hostio does not cause the program to exit, which happens
 * naturally when [`user_entrypoint`] returns.
 */
// @ts-ignore
@external("vm_hooks", "write_result")
declare function write_result(data: usize, len: i32): void;

// Program functionality
export function get_number(): u8 {
    return 7;
}

// Main entrypoint
export function user_entrypoint(len: i32): i32 {
    const number = i32(get_number());
    write_result(number, 1);

    return 0;
}