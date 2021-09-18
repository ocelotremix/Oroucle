import React from "react";
import { Flex, FlexProps, Text, } from "@chakra-ui/react";

export type PanelNameProps = FlexProps & {
    name: string;
};

export const PanelName: React.FC<PanelNameProps> = ({ name, ...restProps }) => {
    return (
        <Flex
            flexDirection="row"
            height="35px"
            mb="1px"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            {...restProps}
        >
            <Text textStyle="accent" color="gray.260">
                {name}
            </Text>
        </Flex>
    );
};

export default PanelName;
