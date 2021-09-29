import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export const DECIMALS = 6;
export const TICK_SIZE = new BN(1000000);
export const MAX_BET_SIZE = new BN(100000000);
export const MINIMUM_BANK_SIZE = new BN(3500000000);

// export const RNG_PROGRAM_ID = new PublicKey("rouQqKK4CKYgozmG8fuLTaAt7Crngw3dxsGnrWteuno");
export const RNG_PROGRAM_ID = new PublicKey("GVKYv6LoQsvjceVasABhzgeDH1nc6RyxovNENLk1uuMG");
export const DEVNET_SOL_PRODUCT_ORACLE = new PublicKey("3Mnn2fX6rQyUsyELYms1sBJyChWofzSNRoqYzvgMVz5E");
export const DEVNET_SOL_PRICE_ORACLE = new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");
export const DEVNET_BTC_PRODUCT_ORACLE = new PublicKey("3m1y5h2uv7EQL3KaJZehvAJa4yDNvgc5yAdL9KPMKwvk");
export const DEVNET_BTC_PRICE_ORACLE = new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J");
export const DEVNET_ETH_PRODUCT_ORACLE = new PublicKey("2ciUuGZiee5macAMeQ7bHGTJtwcYTgnt6jdmQnnKZrfu");
export const DEVNET_ETH_PRICE_ORACLE = new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw");
export const DEVNET_MINT = new PublicKey("6dsjVxJGGjvvAPT7zkofsuv9cRUGU2vA51CSqVCpTxce");
export const DEVNET_MINT_KEYPAIR = [140, 153, 174, 106, 128, 238, 133, 77, 118, 137, 44, 181, 197, 159, 92, 116, 183, 221, 29, 16, 17, 93, 129, 9, 249, 78, 194, 148, 128, 179, 172, 102, 83, 188, 181, 27, 211, 171, 12, 252, 90, 164, 17, 213, 21, 109, 75, 4, 234, 70, 52, 111, 28, 13, 157, 34, 1, 179, 61, 127, 121, 243, 132, 175];
export const DEVNET_MINT_AUTHORITY = [146, 133, 123, 2, 141, 56, 242, 164, 120, 66, 53, 190, 204, 22, 197, 239, 78, 22, 44, 233, 58, 168, 80, 97, 116, 6, 44, 7, 81, 230, 147, 174, 3, 109, 228, 205, 45, 81, 70, 97, 174, 106, 205, 12, 103, 80, 17, 220, 214, 252, 152, 63, 153, 11, 80, 111, 153, 20, 182, 173, 22, 205, 245, 55];

export const MAINNET_SOL_PRODUCT_ORACLE = new PublicKey("ALP8SdU9oARYVLgLR7LrqMNCYBnhtnQz1cj6bwgwQmgj");
export const MAINNET_SOL_PRICE_ORACLE = new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG");
export const MAINNET_BTC_PRODUCT_ORACLE = new PublicKey("4aDoSXJ5o3AuvL7QFeR6h44jALQfTmUUCTVGDD6aoJTM");
export const MAINNET_BTC_PRICE_ORACLE = new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU");
export const MAINNET_ETH_PRODUCT_ORACLE = new PublicKey("EMkxjGC1CQ7JLiutDbfYb7UKb3zm9SJcUmr1YicBsdpZ");
export const MAINNET_ETH_PRICE_ORACLE = new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB");
export const MAINNET_MINT = new PublicKey("8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh"); // COPE