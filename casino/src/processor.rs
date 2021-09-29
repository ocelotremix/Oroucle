use crate::system_utils::create_or_allocate_account_raw;
use crate::validation_utils::{
    assert_initialized, assert_is_ata, assert_keys_equal, assert_owned_by, assert_signer,
};
use crate::{instruction::RandomInstruction, state::RouletteBet, error::RouletteError};
use arrayref::array_refs;
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    serialize_utils::read_u16,
    system_program, sysvar,
};
use spl_token::{
    instruction::{initialize_account, transfer},
    state::Account,
};

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct RNG {
    pub initialized: bool,
    pub value: u64,
    pub slot: u64,
}

impl RNG {
    pub const LEN: i64 = 1 + 8 + 8;

    pub fn from_account_info(a: &AccountInfo) -> Result<RNG, ProgramError> {
        let rng = RNG::try_from_slice(&a.data.borrow())?;
        Ok(rng)
    }
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct Honeypot {
    pub initialized: bool,
    pub honeypot_bump_seed: u8,
    pub vault_bump_seed: u8,
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub tick_size: u64,
    pub max_bet_size: u64,
    pub minimum_bank_size: u64,
}

impl Honeypot {
    pub const LEN: i64 = 1 + 1 + 1 + 32 + 32 + 8 + 8 + 8;

    pub fn from_account_info(a: &AccountInfo) -> Result<Honeypot, ProgramError> {
        let hp = Honeypot::try_from_slice(&a.data.borrow())?;
        Ok(hp)
    }
}

pub struct Processor;
impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = RandomInstruction::try_from_slice(instruction_data)?;
        match instruction {
            RandomInstruction::Initialize => {
                msg!("Instruction 0: Initialize");
                initialize(program_id, accounts)
            }
            RandomInstruction::Sample(args) => {
                msg!("Instruction 1: Sample");
                sample(accounts, args.tolerance)
            }
            RandomInstruction::InitializeHoneypot(args) => {
                msg!("Instruction 2: InitializeHoneypot");
                msg!("Tick size {}", args.tick_size);
                msg!("Max bet size {}", args.max_bet_size);
                msg!("Minimum bet size {}", args.minimum_bank_size);
                initialize_honeypot(
                    program_id,
                    accounts,
                    args.tick_size,
                    args.max_bet_size,
                    args.minimum_bank_size,
                )
            }
            RandomInstruction::WithdrawFromHoneypot(args) => {
                msg!("Instruction 3: WithdrawFromHoneypot");
                withdraw_from_honeypot(program_id, accounts, args.amount_to_withdraw)
            }
            RandomInstruction::Roulette(args) => {
                msg!("Instruction 4: Roulette");
                roulette(program_id, accounts, args.tolerance, args.bets)
            }
        }
    }
}

fn initialize(program_id: &Pubkey, accounts: &[AccountInfo]) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let rng_account_info = next_account_info(account_info_iter)?;
    let payer_info = next_account_info(account_info_iter)?;
    let rent_sysvar_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;
    if !rng_account_info.data_is_empty() {
        msg!("Received nonempty account");
        return Err(ProgramError::AccountAlreadyInitialized.into());
    }
    let (rng_key, rng_bump_seed) = Pubkey::find_program_address(
        &[b"random", payer_info.key.as_ref(), program_id.as_ref()],
        program_id,
    );
    let rng_seeds = &[
        b"random",
        payer_info.key.as_ref(),
        program_id.as_ref(),
        &[rng_bump_seed],
    ];
    if rng_key != *rng_account_info.key {
        msg!("RNG account doesn't match");
        return Err(ProgramError::InvalidArgument.into());
    }
    create_or_allocate_account_raw(
        rng_account_info,
        rent_sysvar_info,
        system_program_info,
        payer_info,
        program_id,
        RNG::LEN as usize,
        rng_seeds,
    )?;
    Ok(())
}

fn sample(accounts: &[AccountInfo], tolerance: u64) -> ProgramResult {
    let (rng_accounts, remaining_accounts) = array_refs![accounts, 1; .. ;];
    let (random_sample, slot) = random::random::sample(remaining_accounts, tolerance)?;
    let account_info_iter = &mut rng_accounts.iter();
    let rng_info = next_account_info(account_info_iter)?;
    let mut rng = RNG::from_account_info(rng_info)?;
    if !rng.initialized {
        rng.initialized = true;
    }
    rng.value = random_sample;
    rng.slot = slot;
    msg!("Sample {}", random_sample);
    rng.serialize(&mut *rng_info.data.borrow_mut())?;
    Ok(())
}

fn initialize_honeypot(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    tick_size: u64,
    max_bet_size: u64,
    minimum_bank_size: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let honeypot_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let vault_info = next_account_info(account_info_iter)?;
    let owner_info = next_account_info(account_info_iter)?;
    let token_program_info = next_account_info(account_info_iter)?;
    let rent_sysvar_info = next_account_info(account_info_iter)?;
    let system_program_info = next_account_info(account_info_iter)?;
    msg!("Checking CPI program ID's");
    assert_keys_equal(system_program::id(), *system_program_info.key)?;
    assert_keys_equal(spl_token::id(), *token_program_info.key)?;
    msg!("Checking proper mint");
    assert_owned_by(mint_info, token_program_info.key)?;
    let (honeypot_key, honeypot_bump_seed) = Pubkey::find_program_address(
        &[
            b"honeypot",
            mint_info.key.as_ref(),
            &tick_size.to_le_bytes(),
            &max_bet_size.to_le_bytes(),
            &minimum_bank_size.to_le_bytes(),
        ],
        program_id,
    );
    let honeypot_seeds = &[
        b"honeypot",
        mint_info.key.as_ref(),
        &tick_size.to_le_bytes(),
        &max_bet_size.to_le_bytes(),
        &minimum_bank_size.to_le_bytes(),
        &[honeypot_bump_seed],
    ];
    let (vault_key, vault_bump_seed) = Pubkey::find_program_address(
        &[
            b"vault",
            mint_info.key.as_ref(),
            &tick_size.to_le_bytes(),
            &max_bet_size.to_le_bytes(),
            &minimum_bank_size.to_le_bytes(),
        ],
        program_id,
    );
    msg!("Vault {}: ", vault_key);
    let vault_seeds = &[
        b"vault",
        mint_info.key.as_ref(),
        &tick_size.to_le_bytes(),
        &max_bet_size.to_le_bytes(),
        &minimum_bank_size.to_le_bytes(),
        &[vault_bump_seed],
    ];
    create_or_allocate_account_raw(
        honeypot_info,
        rent_sysvar_info,
        system_program_info,
        owner_info,
        program_id,
        Honeypot::LEN as usize,
        honeypot_seeds,
    )?;
    create_or_allocate_account_raw(
        vault_info,
        rent_sysvar_info,
        system_program_info,
        owner_info,
        token_program_info.key,
        Account::LEN,
        vault_seeds,
    )?;
    invoke(
        &initialize_account(
            token_program_info.key,
            vault_info.key,
            mint_info.key,
            honeypot_info.key,
        )?,
        &[
            vault_info.clone(),
            mint_info.clone(),
            honeypot_info.clone(),
            rent_sysvar_info.clone(),
            token_program_info.clone(),
        ],
    )?;
    assert_keys_equal(honeypot_key, *honeypot_info.key)?;
    assert_keys_equal(vault_key, *vault_info.key)?;
    let mut honeypot = Honeypot::from_account_info(honeypot_info)?;
    honeypot.initialized = true;
    honeypot.honeypot_bump_seed = honeypot_bump_seed;
    honeypot.vault_bump_seed = vault_bump_seed;
    honeypot.owner = *owner_info.key;
    honeypot.mint = *mint_info.key;
    honeypot.tick_size = tick_size;
    honeypot.max_bet_size = max_bet_size;
    honeypot.minimum_bank_size = minimum_bank_size;
    honeypot.serialize(&mut *honeypot_info.data.borrow_mut())?;
    Ok(())
}

fn withdraw_from_honeypot(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount_to_withdraw: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let honeypot_info = next_account_info(account_info_iter)?;
    let vault_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let owner_info = next_account_info(account_info_iter)?;
    let owner_token_account_info = next_account_info(account_info_iter)?;
    let token_program_info = next_account_info(account_info_iter)?;
    let honeypot = Honeypot::from_account_info(honeypot_info)?;
    assert_is_ata(owner_token_account_info, owner_info.key, mint_info.key)?;
    assert_signer(owner_info)?;
    assert_owned_by(honeypot_info, program_id)?;
    assert_owned_by(mint_info, token_program_info.key)?;
    assert_keys_equal(spl_token::id(), *token_program_info.key)?;
    assert_keys_equal(honeypot.owner, *owner_info.key)?;
    assert_keys_equal(honeypot.mint, *mint_info.key)?;
    let honeypot_seeds = &[
        b"honeypot",
        mint_info.key.as_ref(),
        &honeypot.tick_size.to_le_bytes(),
        &honeypot.max_bet_size.to_le_bytes(),
        &honeypot.minimum_bank_size.to_le_bytes(),
        &[honeypot.honeypot_bump_seed],
    ];
    let vault_seeds = &[
        b"vault",
        mint_info.key.as_ref(),
        &honeypot.tick_size.to_le_bytes(),
        &honeypot.max_bet_size.to_le_bytes(),
        &honeypot.minimum_bank_size.to_le_bytes(),
        &[honeypot.vault_bump_seed],
    ];
    let honeypot_key = Pubkey::create_program_address(honeypot_seeds, program_id).unwrap();
    let vault_key = Pubkey::create_program_address(vault_seeds, program_id).unwrap();
    assert_keys_equal(honeypot_key, *honeypot_info.key)?;
    assert_keys_equal(vault_key, *vault_info.key)?;
    invoke_signed(
        &transfer(
            token_program_info.key,
            vault_info.key,
            owner_token_account_info.key,
            honeypot_info.key,
            &[],
            amount_to_withdraw,
        )?,
        &[
            vault_info.clone(),
            owner_token_account_info.clone(),
            honeypot_info.clone(),
            token_program_info.clone(),
        ],
        &[honeypot_seeds],
    )?;
    Ok(())
}

fn roulette(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    tolerance: u64,
    bets: Vec<RouletteBet>,
) -> ProgramResult {
    msg!("Starting Roulette spin");
    let (main_accounts, oracle_accounts) = array_refs![accounts, 8; .. ;];
    let (random_sample, slot) = random::random::sample(oracle_accounts, tolerance)?;
    let account_info_iter = &mut main_accounts.iter();
    let rng_info = next_account_info(account_info_iter)?;
    let gambler_info = next_account_info(account_info_iter)?;
    let gambler_token_account_info = next_account_info(account_info_iter)?;
    let mint_info = next_account_info(account_info_iter)?;
    let honeypot_info = next_account_info(account_info_iter)?;
    let vault_info = next_account_info(account_info_iter)?;
    let token_program_info = next_account_info(account_info_iter)?;
    let instruction_sysvar_account_info = next_account_info(account_info_iter)?;
    assert_keys_equal(spl_token::id(), *token_program_info.key)?;
    msg!("ATA check");
    assert_is_ata(gambler_token_account_info, gambler_info.key, mint_info.key)?;
    assert_owned_by(honeypot_info, program_id)?;
    if *instruction_sysvar_account_info.key != sysvar::instructions::id() {
        return Err(ProgramError::InvalidInstructionData);
    }
    let instruction_sysvar = instruction_sysvar_account_info.data.borrow();
    let current_instruction = sysvar::instructions::load_current_index(&instruction_sysvar);
    let mut idx = 0;
    let num_instructions =
        read_u16(&mut idx, &instruction_sysvar).map_err(|_| ProgramError::InvalidAccountData)?;
    msg!(
        "current_ix: {}, num_ix: {}",
        current_instruction,
        num_instructions
    );
    if current_instruction < num_instructions - 1{
        msg!("This must be the last instruction in the transaction");
        return Err(RouletteError::SuspiciousTransaction.into());
    }
    assert_signer(gambler_info)?;
    let mut rng = RNG::from_account_info(rng_info)?;
    let honeypot = Honeypot::from_account_info(honeypot_info)?;
    let vault: Account = assert_initialized(vault_info)?;
    let honeypot_seeds = &[
        b"honeypot",
        mint_info.key.as_ref(),
        &honeypot.tick_size.to_le_bytes(),
        &honeypot.max_bet_size.to_le_bytes(),
        &honeypot.minimum_bank_size.to_le_bytes(),
        &[honeypot.honeypot_bump_seed],
    ];
    let vault_seeds = &[
        b"vault",
        mint_info.key.as_ref(),
        &honeypot.tick_size.to_le_bytes(),
        &honeypot.max_bet_size.to_le_bytes(),
        &honeypot.minimum_bank_size.to_le_bytes(),
        &[honeypot.vault_bump_seed],
    ];
    let honeypot_key = Pubkey::create_program_address(honeypot_seeds, program_id).unwrap();
    let vault_key = Pubkey::create_program_address(vault_seeds, program_id).unwrap();
    assert_keys_equal(honeypot_key, *honeypot_info.key)?;
    assert_keys_equal(vault_key, *vault_info.key)?;
    msg!("Validation checks passed");
    if !rng.initialized {
        rng.initialized = true;
    }
    if rng.slot == slot {
        return Err(RouletteError::InvalidSlot.into());
    }
    rng.value = random_sample;
    rng.slot = slot;
    msg!("Sample {}", random_sample);
    let outcome = rng.value % 38;
    msg!("Roulette Outcome {}", outcome);
    let mut reward: u64 = 0;
    let mut total_amount: u64 = 0;
    for &bet in bets.iter() {
        msg!("Bet Enum: {}, size: {}", bet.bet as u8, bet.amount);
        reward = reward
            .checked_add(bet.get_payout(outcome))
            .ok_or(RouletteError::NumericalOverflow)?;
        msg!("Reward {}", reward);
        total_amount = total_amount
            .checked_add(bet.amount)
            .ok_or(RouletteError::NumericalOverflow)?;
    }
    if total_amount
        .checked_mul(honeypot.tick_size)
        .ok_or(RouletteError::NumericalOverflow)?
        > honeypot.max_bet_size
    {
        msg!("Bet is too large");
        return Err(RouletteError::AmountTooLarge.into());
    }
    if vault.amount <= honeypot.minimum_bank_size {
        msg!("Honeypot funds have been drained. The house needs to reload.");
        return Err(ProgramError::InsufficientFunds.into());
    }
    let total_bet_size = total_amount
        .checked_mul(honeypot.tick_size)
        .ok_or(RouletteError::NumericalOverflow)?;
    msg!("User deposited {} tokens", total_bet_size);
    invoke(
        &transfer(
            token_program_info.key,
            gambler_token_account_info.key,
            vault_info.key,
            gambler_info.key,
            &[],
            total_bet_size,
        )?,
        &[
            gambler_token_account_info.clone(),
            vault_info.clone(),
            gambler_info.clone(),
            token_program_info.clone(),
        ],
    )?;
    let total_reward = reward
        .checked_mul(honeypot.tick_size)
        .ok_or(RouletteError::NumericalOverflow)?;
    if total_reward > 0 {
        msg!("User won {} tokens", total_reward);
        invoke_signed(
            &transfer(
                token_program_info.key,
                vault_info.key,
                gambler_token_account_info.key,
                honeypot_info.key,
                &[],
                total_reward,
            )?,
            &[
                vault_info.clone(),
                gambler_token_account_info.clone(),
                honeypot_info.clone(),
                token_program_info.clone(),
            ],
            &[honeypot_seeds],
        )?;
    }
    rng.serialize(&mut *rng_info.data.borrow_mut())?;
    Ok(())
}
