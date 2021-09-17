import React, { useCallback } from "react";
import { Button, Select } from "antd";
import { useWallet } from "@solana/wallet-adapter-react";
import { ENDPOINTS, useConnectionConfig } from "../../contexts";
import { notify, shortenAddress } from "../../utils";
import { CopyOutlined } from "@ant-design/icons";
import { ModalEnum, useModal, useWalletModal } from "../../contexts";
import { Flex } from "@chakra-ui/layout";

export const Settings = ({
  additionalSettings,
}: {
  additionalSettings?: JSX.Element;
}) => {
  const { connected, disconnect, publicKey } = useWallet();
  const { endpoint, setEndpoint, env } = useConnectionConfig();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);
  const { setModal } = useModal();

  const handleConnect = useCallback(() => {
    setModal(ModalEnum.WALLET);
    setVisible(true);
  }, [setModal, setVisible]);

  return (
    <>
      <Flex flexDirection="column" minW="100%" justifyContent="flex-end">
        <Flex>
          {!connected && (
            <>
            <Select
              onSelect={setEndpoint}
              value={endpoint}
              style={{ width: "100%", marginBottom: 5 }}
            >
              {ENDPOINTS.map(({ name, endpoint }) => (
                <Select.Option value={endpoint} key={endpoint}>
                  {name}
                </Select.Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleConnect}
              style={{ marginBottom: 5 }}
            >
              Connect
            </Button>
            </>
          )}
        </Flex>
        <Flex>
          {connected && (
            <>
              <Flex>
                {publicKey && (
                  <Button
                    style={{ marginBottom: 5 }}
                    onClick={async () => {
                      if (publicKey) {
                        await navigator.clipboard.writeText(
                          publicKey.toBase58()
                        );
                        notify({
                          message: "Wallet update",
                          description: "Address copied to clipboard",
                        });
                      }
                    }}
                  >
                    <CopyOutlined />
                    {shortenAddress(publicKey.toBase58())}
                  </Button>
                )}
              </Flex>
              <Button onClick={open} style={{ marginBottom: 5 }}>
                Change Wallet
              </Button>
              <Button
                type="primary"
                danger={true}
                onClick={() => disconnect().catch()}
                style={{ marginBottom: 5 }}
              >
                Disconnect ({env})
              </Button>
            </>
          )}
        </Flex>
        {additionalSettings}
      </Flex>
    </>
  );
};
