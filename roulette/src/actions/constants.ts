import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export const TICK_SIZE = new BN(1);
export const MAX_BET_SIZE = new BN(100);
export const MINIMUM_BANK_SIZE = new BN(10000);

export const RNG_PROGRAM_ID = new PublicKey("GejaApTc3ShWAgv9jZ8JaFYjZwAw53xz4vD1oAMkjAkc");
export const DEVNET_SOL_PRODUCT_ORACLE = new PublicKey("3Mnn2fX6rQyUsyELYms1sBJyChWofzSNRoqYzvgMVz5E");
export const DEVNET_SOL_PRICE_ORACLE = new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");
export const DEVNET_BTC_PRODUCT_ORACLE = new PublicKey("3m1y5h2uv7EQL3KaJZehvAJa4yDNvgc5yAdL9KPMKwvk");
export const DEVNET_BTC_PRICE_ORACLE = new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J");
export const DEVNET_ETH_PRODUCT_ORACLE = new PublicKey("2ciUuGZiee5macAMeQ7bHGTJtwcYTgnt6jdmQnnKZrfu");
export const DEVNET_ETH_PRICE_ORACLE = new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw");
export const DEVNET_MINT = new PublicKey("8fwwxHB1DDSXgQ8x7qSjRcoBZv5HpNuHaw4TQ38uXx6r");
export const DEVNET_MINT_KEYPAIR = [123, 54, 202, 92, 60, 81, 101, 228, 217, 69, 240, 128, 106, 56, 4, 78, 186, 73, 164, 115, 245, 230, 127, 74, 150, 128, 75, 75, 224, 181, 87, 213, 113, 252, 2, 46, 232, 183, 214, 164, 222, 80, 242, 143, 151, 50, 75, 74, 82, 90, 15, 33, 38, 15, 184, 235, 146, 30, 189, 223, 40, 134, 41, 95];
export const DEVNET_MINT_AUTHORITY = [6, 56, 225, 19, 148, 108, 2, 189, 23, 116, 221, 144, 88, 78, 185, 210, 93, 107, 148, 10, 84, 131, 21, 162, 215, 130, 170, 189, 146, 110, 135, 241, 85, 133, 135, 228, 90, 11, 163, 13, 224, 175, 27, 28, 92, 169, 106, 191, 87, 90, 53, 82, 96, 122, 249, 50, 60, 78, 63, 14, 32, 243, 164, 53];

export const MAINNET_SOL_PRODUCT_ORACLE = new PublicKey("3Mnn2fX6rQyUsyELYms1sBJyChWofzSNRoqYzvgMVz5E");
export const MAINNET_SOL_PRICE_ORACLE = new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix");
export const MAINNET_BTC_PRODUCT_ORACLE = new PublicKey("3m1y5h2uv7EQL3KaJZehvAJa4yDNvgc5yAdL9KPMKwvk");
export const MAINNET_BTC_PRICE_ORACLE = new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J");
export const MAINNET_ETH_PRODUCT_ORACLE = new PublicKey("2ciUuGZiee5macAMeQ7bHGTJtwcYTgnt6jdmQnnKZrfu");
export const MAINNET_ETH_PRICE_ORACLE = new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw");
export const MAINNET_MINT = new PublicKey("8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh"); // COPE