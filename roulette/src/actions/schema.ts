import {
  RNG,
  RouletteBet,
  InitializeArgs,
  SampleArgs,
  InitializeHoneypotArgs,
  WithdrawFromHoneypotArgs,
  RouletteArgs,
} from "./state";

export const schema = new Map<any, any>([
  [
    InitializeArgs,
    {
      kind: "struct",
      fields: [["instruction", "u8"]],
    },
  ],
  [
    SampleArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["tolerance", "u64"],
      ],
    },
  ],
  [
    InitializeHoneypotArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["tickSize", "u64"],
        ["maxBetSize", "u64"],
        ["minimumBankSize", "u64"],
      ],
    },
  ],
  [
    WithdrawFromHoneypotArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["amountToWithdraw", "u64"],
      ],
    },
  ],
  [
    RouletteBet,
    {
      kind: "struct",
      fields: [
        ["bet", "u8"],
        ["amount", "u64"],
      ],
    },
  ],
  [
    RouletteArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["tolerance", "u64"],
        ["bets", [RouletteBet]],
      ],
    },
  ],
  [
    RNG,
    {
      kind: "struct",
      fields: [
        ["initialized", "u8"],
        ["sample", "u64"],
        ["slot", "u64"],
      ],
    },
  ],
]);
