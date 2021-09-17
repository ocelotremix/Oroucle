use super::error::UtilError;
use solana_program::{
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    program_error::ProgramError,
    program_option::COption,
    program_pack::{IsInitialized, Pack},
    pubkey::Pubkey,
    sysvar::rent::Rent,
};
use spl_associated_token_account::get_associated_token_address;
use spl_token;
use spl_token::state::Account;

pub fn assert_is_ata(ata: &AccountInfo, wallet: &Pubkey, mint: &Pubkey) -> ProgramResult {
    assert_owned_by(ata, &spl_token::id())?;
    let ata_account: Account = assert_initialized(ata)?;
    assert_keys_equal(ata_account.owner, *wallet)?;
    assert_keys_equal(get_associated_token_address(wallet, mint), *ata.key)?;
    Ok(())
}

pub fn assert_true(statement: bool) -> ProgramResult {
    if !statement {
        Err(UtilError::StatementFalse.into())
    } else {
        Ok(())
    }
}

pub fn assert_signer(account_info: &AccountInfo) -> ProgramResult {
    if !account_info.is_signer {
        Err(ProgramError::MissingRequiredSignature)
    } else {
        Ok(())
    }
}

pub fn assert_rent_exempt(rent: &Rent, account_info: &AccountInfo) -> ProgramResult {
    if !rent.is_exempt(account_info.lamports(), account_info.data_len()) {
        Err(UtilError::NotRentExempt.into())
    } else {
        Ok(())
    }
}

pub fn assert_keys_equal(key1: Pubkey, key2: Pubkey) -> ProgramResult {
    if key1 != key2 {
        Err(UtilError::PublicKeyMismatch.into())
    } else {
        Ok(())
    }
}

pub fn assert_keys_unequal(key1: Pubkey, key2: Pubkey) -> ProgramResult {
    if key1 == key2 {
        Err(UtilError::PublicKeysShouldBeUnique.into())
    } else {
        Ok(())
    }
}

pub fn assert_mint_authority_matches_mint(
    mint_authority: &COption<Pubkey>,
    mint_authority_info: &AccountInfo,
) -> ProgramResult {
    match mint_authority {
        COption::None => {
            return Err(UtilError::InvalidMintAuthority.into());
        }
        COption::Some(key) => {
            if mint_authority_info.key != key {
                return Err(UtilError::InvalidMintAuthority.into());
            }
        }
    }
    Ok(())
}

pub fn assert_initialized<T: Pack + IsInitialized>(
    account_info: &AccountInfo,
) -> Result<T, ProgramError> {
    let account: T = T::unpack_unchecked(&account_info.data.borrow())?;
    if !account.is_initialized() {
        Err(UtilError::UninitializedAccount.into())
    } else {
        Ok(account)
    }
}

pub fn assert_owned_by(account: &AccountInfo, owner: &Pubkey) -> ProgramResult {
    if account.owner != owner {
        Err(UtilError::IncorrectOwner.into())
    } else {
        Ok(())
    }
}
