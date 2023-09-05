
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
function abort(message: usize, fileName: usize, line: u32, column: u32): void {
    return;
}

// Helper functions
export function mark_used(): void {
    memory_grow(0);
}

// Unsigned square root
function usqrt(n: u32): u32 {
    let x = n;
    let y = (x + 1) >> 1;
    while (y < x) {
        x = y;
        y = (x + n / x) >> 1;
    }
    return x;
}

/**
 * Returns the max prime below given "n" using the Sieve of Eratosthenes algorithm
 */
function getMaxPrimeBelow(n: i32): i32 {
    // n is required to be greater than 2
    if (n == 2) {
        return 2;
    } else if (n < 2) {
        return 0;
    }

    // length of sieve array
    let N = (n - 1) / 2;

    // max value to divide
    let Nmax = usqrt(n);

    // sieve array correspond to [3, 5, 7, 9, ..., ]
    let arr = new StaticArray<bool>(N).fill(true);

    let x: u32;
    let y: u32;

    for (let i = 0; i < N; i++) {
        x = 2 * (i + 1) + 1;

        // no need to check the value grater than sqrt(n)
        if (x > Nmax) {
            break;
        }

        for (let j = i + 1; j < N; j++) {
            if (!unchecked(arr[j])) {
                continue;
            }
            y = 2 * (j + 1) + 1;
            if (y % x == 0) {
                unchecked(arr[j] = false);
            }
        }
    }

    // check max prime below n
    let max_val: u32 = 2;
    for (let i = N - 1; i >= 0; i--) {
        if (unchecked(arr[i])) {
            max_val = 2 * (i + 1) + 1;
            break;
        }
    }
    return max_val;
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

    const output = new Uint8Array(1);
    output[0] = getMaxPrimeBelow(data[0]);

    sendOutput(output);
    return 0;
}