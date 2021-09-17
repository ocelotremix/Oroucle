import React from "react";
import { Button, ButtonProps, Text } from "@chakra-ui/react";
import { useConnection } from '../contexts';
import { useWallet } from '@solana/wallet-adapter-react';

export type SpinButtonProps = ButtonProps & {
    onClick?: () => void;
};

export const SpinButton: React.FC<SpinButtonProps> = ({
    onClick,
    name,
    ...restProps
}) => {
    return (
        <Button
            border="1px"
            borderRadius="5px"
            borderColor="green.400"
            bgColor="transparent"
            display="inline-block"
            height="42px"
            _hover={{ bgColor: "transparent", borderColor: "green.300" }}
            {...restProps}
            onClick={onClick}
            fontFamily="@font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
            'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
            'Noto Color Emoji'"
        >
            <Text textStyle="emphasis" color="green.400">
                {name}
            </Text>
        </Button>
    );
};

export default SpinButton;
