import { PublicKey } from '@solana/web3.js';
import { StringPublicKey } from '../utils';
import BN from 'bn.js'

export class RNG {
  initialized: number;
  sample: BN;
  slot: BN;
  constructor(args: {
    initialized: number;
    sample: BN;
    slot: BN;
  }) {
    this.initialized = args.initialized;
    this.sample = args.sample;
    this.slot = args.slot;
  }
}

export class Honeypot {
  initialized: number;
  owner: StringPublicKey;
  bumpSeed: number;
  tickSize: BN;
  maxBetSize: BN;
  minimumBankSize: BN;
  constructor(args: {
    initialized: number;
    owner: StringPublicKey;
    bumpSeed: number;
    tickSize: BN;
    maxBetSize: BN;
    minimumBankSize: BN;
  }) {
    this.initialized = args.initialized;
    this.owner = args.owner;
    this.bumpSeed = args.bumpSeed;
    this.tickSize = args.tickSize;
    this.maxBetSize = args.maxBetSize;
    this.minimumBankSize = args.minimumBankSize;
  }
}

export class RouletteBet {
  bet: number;
  amount: BN;
  constructor(args: {
    bet: number;
    amount: BN;
  }) {
    this.bet = args.bet;
    this.amount = args.amount;
  }
}

export class InitializeArgs {
  instruction: number = 0;
}

export class SampleArgs {
  instruction: number = 1;
  tolerance: BN;
  constructor(args: {
      tolerance: BN
  }) {
    this.tolerance = args.tolerance;
  }
}

export class InitializeHoneypotArgs {
  instruction: number = 2;
  tickSize: BN;
  maxBetSize: BN;
  minimumBankSize: BN;
  constructor(args: {
    tickSize: BN,
    maxBetSize: BN;
    minimumBankSize: BN;
  }) {
    this.tickSize = args.tickSize;
    this.maxBetSize = args.maxBetSize;
    this.minimumBankSize = args.minimumBankSize;
  }
}

export class WithdrawFromHoneypotArgs {
  instruction: number = 3;
  amountToWithdraw: BN;
  constructor(args: {
    amountToWithdraw: BN;
  }) {
    this.amountToWithdraw = args.amountToWithdraw;
  }
}

export class RouletteArgs {
  instruction: number = 4;
  tolerance: BN;
  bets: RouletteBet[];
  constructor(args: {
    tolerance: BN;
    bets: RouletteBet[];
  }) {
    this.tolerance = args.tolerance;
    this.bets = args.bets;
  }
}