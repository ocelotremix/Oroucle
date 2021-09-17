import {
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import BN from "bn.js";
import { serialize } from "borsh";
import { InitializeArgs, InitializeHoneypotArgs, RouletteArgs, RouletteBet, SampleArgs, WithdrawFromHoneypotArgs } from "./state";
import { toPublicKey, StringPublicKey } from "../utils";
import { schema } from "./schema";
import { RNG_PROGRAM_ID } from "./constants";

export const initializeInstruction = async (
  rngAccountKey: StringPublicKey,
  payerKey: StringPublicKey,
  wallet: any
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError();
  let settings = new InitializeArgs();
  const data = Buffer.from(serialize(schema, settings));
  return {
    ix: [
      new TransactionInstruction({
        keys: [
          {
            pubkey: toPublicKey(rngAccountKey),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(payerKey),
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: toPublicKey(RNG_PROGRAM_ID),
        data,
      }),
    ],
  };
};

export const sampleInstruction = async (
  rngAccountKey: StringPublicKey,
  pythProductKey1: StringPublicKey,
  pythPriceKey1: StringPublicKey,
  pythProductKey2: StringPublicKey,
  pythPriceKey2: StringPublicKey,
  pythProductKey3: StringPublicKey,
  pythPriceKey3: StringPublicKey,
  wallet: any
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError();
  let settings = new SampleArgs({ tolerance: new BN(10) });
  const data = Buffer.from(serialize(schema, settings));
  return {
    ix: [
      new TransactionInstruction({
        keys: [
          {
            pubkey: toPublicKey(rngAccountKey),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(SYSVAR_CLOCK_PUBKEY),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythProductKey1),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythPriceKey1),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythProductKey2),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythPriceKey2),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythProductKey3),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythPriceKey3),
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: toPublicKey(RNG_PROGRAM_ID),
        data,
      }),
    ],
  };
};

export const initializeHoneypotInstruction = async (
  honeypotAccount: StringPublicKey,
  vaultAccount: StringPublicKey,
  wallet: any
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError();
  let settings = new InitializeHoneypotArgs({
    tickSize: new BN(1000000),
    maxBetSize: new BN(100),
    minimumBankSize: new BN(10000000000),
  });
  const data = Buffer.from(serialize(schema, settings));
  return {
    ix: [
      new TransactionInstruction({
        keys: [
          {
            pubkey: toPublicKey(honeypotAccount),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(vaultAccount),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(wallet.publicKey),
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: toPublicKey(RNG_PROGRAM_ID),
        data,
      }),
    ],
  };
};

export const withdrawFromHoneypotInstruction = async (
  honeypotAccount: StringPublicKey,
  vaultAccount: StringPublicKey,
  wallet: any,
  amount: BN,
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError();
  let settings = new WithdrawFromHoneypotArgs({
    amountToWithdraw: amount,
  });
  const data = Buffer.from(serialize(schema, settings));
  return {
    ix: [
      new TransactionInstruction({
        keys: [
          {
            pubkey: toPublicKey(honeypotAccount),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(vaultAccount),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(wallet.publicKey),
            isSigner: true,
            isWritable: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: toPublicKey(RNG_PROGRAM_ID),
        data,
      }),
    ],
  };
};

export const rouletteInstruction = async (
  rngAccountKey: StringPublicKey,
  honeypotAccount: StringPublicKey,
  vaultAccount: StringPublicKey,
  pythProductKey1: StringPublicKey,
  pythPriceKey1: StringPublicKey,
  pythProductKey2: StringPublicKey,
  pythPriceKey2: StringPublicKey,
  pythProductKey3: StringPublicKey,
  pythPriceKey3: StringPublicKey,
  wallet: any,
  bets: RouletteBet[],
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError();
  let settings = new RouletteArgs({ tolerance: new BN(10), bets });
  const data = Buffer.from(serialize(schema, settings));
  return {
    ix: [
      new TransactionInstruction({
        keys: [
          {
            pubkey: toPublicKey(rngAccountKey),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(wallet.publicKey),
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(honeypotAccount),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: toPublicKey(vaultAccount),
            isSigner: false,
            isWritable: true,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(SYSVAR_CLOCK_PUBKEY),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythProductKey1),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythPriceKey1),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythProductKey2),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythPriceKey2),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythProductKey3),
            isSigner: false,
            isWritable: false,
          },
          {
            pubkey: toPublicKey(pythPriceKey3),
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: toPublicKey(RNG_PROGRAM_ID),
        data,
      }),
    ],
  };
};
