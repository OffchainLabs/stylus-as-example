import { i32ToBytes, bytesToI32 } from './utils';

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

/**
 * Main function of your program
 * @dev Receives the input of bytes in Uint8Array. Result must also be sent in bytes wrapped in Uint8Array
 * 
 * @param input bytes in Uint8Array
 * @returns bytes in Uint8Array
 */
export const main = (input: Uint8Array): Uint8Array => {
    const maxNumber = bytesToI32(input);
    const maxPrime = getMaxPrimeBelow(maxNumber);
    return i32ToBytes(maxPrime);
}