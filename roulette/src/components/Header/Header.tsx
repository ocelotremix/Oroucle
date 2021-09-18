import React, { useCallback, useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Button } from "antd";

import ConnectButton from "../ConnectButton";
import { ModalEnum, useModal, useWalletModal } from "../../contexts";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "../../contexts/ConnectionContext";
import { PublicKey } from "@solana/web3.js";
import { initializeHoneypot, RNG_PROGRAM_ID } from "../../actions";
import BalancePanel from "../../components/BalancePanel/BalancePanel";

export const Header: React.FC = () => {
  const { setModal } = useModal();
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const connected = wallet.connected;
  const connection = useConnection();

  const [honeypotButton, setHoneypotButton] = useState(true);
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleConnect = useCallback(() => {
    setModal(ModalEnum.WALLET);
    setVisible(true);
  }, [setModal, setVisible]);

  useEffect(() => {
    const getHoneypot = async () => {
      let [honeypotKey, _] = await PublicKey.findProgramAddress(
        [Buffer.from("honeypot"), RNG_PROGRAM_ID.toBuffer()],
        RNG_PROGRAM_ID
      );
      console.log("honeypot", honeypotKey.toBase58())
      try {
        let res = await connection.getAccountInfo(honeypotKey);
        console.log("honeypot data", res)
        if (!res) {
          setHoneypotButton(false);
        }
      } catch {
        return;
      }
    };
    console.log(wallet.publicKey);
    getHoneypot();
  }, [connection]);

  const handleChange = open;
  return (
    <Flex backgroundColor="#444444" justifyContent="space-between" minW="100%">
        
      <BalancePanel/>
      <Flex
        height="62px"
        marginLeft="20px"
        justifyContent="flex-begin"
        alignItems="center"
      >
        {!honeypotButton && (
          <Button
            onClick={() =>
              initializeHoneypot(connection, wallet).then(v => {
                console.log(v);
                if (v) {
                  setHoneypotButton(true);
                }
              })
            }
          >
            {" "}
            Create Honeypot{" "}
          </Button>
        )}
      </Flex>
      <Flex
        height="62px"
        justifyContent="flex-end"
        alignItems="center"
      >
        <ConnectButton
          isConnected={connected}
          mr="36px"
          onClickConnect={handleConnect}
          onClickChange={handleChange}
        />
      </Flex>
    </Flex>
  );
};

export default Header;
