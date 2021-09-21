import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Balance } from "../Balance/Balance";
import { useWallet } from "@solana/wallet-adapter-react";
import { deserializeAccount, useBetTracker, useConnection, useConnectionConfig } from "../../contexts";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { DEVNET_MINT, MAINNET_MINT } from "../../actions";
import { SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } from "../../utils/ids";


export const BalancePanel: React.FC = () => {
  const connection = useConnection();
  const { env } = useConnectionConfig();
  const wallet = useWallet();
  const betTrackerCtx: any = useBetTracker();
  useEffect(() => {
    let subId;
    const getChips = async () => {
      if (!wallet) {
        return 0;
      }
      if (!wallet.publicKey) {
        return 0;
      }
      const mint = (env === "devnet") ? DEVNET_MINT : MAINNET_MINT;
      const chipTokenAccount = (
        await PublicKey.findProgramAddress(
          [wallet.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
          SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID 
        )
      )[0]
      const result = await connection.getAccountInfo(chipTokenAccount);
      if (result) {
        console.log("Received account data");
        const tokenAccount = deserializeAccount(result.data);
        console.log(tokenAccount)
        betTrackerCtx.setChips(tokenAccount.amount.toNumber());
      }
      betTrackerCtx.setLoaded(true);
      subId = connection.onAccountChange(chipTokenAccount, (result) => {
        if (result) {
          console.log("Received account data");
          try {
            const tokenAccount = deserializeAccount(result.data);
            betTrackerCtx.setChips(tokenAccount.amount.toNumber());
          } catch(e) {
            console.log("Failed to deserialize account", e)
          }
        }
      });
    };
    getChips();

    return () => {
      if (subId) connection.removeAccountChangeListener(subId);
    };
  }, [wallet.connected, wallet, connection, betTrackerCtx.setChips]);
  return (
    <Flex
      flexDirection="column"
      marginLeft="20px"
      marginTop="5px"
      width="100px"
    >
      <Balance cryptoAmount={betTrackerCtx.chips as number} />
    </Flex>
  );
};

export default BalancePanel;
