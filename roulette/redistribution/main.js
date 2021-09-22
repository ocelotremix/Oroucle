const s = require("@solana/web3.js");
const fs = require("fs");
const bs58 = require("bs58");

const MAINNET_CTX = "https://api.mainnet-beta.solana.com";

const PUBLIC_KEY = new s.PublicKey(
  "rouQqKK4CKYgozmG8fuLTaAt7Crngw3dxsGnrWteuno"
);

// Establish a new connection.
const ctx = new s.Connection(MAINNET_CTX);

function chunks(array, size) {
  return Array.apply(0, new Array(Math.ceil(array.length / size))).map(
    (_, index) => array.slice(index * size, (index + 1) * size)
  );
}

const pubKeyToEntry = {};

const main = async () => {
  console.log("\n");
  let beforeTx = undefined;

  let numberOfTransaction = 0;
  let numberOfSuccessTx = 0;
  let set = new Set();
  let txns = [];
  while (true) {
    console.log("query transactions");
    const txs = await ctx.getConfirmedSignaturesForAddress2(PUBLIC_KEY, {
      before: beforeTx,
    });
    console.log(`got ${txs.length} transactions`);
    const chunked = chunks(txs, 100);
    for (let j = 0; j < chunked.length; j++) {
      const item = chunked[j];
      const content = await ctx.getParsedConfirmedTransactions(
        item.map((t) => t.signature)
      );
      for (let k = 0; k < content.length; k++) {
        const element = content[k];
        numberOfTransaction++;
        if (element.meta.err) {
          continue;
        }
        txns.push(element)
        numberOfSuccessTx++;
      }
      console.log(
        `Total tx: ${numberOfTransaction} success: ${numberOfSuccessTx}`
      );
    }
    beforeTx = txs[txs.length - 1].signature;
    if (txs.length < 1000) {
      break;
    }
  }

  console.log(
    `Total tx: ${numberOfTransaction} success: ${numberOfSuccessTx}`
  );
  fs.writeFileSync(
    "./txns.json",
    JSON.stringify(txns)
  );
};

main();
