import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  Connection as Conn,
} from "../contexts";
import {
  createAssociatedTokenAccountInstruction,
  createMintFromAccount,
} from "./account";
import {
  initializeInstruction,
  rouletteInstruction,
  initializeHoneypotInstruction,
} from "./instructions";
import {
  notify,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  toPublicKey,
} from "../utils";
import {
  DECIMALS,
  RNG_PROGRAM_ID,
  DEVNET_SOL_PRICE_ORACLE,
  DEVNET_SOL_PRODUCT_ORACLE,
  DEVNET_BTC_PRODUCT_ORACLE,
  DEVNET_BTC_PRICE_ORACLE,
  DEVNET_ETH_PRODUCT_ORACLE,
  DEVNET_ETH_PRICE_ORACLE,
  DEVNET_MINT,
  MAINNET_SOL_PRICE_ORACLE,
  MAINNET_SOL_PRODUCT_ORACLE,
  MAINNET_BTC_PRODUCT_ORACLE,
  MAINNET_BTC_PRICE_ORACLE,
  MAINNET_ETH_PRODUCT_ORACLE,
  MAINNET_ETH_PRICE_ORACLE,
  MAINNET_MINT,
  DEVNET_MINT_KEYPAIR,
  DEVNET_MINT_AUTHORITY,
  TICK_SIZE,
  MAX_BET_SIZE,
  MINIMUM_BANK_SIZE,
} from "./constants";
import { RouletteBet } from "./state";
import { BET_TO_IDX } from "./betEnum";
import BN from "bn.js";
import { MintLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const getMintAccount = async (
  connection: Connection,
  wallet: any,
  env: string,
  createMintIx: TransactionInstruction[],
  signers: Keypair[]
) => {
  let mintAccount;
  if (env === "devnet") {
    mintAccount = DEVNET_MINT;
    if (!(await connection.getAccountInfo(mintAccount))) {
      const mintRent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );
      const mintAccountKeypair = Keypair.fromSecretKey(
        new Uint8Array(DEVNET_MINT_KEYPAIR)
      );
      const mintAuthority = Keypair.fromSecretKey(
        new Uint8Array(DEVNET_MINT_AUTHORITY)
      );
      createMintFromAccount(
        createMintIx,
        wallet.publicKey,
        mintRent,
        DECIMALS,
        mintAuthority.publicKey,
        mintAuthority.publicKey,
        mintAccountKeypair
      );
      signers.push(mintAccountKeypair);
      const response = await Conn.sendTransactionWithRetry(
        connection,
        wallet,
        [...createMintIx],
        signers,
        "max"
      );
      if (!response) {
        return null;
      }
    }
  } else {
    mintAccount = MAINNET_MINT;
  }
  return mintAccount;
};

export const mintChips = async (
  connection: Connection,
  wallet: any,
  env: string,
  size: number,
) => {
  if (env === "devnet") {
    let signers: Keypair[] = [];
    let ix: TransactionInstruction[] = [];
    const mintAccount = await getMintAccount(
      connection,
      wallet,
      env,
      ix,
      signers
    );
    const mintAuthority = Keypair.fromSecretKey(
      new Uint8Array(DEVNET_MINT_AUTHORITY)
    );
    const token = new Token(
      connection,
      mintAccount,
      TOKEN_PROGRAM_ID,
      mintAuthority
    );
    const tokenAccount = (
      await PublicKey.findProgramAddress(
        [
          wallet.publicKey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          mintAccount.toBuffer(),
        ],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0];

    const traderHasChipAccount = await connection.getAccountInfo(
      new PublicKey(tokenAccount)
    );

    let createATAIx: TransactionInstruction[] = [];
    if (!traderHasChipAccount) {
      console.log("Creating payer AssociatedTokenAccount...");
      createAssociatedTokenAccountInstruction(
        createATAIx,
        tokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        mintAccount
      );
    }
    let mintIx = Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      mintAccount,
      tokenAccount,
      mintAuthority.publicKey,
      [mintAuthority],
      size
    );
    signers.push(mintAuthority);
    await Conn.sendTransactionWithRetry(
      connection,
      wallet,
      [...createATAIx, mintIx],
      signers,
      "max"
    );
  }
};

export const initializeHoneypot = async (
  connection,
  wallet: any,
  env: string
) => {
  console.log(connection.entrypoint);
  if (!wallet.publicKey) {
    notify({ message: "Wallet not connected!" });
    return false;
  }
  console.log(wallet.publicKey);
  let signers: Keypair[] = [];
  let honeypotIx: TransactionInstruction[] = [];
  let createMintIx: TransactionInstruction[] = [];
  let mintIx: TransactionInstruction[] = [];
  let mintAccount = await getMintAccount(
    connection,
    wallet,
    env,
    createMintIx,
    signers
  );
  if (!mintAccount) {
    return false;
  }
  let [honeypotKey, _honeypotBumpSeed] = await PublicKey.findProgramAddress(
    [
      Buffer.from("honeypot"),
      mintAccount.toBuffer(),
      new Uint8Array(TICK_SIZE.toArray("le", 8)),
      new Uint8Array(MAX_BET_SIZE.toArray("le", 8)),
      new Uint8Array(MINIMUM_BANK_SIZE.toArray("le", 8)),
    ],
    RNG_PROGRAM_ID
  );
  let [vaultKey, _vaultBumpSeed] = await PublicKey.findProgramAddress(
    [
      Buffer.from("vault"),
      mintAccount.toBuffer(),
      new Uint8Array(TICK_SIZE.toArray("le", 8)),
      new Uint8Array(MAX_BET_SIZE.toArray("le", 8)),
      new Uint8Array(MINIMUM_BANK_SIZE.toArray("le", 8)),
    ],
    RNG_PROGRAM_ID
  );

  let res = await connection.getAccountInfo(honeypotKey);
  if (!res) {
    let { ix } = await initializeHoneypotInstruction(
      honeypotKey.toBase58(),
      vaultKey.toBase58(),
      mintAccount.toBase58(),
      wallet
    );
    honeypotIx = ix;
    if (env === "devnet") {
      const mintAuthority = Keypair.fromSecretKey(
        new Uint8Array(DEVNET_MINT_AUTHORITY)
      );
      mintIx = [
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          mintAccount,
          vaultKey,
          mintAuthority.publicKey,
          [mintAuthority],
          2 * MINIMUM_BANK_SIZE.toNumber()
        ),
      ];
      signers.push(mintAuthority);
    }
    const response = await Conn.sendTransactionWithRetry(
      connection,
      wallet,
      [...honeypotIx, ...mintIx],
      signers,
      "max"
    );
    if (!response) {
      return false;
    }
  }
  return true;
};

export const sample = async (
  connection: Connection,
  wallet: any,
  env: string,
  ctx: any,
  betTrackerCtx: any
) => {
  if (!wallet.publicKey) {
    notify({ message: "Wallet not connected!" });
    return false;
  }
  console.log(wallet.publicKey);
  let signers: Keypair[] = [];
  let createMintIx: TransactionInstruction[] = [];
  let mintAccount = await getMintAccount(
    connection,
    wallet,
    env,
    createMintIx,
    signers
  );
  if (!mintAccount) {
    notify({ message: "Failed to create mint account" });
    return false;
  }
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
    notify({ message: "RNG account invalid" });
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
  const tokenAccount = (
    await PublicKey.findProgramAddress(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintAccount.toBuffer(),
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];

  const traderHasChipAccount = await connection.getAccountInfo(
    new PublicKey(tokenAccount)
  );

  let createATAIx: TransactionInstruction[] = [];
  if (!traderHasChipAccount) {
    console.log("Creating payer AssociatedTokenAccount...");
    createAssociatedTokenAccountInstruction(
      createATAIx,
      tokenAccount,
      wallet.publicKey,
      wallet.publicKey,
      mintAccount
    );
  }

  let [honeypotKey, _honeypotBumpSeed] = await PublicKey.findProgramAddress(
    [
      Buffer.from("honeypot"),
      mintAccount.toBuffer(),
      new Uint8Array(TICK_SIZE.toArray("le", 8)),
      new Uint8Array(MAX_BET_SIZE.toArray("le", 8)),
      new Uint8Array(MINIMUM_BANK_SIZE.toArray("le", 8)),
    ],
    RNG_PROGRAM_ID
  );
  let [vaultKey, _vaultBumpSeed] = await PublicKey.findProgramAddress(
    [
      Buffer.from("vault"),
      mintAccount.toBuffer(),
      new Uint8Array(TICK_SIZE.toArray("le", 8)),
      new Uint8Array(MAX_BET_SIZE.toArray("le", 8)),
      new Uint8Array(MINIMUM_BANK_SIZE.toArray("le", 8)),
    ],
    RNG_PROGRAM_ID
  );

  console.log(bets);
  console.log(honeypotKey.toBase58());

  let sampleIx: TransactionInstruction[] = [];
  if (env === "devnet") {
    const { ix } = await rouletteInstruction(
      rngAccountKey.toBase58(),
      honeypotKey.toBase58(),
      vaultKey.toBase58(),
      tokenAccount.toBase58(),
      DEVNET_MINT.toBase58(),
      DEVNET_SOL_PRODUCT_ORACLE.toBase58(),
      DEVNET_SOL_PRICE_ORACLE.toBase58(),
      DEVNET_BTC_PRODUCT_ORACLE.toBase58(),
      DEVNET_BTC_PRICE_ORACLE.toBase58(),
      DEVNET_ETH_PRODUCT_ORACLE.toBase58(),
      DEVNET_ETH_PRICE_ORACLE.toBase58(),
      wallet,
      bets
    );
    sampleIx = ix;
  } else {
    console.log("Mainnet")
    const { ix } = await rouletteInstruction(
      rngAccountKey.toBase58(),
      honeypotKey.toBase58(),
      vaultKey.toBase58(),
      tokenAccount.toBase58(),
      MAINNET_MINT.toBase58(),
      MAINNET_SOL_PRODUCT_ORACLE.toBase58(),
      MAINNET_SOL_PRICE_ORACLE.toBase58(),
      MAINNET_BTC_PRODUCT_ORACLE.toBase58(),
      MAINNET_BTC_PRICE_ORACLE.toBase58(),
      MAINNET_ETH_PRODUCT_ORACLE.toBase58(),
      MAINNET_ETH_PRICE_ORACLE.toBase58(),
      wallet,
      bets
    );
    sampleIx = ix;
  }

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
