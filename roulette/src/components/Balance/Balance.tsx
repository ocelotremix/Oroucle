import React, { useMemo } from "react";
import { Flex, FlexProps, Text, Image, Box } from "@chakra-ui/react";
import copeSvg from "../../assets/images/cope.svg";
import balanceBgSvg from "../../assets/images/balance_bg.svg";

export type BalanceProps = FlexProps & {
    cryptoAmount: number;
};

export const Balance: React.FC<BalanceProps> = ({
    cryptoAmount,
    ...restProps
}) => {
    const svgSrc = copeSvg;
    const balance = "My Balance";
    const cryptoAbbr = "Chips";

    return (
        <Box
            display="flex"
            height={"50px"}
            width="200px"
            backgroundColor="black"
            borderLeftRadius={"32px"}
            alignItems="center"
            boxShadow="0px 4px 4px #000000 25%"
            {...restProps}
        >
            <Flex alignItems="center" flexGrow={1}>
                <Image height="32px" width="32px" src="../../assets/images/cope.jpeg" ml="16px" />
                <Flex flexDirection="column" flexGrow={1} ml="12px" mr="16px">
                    <Flex justifyContent="space-between">
                        <Text textStyle="small" color="gray.260">
                            {balance}
                        </Text>
                    </Flex>
                    <Flex justifyContent="space-between">
                        <Text textStyle="caption" color="gray.260">
                            {cryptoAbbr}
                        </Text>
                        <Text textStyle="caption" color="green.300">
                            {cryptoAmount}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Balance;
