# AssemblyScript - Stylus tests

1. npm ci
2. npm run asbuild
3. cargo stylus check --wasm-file-path ./build/release.wasm
4. cargo stylus deploy --wasm-file-path ./build/release.wasm --private-key=<PRIVATE KEY> --estimate-gas-only
5. cargo stylus deploy --wasm-file-path ./build/release.wasm --private-key=<PRIVATE KEY>