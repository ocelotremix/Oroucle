import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { Balance } from "../Balance/Balance";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "../../contexts";

export const BalancePanel: React.FC = () => {
  const connection = useConnection();
  const wallet = useWallet();
  const [lamports, setLamports] = useState(0);
  useEffect(() => {
    let subId;
    const getLamports = async () => {
      if (!wallet) {
        return 0;
      }
      if (!wallet.publicKey) {
        return 0;
      }
      console.log("Fetching lamports");
      const data = await connection.getAccountInfo(wallet.publicKey);
      if (data) {
        console.log("Received lamports");
        setLamports(data.lamports);
      }
      subId = connection.onAccountChange(wallet.publicKey, (data) => {
        if (data) {
          console.log("Received lamports");
          setLamports(data.lamports);
        }
      });
    };
    getLamports();

    return () => {
      if (subId) connection.removeAccountChangeListener(subId);
    };
  }, [wallet.connected, wallet, connection, setLamports]);
  return (
    <Flex
      flexDirection="column"
      marginLeft="20px"
      marginTop="5px"
      width="100px"
    >
      <Balance cryptoAmount={(lamports as number) / 1e9} />
    </Flex>
  );
};

export default BalancePanel;
