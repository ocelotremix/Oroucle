use hex;
use pyth_client;
use sha256::digest_bytes;
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar,
    sysvar::Sysvar,
};

pub fn get_market_prices_and_confindence_interval<'a>(
    pyth_product_info: &AccountInfo<'a>,
    pyth_price_info: &AccountInfo<'a>,
    current_slot: u64,
    slot_tolerance: u64,
) -> Result<(u64, u64), ProgramError> {
    let pyth_product_data = &pyth_product_info.try_borrow_data()?;
    let pyth_product = pyth_client::cast::<pyth_client::Product>(pyth_product_data);
    if pyth_product.magic != pyth_client::MAGIC {
        msg!("Pyth product account provided is not a valid Pyth account");
        return Err(ProgramError::InvalidArgument.into());
    }
    if pyth_product.atype != pyth_client::AccountType::Product as u32 {
        msg!("Pyth product account provided is not a valid Pyth product account");
        return Err(ProgramError::InvalidArgument.into());
    }
    if pyth_product.ver != pyth_client::VERSION_2 {
        msg!("Pyth product account provided has a different version than the Pyth client");
        return Err(ProgramError::InvalidArgument.into());
    }
    if !pyth_product.px_acc.is_valid() {
        msg!("Pyth product price account is invalid");
        return Err(ProgramError::InvalidArgument.into());
    }
    let pyth_price_pubkey = Pubkey::new(&pyth_product.px_acc.val);
    if &pyth_price_pubkey != pyth_price_info.key {
        msg!("Pyth product price account does not match the Pyth price provided");
        return Err(ProgramError::InvalidArgument.into());
    }
    let pyth_price_data = &pyth_price_info.try_borrow_data()?;
    let pyth_price = pyth_client::cast::<pyth_client::Price>(pyth_price_data);
    msg!("Product {}", pyth_product_info.key);
    msg!("Price {}", pyth_price_info.key);
    msg!(
        "Current Slot {} Pyth Slot {} Valid Slot {} Last Slot {} Prev Slot {}",
        current_slot,
        pyth_price.agg.pub_slot,
        pyth_price.valid_slot,
        pyth_price.last_slot,
        pyth_price.prev_slot
    );
    if current_slot >= pyth_price.agg.pub_slot
        && current_slot - pyth_price.agg.pub_slot < slot_tolerance
    {
        Ok((pyth_price.agg.price as u64, pyth_price.agg.conf))
    } else {
        // For now do nothing, we can modify this later
        msg!("Tolerance Check Failed");
        Ok((pyth_price.agg.price as u64, pyth_price.agg.conf))
    }
}

pub fn sample(
    pyth_accounts: &[AccountInfo],
    slot_tolerance: u64,
) -> Result<(u64, u64), ProgramError> {
    let account_len = pyth_accounts.len();
    if account_len != 7 {
        msg!("Requires exactly 1 clock account and 3 Pyth oracles");
        return Err(ProgramError::NotEnoughAccountKeys.into());
    }
    let account_info_iter = &mut pyth_accounts.iter();
    let clock_account_info = next_account_info(account_info_iter)?;
    let clock = Clock::from_account_info(clock_account_info)?;
    if *clock_account_info.key != sysvar::clock::id() {
        return Err(ProgramError::InvalidArgument)?;
    }
    let mut seeds: [u8; 56] = [0; 56];
    for i in 0..3 {
        let product_account = next_account_info(account_info_iter)?;
        let price_account = next_account_info(account_info_iter)?;
        let (price, conf) = get_market_prices_and_confindence_interval(
            product_account,
            price_account,
            clock.slot,
            slot_tolerance,
        )?;
        let start: usize = 8 * i;
        seeds[start..start + 8].copy_from_slice(&price.to_le_bytes());
        seeds[start + 8..start + 16].copy_from_slice(&conf.to_le_bytes());
    }
    seeds[48..56].copy_from_slice(&clock.slot.to_le_bytes());
    let bytes = digest_bytes(&seeds);
    let hash = match hex::decode(bytes) {
        Ok(v) => v,
        Err(_) => return Err(ProgramError::InvalidSeeds.into()),
    };
    let mut bytes: [u8; 8] = [0; 8];
    bytes.copy_from_slice(&hash[0..8]);
    Ok((u64::from_le_bytes(bytes), clock.slot))
}
