import React, { useCallback, useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { Button } from "antd";

import ConnectButton from "../ConnectButton";
import {
  ModalEnum,
  useBetTracker,
  useModal,
  useWalletModal,
  deserializeAccount,
} from "../../contexts";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useConnection,
  useConnectionConfig,
} from "../../contexts/ConnectionContext";
import { PublicKey } from "@solana/web3.js";
import {
  TICK_SIZE,
  MAX_BET_SIZE,
  MINIMUM_BANK_SIZE,
  DEVNET_MINT,
  initializeHoneypot,
  MAINNET_MINT,
  RNG_PROGRAM_ID,
  mintChips,
  DECIMALS,
} from "../../actions";
import BalancePanel from "../../components/BalancePanel/BalancePanel";
import { set } from "lodash";

const getMintString = (connection, wallet, env, ctx) => {
  let mintString;
  let color;
  let textColor;
  const maxChips = MAX_BET_SIZE.toNumber();
  if (env === 'devnet' && ctx.loaded && ctx.chips < maxChips) {
    const remainder = maxChips - ctx.chips;
    mintString = `Mint ${remainder / TICK_SIZE.toNumber()} chips`;
    color = "lightgreen";
    textColor = "black";
    return (
      <Button
        onClick={() => mintChips(connection, wallet, env, remainder)}
        style={{ backgroundColor: color, color: textColor, border: "none" }}
        disabled={ctx.chips > maxChips}
      >
        {mintString}
      </Button>
    );
  } else {
    return ""
  }
};

export const Header: React.FC = () => {
  const { setModal } = useModal();
  const { setVisible } = useWalletModal();
  const wallet = useWallet();
  const connected = wallet.connected;
  const connection = useConnection();
  const { env } = useConnectionConfig();
  const [honeypotButton, setHoneypotButton] = useState(true);
  const betTrackerCtx: any = useBetTracker();
  const [houseBalance, setHouseBalance] = useState(0);
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleConnect = useCallback(() => {
    setModal(ModalEnum.WALLET);
    setVisible(true);
  }, [setModal, setVisible]);

  useEffect(() => {}, [betTrackerCtx.grayscale]);

  useEffect(() => {
    const getHoneypot = async () => {
      let mintAccount = env === "devnet" ? DEVNET_MINT : MAINNET_MINT;
      let [honeypotKey, _honeypotBumpSeed] = await PublicKey.findProgramAddress(
        [
          Buffer.from("honeypot"),
          mintAccount.toBuffer(),
          new Uint8Array(TICK_SIZE.toArray("le", 8)),
          new Uint8Array(MAX_BET_SIZE.toArray("le", 8)),
          new Uint8Array(MINIMUM_BANK_SIZE.toArray("le", 8)),
        ],
        RNG_PROGRAM_ID
      );
      console.log("honeypot", honeypotKey.toBase58());
      try {
        let res = await connection.getAccountInfo(honeypotKey);
        if (!res) {
          setHoneypotButton(false);
        }
      } catch (e) {
        console.log("Failed to fetch honeypot: ", e);
        return;
      }
    };
    console.log(wallet.publicKey);
    getHoneypot();
  }, [connection]);

  useEffect(() => {
    let subId;
    const getHouseBalance = async () => {
      if (!wallet) {
        return 0;
      }
      if (!wallet.publicKey) {
        return 0;
      }
      const mint = (env === "devnet") ? DEVNET_MINT : MAINNET_MINT;
      let [vaultKey, _vaultBumpSeed] = await PublicKey.findProgramAddress(
        [
          Buffer.from("vault"),
          mint.toBuffer(),
          new Uint8Array(TICK_SIZE.toArray("le", 8)),
          new Uint8Array(MAX_BET_SIZE.toArray("le", 8)),
          new Uint8Array(MINIMUM_BANK_SIZE.toArray("le", 8)),
        ],
        RNG_PROGRAM_ID
      );
      const result = await connection.getAccountInfo(vaultKey);
      if (result) {
        console.log("Received account data");
        const tokenAccount = deserializeAccount(result.data);
        console.log(tokenAccount)
        setHouseBalance(tokenAccount.amount.toNumber());
      }
      betTrackerCtx.setLoaded(true);
      subId = connection.onAccountChange(vaultKey, (result) => {
        if (result) {
          console.log("Received account data");
          try {
            const tokenAccount = deserializeAccount(result.data);
            setHouseBalance(tokenAccount.amount.toNumber());
          } catch(e) {
            console.log("Failed to deserialize account", e)
          }
        }
      });
    };
    getHouseBalance();
    return () => {
      if (subId) connection.removeAccountChangeListener(subId);
    };
  }, [wallet.connected, wallet, connection, setHouseBalance]);

  const handleChange = open;
  return (
    <Flex backgroundColor="#444444" justifyContent="space-between" minW="100%" filter={betTrackerCtx.grayscale}>
      <Flex justifyContent="flex-begin" minW="500px">
        <BalancePanel />
        <Flex
          marginLeft="180px"
          height="62px"
          justifyContent="flex-begin"
          alignItems="center"
        >
          {getMintString(connection, wallet, env, betTrackerCtx)}
        </Flex>
      </Flex>
      {/* <Flex
        height="62px"
        marginLeft="20px"
        justifyContent="flex-begin"
        alignItems="center"
      >
        {connected && !honeypotButton && (
          <Button
            onClick={() =>
              initializeHoneypot(connection, wallet, env).then((v) => {
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
      </Flex> */}
      <Flex
        height="62px"
        minW="400px"
        marginLeft="20px"
        justifyContent="50%"
        alignItems="center"
        fontSize={20}
        color="white"
      >
        House Balance: {houseBalance * Math.pow(10, -DECIMALS)} COPE
      </Flex>
      <Flex height="62px" width="300px" justifyContent="flex-end" alignItems="center">
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
