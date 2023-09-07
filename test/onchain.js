/*
 * Modify the constants in the "Constant" section with the address of your program
 */

// Imports
import { ethers } from "ethers";

// Constants
const PROGRAM_ADDRESS = "0x590dbaaa1f109d7039414fcc14bfd27450f3d350";
const RPC_URL = "https://stylus-testnet.arbitrum.io/rpc";

// Initial setup
const stylusProvider = new ethers.JsonRpcProvider(RPC_URL);

// Helper functions
const printBytes = (bytes) => {
    return Array.prototype.map.call(new Uint8Array(bytes), x => ('00' + x.toString(16)).slice(-2)).join(' ');
}

// Main function
const main = async (inputNumber) => {
    console.log('');
    console.log('-----------------');
    console.log('| Start program |');
    console.log('-----------------');
    console.log('');

    console.log('-----------------');
    console.log(`Input: ${inputNumber}`);
    console.log('Calling program...');
    
    const resultBytes = await stylusProvider.call({
        to: PROGRAM_ADDRESS,
        data: ethers.toBeHex(inputNumber),
    });
    const result = parseInt(resultBytes, 16);
    
    console.log(`Result: ${result}`);
    console.log('-----------------');
    console.log('');
}

////////////////
// Init point //
////////////////

// Arguments check
if (process.argv.length <= 2) {
    console.log('Usage: npm run test:onchain 56');
    process.exit(1);
}

console.log('*************************');
console.log('* Stylus onchain tester *');
console.log('*************************');
console.log('');

// Getting arguments
const inputNumber = process.argv[2];

main(inputNumber)
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });