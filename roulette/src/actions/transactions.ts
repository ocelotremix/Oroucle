import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { Connection as Conn } from "../contexts";

import {
  initializeInstruction,
  rouletteInstruction,
  initializeHoneypotInstruction,
} from "./instructions";

import { notify, toPublicKey } from "../utils";
import {
  RNG_PROGRAM_ID,
  SOL_PRICE_ORACLE,
  SOL_PRODUCT_ORACLE,
  BTC_PRODUCT_ORACLE,
  BTC_PRICE_ORACLE,
  ETH_PRODUCT_ORACLE,
  ETH_PRICE_ORACLE,
} from "./constants";
import { RouletteBet } from "./state";
import { BET_TO_IDX } from "./betEnum";
import BN from "bn.js";

export const initializeHoneypot = async (
  connection: Connection,
  wallet: any
) => {
  if (!wallet.publicKey) {
    notify({ message: "Wallet not connected!" });
    return false;
  }
  console.log(wallet.publicKey);
  let signers: Keypair[] = [];
  let [honeypotKey, _] = await PublicKey.findProgramAddress(
    [Buffer.from("honeypot"), RNG_PROGRAM_ID.toBuffer()],
    RNG_PROGRAM_ID
  );
  let [vaultKey, _vaultBumpSeed] = await PublicKey.findProgramAddress(
    [Buffer.from("vault"), RNG_PROGRAM_ID.toBuffer()],
    RNG_PROGRAM_ID
  );
  let honeypotIx: TransactionInstruction[] = [];
  if (!honeypotKey) {
    notify({ message: "RNG acount invalid" });
    return false;
  }
  let res = await connection.getAccountInfo(honeypotKey);
  if (!res) {
    let { ix } = await initializeHoneypotInstruction(
      honeypotKey.toBase58(),
      vaultKey.toBase58(),
      wallet
    );
    honeypotIx = ix;
    const response = await Conn.sendTransactionWithRetry(
      connection,
      wallet,
      [...honeypotIx],
      signers,
      "max"
    );
  }
  return true;
};

export const sample = async (
  connection: Connection,
  wallet: any,
  ctx: any,
  betTrackerCtx: any
) => {
  if (!wallet.publicKey) {
    notify({ message: "Wallet not connected!" });
    return false;
  }
  console.log(wallet.publicKey);
  let signers: Keypair[] = [];
  let [rngAccountKey, _] = await PublicKey.findProgramAddress(
    [
      Buffer.from("random"),
      toPublicKey(wallet.publicKey).toBuffer(),
      RNG_PROGRAM_ID.toBuffer(),
    ],
    RNG_PROGRAM_ID
  );
  let createIx: TransactionInstruction[] = [];
  if (!rngAccountKey) {
    notify({ message: "RNG acount invalid" });
    return false;
  }
  let res = await connection.getAccountInfo(rngAccountKey);
  if (!res) {
    let { ix } = await initializeInstruction(
      rngAccountKey.toBase58(),
      wallet.publicKey,
      wallet
    );
    createIx = ix;
  }
  let bets: RouletteBet[] = [];
  for (let [bet, amount] of Object.entries(betTrackerCtx.state)) {
    bets.push(
      new RouletteBet({
        bet: BET_TO_IDX[bet],
        amount: new BN(amount as number),
      })
    );
  }
  let [honeypotKey, _bumpSeed] = await PublicKey.findProgramAddress(
    [Buffer.from("honeypot"), RNG_PROGRAM_ID.toBuffer()],
    RNG_PROGRAM_ID
  );
  let [vaultKey, _vaultBumpSeed] = await PublicKey.findProgramAddress(
    [Buffer.from("vault"), RNG_PROGRAM_ID.toBuffer()],
    RNG_PROGRAM_ID
  );
  console.log(bets);
  console.log(honeypotKey.toBase58());
  const { ix: sampleIx } = await rouletteInstruction(
    rngAccountKey.toBase58(),
    honeypotKey.toBase58(),
    vaultKey.toBase58(),
    SOL_PRODUCT_ORACLE.toBase58(),
    SOL_PRICE_ORACLE.toBase58(),
    BTC_PRODUCT_ORACLE.toBase58(),
    BTC_PRICE_ORACLE.toBase58(),
    ETH_PRODUCT_ORACLE.toBase58(),
    ETH_PRICE_ORACLE.toBase58(),
    wallet,
    bets
  );

  const response = await Conn.sendTransactionWithRetry(
    connection,
    wallet,
    [...createIx, ...sampleIx],
    signers,
    "max"
  );

  if (!response) {
    notify({ message: "Failed to sample program" });
    console.log(response);
    return false;
  } else {
    await ctx.updateSample(rngAccountKey);
    return true;
  }
};
