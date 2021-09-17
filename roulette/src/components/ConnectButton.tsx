import {
  ButtonGroupProps,
  ButtonGroup,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Settings } from "./Settings";

export type ConnectButtonProps = ButtonGroupProps & {
  isConnected: boolean;
  onClickConnect: () => void;
  onClickChange: () => void;
};

export const ConnectButton: React.FC<ConnectButtonProps> = ({
  isConnected,
  onClickConnect,
  onClickChange,
  ...restProps
}) => {
  return (
    <>
      <ButtonGroup isAttached {...restProps}>
        <Settings/>
      </ButtonGroup>
    </>
  );
};

export default ConnectButton;
