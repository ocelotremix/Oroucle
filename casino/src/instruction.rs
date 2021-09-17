use crate::state::RouletteBet;
use borsh::{BorshDeserialize, BorshSerialize};

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct SampleArgs {
    pub tolerance: u64,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct InitializeHoneypotArgs {
    pub tick_size: u64,
    pub max_bet_size: u64,
    pub minimum_bank_size: u64,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct WithdrawFromHoneypotArgs {
    pub amount_to_withdraw: u64,
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, PartialEq, Debug, Clone)]
pub struct RouletteArgs {
    pub tolerance: u64,
    pub bets: Vec<RouletteBet>,
}

#[derive(BorshSerialize, BorshDeserialize, Clone)]
pub enum RandomInstruction {
    Initialize,
    Sample(SampleArgs),
    InitializeHoneypot(InitializeHoneypotArgs),
    WithdrawFromHoneypot(WithdrawFromHoneypotArgs),
    Roulette(RouletteArgs),
}
