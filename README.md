# Stylus - AssemblyScript example program (Sieve of Erathosthenes)

Example of a basic smart contract written in AssemblyScript and compiled to WebAssembly (WASM) to be used on Arbitrum Stylus. It contains an implementation of the [sieve of Erathosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes) algorithm.

Stylus is is an upgrade to Arbitrum, an Ethereum-focused, smart contract blockchain that scales the network. In addition to supporting Ethereum smart contracts written in Solidity, Stylus supports programs written in WebAssembly. Because AssemblyScript compiles to WASM, it can be used to create smart contracts to be used on Stylus.

## Overview

In order to make your AS program work on Stylus, there are a few things to keep in mind:
- The main entry point for the WASM program has to be a specific function called user_entrypoint. There's no need to make any configuration options, but that function must exist, and should receive an i32 (the length of the byte stream received by input) and return another i32 (0 on success, and 1 on error).
- Input data is read from memory by calling the Stylus function `read_args`
- Output data is written in the memory by calling the Stylus function `write_result`
- `bulk-memory` needs to be disabled. When using it, AS will use the DataCountSection of WASM, which is not supported by Stylus yet
- The runtime variant to use must be `minimal` or `stub`, otherwise Stylus won't be able to handle memory instructions effectively
- A custom abort function needs to be declared
- It is recommended to use the optimization options available on AS

This repository holds all these changes and also wraps the Stylus specific flow into its own folder, `stylus`, so the developer only needs to worry about working from the `main()` function in the `app.ts` file. That `main()` function takes the bytes received by the smart contract in Uint8Array form, and has to return the bytes that the smart contract will output, also in Uint8Array form.

## Installation of the Stylus Cargo subcommand

Install the latest version of [Rust](https://www.rust-lang.org/tools/install), and then install the Stylus CLI tool with Cargo
```bash
cargo install cargo-stylus
```

Add the wasm32-unknown-unknown build target to your Rust compiler:
```bash
rustup target add wasm32-unknown-unknown
```

You should now have it available as a Cargo subcommand:
```bash
cargo stylus --help
```

## Steps to build and test

Install dependencies
```bash
npm ci
```

Compile to WASM
```bash
npm run asbuild
```

Test locally (optional)
```bash
npm run test:local 56
```

Check WASM program with stylus
```bash
cargo stylus check --wasm-file-path ./build/release.wasm
```

Estimate gas usage for deployment
```bash
cargo stylus deploy --wasm-file-path ./build/release.wasm --private-key=YOUR_PRIVATE_KEY --estimate-gas-only
```

Deploy smart contract
```bash
cargo stylus deploy --wasm-file-path ./build/release.wasm --private-key=YOUR_PRIVATE_KEY
```

Test on-chain
```bash
npm run test:onchain 56
```

## A note on the local testing file

The file `test/local.js` contains a very basic simulation of how `read_args` and `write_result` behave on Stylus. This file is included only as an example of how one could build a local testing environment fully on JS before deploying the smart contract on Stylus.

## Algorithm implementation

The implementation of the sieve of Erathosthenes algorithm is a slightly modified version of t-katsumura's implementation, available at https://github.com/t-katsumura/webassembly-examples-eratosthenes.

## License

This project is fully open source, including an Apache-2.0 or MIT license at your choosing under your own copyright.