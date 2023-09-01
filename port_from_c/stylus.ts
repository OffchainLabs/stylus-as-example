// Importing functions from hostio.ts (assuming it has been translated to AssemblyScript)
import { memory_grow, read_args, write_result } from "./hostio";

// Enums in AssemblyScript can be declared using the `enum` keyword
export enum ArbStatus {
    Success = 0,
    Failure
}

// In AssemblyScript, we can use classes to define complex types
export class ArbResult {
    status: ArbStatus;
    output: Uint8Array;      // pointers are represented by usize in AssemblyScript
    output_len: usize;

    constructor(status: ArbStatus = ArbStatus.Success, output: Uint8Array = new Uint8Array(0), output_len: usize = 0) {
        this.status = status;
        this.output = output;
        this.output_len = output_len;
    }
}

export class EntryPoint {

    user_main: (args: Uint8Array, args_len: i32) => ArbResult

    // Equivalent of the mark_used function
    mark_used(): void {
        memory_grow(0);
    }

    // Equivalent of the user_entrypoint function
    user_entrypoint(args_len: usize): i32 {
        const args: Uint8Array = new Uint8Array(args_len);

        read_args(args);

        const result: ArbResult = this.user_main(args, args_len);

        write_result(result.output, result.output_len);

        return result.status;
    }

    constructor(user_main: (args: Uint8Array, args_len: i32) => ArbResult) {
        this.user_main = user_main;
    }
}