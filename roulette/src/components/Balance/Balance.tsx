import React, { useMemo } from "react";
import { Flex, FlexProps, Text, Image, Box } from "@chakra-ui/react";
import balanceBgSvg from "../../assets/images/balance_bg.svg";

export type BalanceProps = FlexProps & {
  cryptoAmount: number;
};

export const Balance: React.FC<BalanceProps> = ({
  cryptoAmount,
  ...restProps
}) => {
  const balance = "My Balance";
  const cryptoAbbr = "Chips";
  return (
    <Box
      display="flex"
      height={"50px"}
      width="270px"
      backgroundColor="grey"
      borderLeftRadius={"32px"}
      alignItems="center"
      boxShadow="0px 4px 4px #000000 25%"
      {...restProps}
    >
      <Flex alignItems="center" justifyContent="space-evenly" flexGrow={1}>
        <Image width="100px" align="" src="./cope.png" ml="16px" mr="10px" />
        <Flex flexDirection="column" flexGrow={1}>
          <Flex justifyContent="space-between">
            <Text textStyle="small" color="white">
              {balance}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" marginRight="10px">
            <Text textStyle="caption" color="white">
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
