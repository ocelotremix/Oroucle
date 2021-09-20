import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import { RouletteWheel } from "./components/RouletteWheel";
import { BetSelection } from "./components/BetSelection";
import { Flex } from "@chakra-ui/layout";
import SpinButton from "./components/SpinButton";
import { useBetTracker } from "./contexts";
import { Button, Radio } from "antd";

function App() {
  const betTrackerCtx: any = useBetTracker();
  const [value, setValue] = useState(1);
  return (
    <div className="App" style={{ backgroundColor: "transparent" }}>
      <Header />
      <header
        className="App-header"
        style={{ backgroundColor: "transparent", minHeight: "90vh" }}
      >
        <Flex
          flexDirection="row"
          mt="10px"
          minW="1130px"
          justifyContent="flex-end"
          ml="35px"
        >
          <Radio.Group
            onChange={(e) => {
              setValue(e.target.value);
            }}
            value={value}
          >
            <Radio value={1} style={{color:'white'}} onClick={() => betTrackerCtx.updateInc(1)}>
              1 chip
            </Radio>
            <Radio value={2} style={{color:'white'}} onClick={() => betTrackerCtx.updateInc(5)}>
              5 chips
            </Radio>
            <Radio value={3} style={{color:'white'}} onClick={() => betTrackerCtx.updateInc(10)}>
              10 chips
            </Radio>
            <Radio value={4} style={{color:'white'}} onClick={() => betTrackerCtx.updateInc(50)}>
              50 chips
            </Radio>
            <Radio value={5} style={{color:'white'}} onClick={() => betTrackerCtx.updateInc(100)}>
              100 chips
            </Radio>
          </Radio.Group>
        </Flex>
        <Flex flexDirection="row" mt="0px">
          <Flex flexDirection="column" ml="35px" mt="40px">
            <RouletteWheel />
          </Flex>
          <Flex flexDirection="column" ml="35px" mt="40px">
            <Flex ml="100px" mt="20px" width="300px" height="630px">
              <BetSelection />
            </Flex>
            <Flex
              ml="170px"
              mt="32px"
              width="300px"
              height="50px"
              alignItems="center"
              alignContent="center"
            >
              <SpinButton
                alignContent="center"
                name="Reset all Bets"
                onClick={() => betTrackerCtx.clear()}
                disabled={betTrackerCtx.locked}
              />
            </Flex>
          </Flex>
        </Flex>
      </header>
    </div>
  );
}

export default App;
