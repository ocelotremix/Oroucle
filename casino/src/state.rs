use borsh::{BorshDeserialize, BorshSerialize};

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Copy)]
pub enum Bet {
    Zero,
    DoubleZero,
    R1,
    B2,
    R3,
    B4,
    R5,
    B6,
    R7,
    B8,
    R9,
    B10,
    B11,
    R12,
    B13,
    R14,
    B15,
    R16,
    B17,
    R18,
    R19,
    B20,
    R21,
    B22,
    R23,
    B24,
    R25,
    B26,
    R27,
    B28,
    B29,
    R30,
    B31,
    R32,
    B33,
    R34,
    B35,
    R36,
    Red,
    Black,
    Even,
    Odd,
    Col1,
    Col2,
    Col3,
    Dozen1,
    Dozen2,
    Dozen3,
    Low,
    High,
}

pub fn is_red(number: u64) -> bool {
    let red_numbers: Vec<u64> = vec![
        1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ];
    red_numbers.contains(&number)
}

#[repr(C)]
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq, Copy)]
pub struct RouletteBet {
    pub bet: Bet,
    pub amount: u64,
}

impl RouletteBet {
    pub fn get_payout(&self, outcome: u64) -> u64 {
        match self.bet {
            Bet::Zero => {
                if outcome == 0 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::DoubleZero => {
                if outcome == 37 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R1 => {
                if outcome == 1 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B2 => {
                if outcome == 2 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R3 => {
                if outcome == 3 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B4 => {
                if outcome == 4 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R5 => {
                if outcome == 5 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B6 => {
                if outcome == 6 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R7 => {
                if outcome == 7 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B8 => {
                if outcome == 8 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R9 => {
                if outcome == 9 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B10 => {
                if outcome == 10 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B11 => {
                if outcome == 11 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R12 => {
                if outcome == 12 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B13 => {
                if outcome == 13 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R14 => {
                if outcome == 14 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B15 => {
                if outcome == 15 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R16 => {
                if outcome == 16 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B17 => {
                if outcome == 17 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R18 => {
                if outcome == 18 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R19 => {
                if outcome == 19 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B20 => {
                if outcome == 20 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R21 => {
                if outcome == 21 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B22 => {
                if outcome == 22 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R23 => {
                if outcome == 23 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B24 => {
                if outcome == 24 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R25 => {
                if outcome == 25 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B26 => {
                if outcome == 26 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R27 => {
                if outcome == 27 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B28 => {
                if outcome == 28 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B29 => {
                if outcome == 29 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R30 => {
                if outcome == 30 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B31 => {
                if outcome == 31 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R32 => {
                if outcome == 32 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B33 => {
                if outcome == 33 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R34 => {
                if outcome == 34 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::B35 => {
                if outcome == 35 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::R36 => {
                if outcome == 36 {
                    self.amount * 36
                } else {
                    0
                }
            }
            Bet::Red => {
                if outcome != 0 && outcome != 37 && is_red(outcome) {
                    self.amount * 2
                } else {
                    0
                }
            }
            Bet::Black => {
                if outcome != 0 && outcome != 37 && !is_red(outcome) {
                    self.amount * 2
                } else {
                    0
                }
            }
            Bet::Even => {
                if outcome != 0 && outcome % 2 == 0 {
                    self.amount * 2
                } else {
                    0
                }
            }
            Bet::Odd => {
                if outcome != 37 && outcome % 2 == 1 {
                    self.amount * 2
                } else {
                    0
                }
            }
            Bet::Col1 => {
                if outcome != 37 && outcome % 3 == 1 {
                    self.amount * 3
                } else {
                    0
                }
            }
            Bet::Col2 => {
                if outcome % 3 == 2 {
                    self.amount * 3
                } else {
                    0
                }
            }
            Bet::Col3 => {
                if outcome != 0 && outcome % 3 == 0 {
                    self.amount * 3
                } else {
                    0
                }
            }
            Bet::Dozen1 => {
                if outcome > 0 && outcome <= 12 {
                    self.amount * 3
                } else {
                    0
                }
            }
            Bet::Dozen2 => {
                if outcome > 12 && outcome <= 24 {
                    self.amount * 3
                } else {
                    0
                }
            }
            Bet::Dozen3 => {
                if outcome > 24 && outcome < 37 {
                    self.amount * 3
                } else {
                    0
                }
            }
            Bet::Low => {
                if outcome > 0 && outcome <= 18 {
                    self.amount * 2
                } else {
                    0
                }
            }
            Bet::High => {
                if outcome > 18 && outcome < 37 {
                    self.amount * 2
                } else {
                    0
                }
            }
        }
    }
}
