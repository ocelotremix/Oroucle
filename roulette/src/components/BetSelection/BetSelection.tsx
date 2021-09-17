import React, { useState } from "react";

import "./board.css";
import { useBetTracker } from "../../contexts";
import { Center, Flex, Text } from "@chakra-ui/react";

const formatCell = (cls, text, ctx) => {
  return (
    <div
      style={{ fontSize: 18 }}
      className={cls}
      onClick={() => {
        if (!ctx.locked) ctx.increment(cls);
      }}
      onContextMenu={(e) => {
        if (e.type == "contextmenu") {
          e.preventDefault();
          if (!ctx.locked) ctx.decrement(cls);
        }
      }}
    >
      <Flex flexDirection="column">
        <Flex maxH="60%" minH="60%" align="center">
          <Center w="100%">
            <Text textAlign="center"> {text} </Text>{" "}
          </Center>
        </Flex>
        <Flex flexDirection="row" minH="30%" maxH="30%">
          <Flex flexDirection="column" flexGrow={1}>
            <Text fontSize={11} color="lime" fontWeight="bold">
              {" "}
              {cls in ctx.state ? ctx.state[cls] : ""}{" "}
            </Text>
          </Flex>
          <Flex flexDirection="column" flexGrow={3}></Flex>
        </Flex>
      </Flex>
    </div>
  );
};

const formatSideCell = (pct, cls, text, ctx, fSize = 20) => {
  return (
    <div
      style={{ fontSize: fSize }}
      className={cls}
      onClick={() => {
        if (!ctx.locked) ctx.increment(cls);
      }}
      onContextMenu={(e) => {
        if (e.type == "contextmenu") {
          e.preventDefault();
          if (!ctx.locked) ctx.decrement(cls);
        }
      }}
    >
      <Flex flexDirection="row" minWidth="100%" minHeight="100%">
        <Flex minH={pct}>
          <Center h="100%">
            <Text textAlign="center"> {text} </Text>{" "}
          </Center>
        </Flex>
        <Flex flexDirection="column">
          <Flex flexGrow={5}></Flex>
          <Flex flexGrow={1} minHeight="100%">
            <div
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "lime",
                writingMode: "horizontal-tb",
              }}
            >
              {cls in ctx.state ? ctx.state[cls] : ""}{" "}
            </div>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export const BetSelection: React.FC = ({ ...children }) => {
  const betTrackerCtx = useBetTracker();

  return (
    <div className="container center">
      {formatSideCell("81%", "Low", "0 to 18", betTrackerCtx, 18)}
      {formatSideCell("81%", "Even", "Even", betTrackerCtx)}
      {formatSideCell("81%", "Red", "", betTrackerCtx)}
      {formatSideCell("81%", "Black", "", betTrackerCtx)}
      {formatSideCell("81%", "Odd", "Odd", betTrackerCtx)}
      {formatSideCell("81%", "High", "19 to 36", betTrackerCtx, 18)}
      {formatSideCell("90.5%", "Dozen1", "1st 12", betTrackerCtx, 24)}
      {formatSideCell("90.5%", "Dozen2", "2nd 12", betTrackerCtx, 24)}
      {formatSideCell("90.5%", "Dozen3", "3rd 12", betTrackerCtx, 24)}
      {formatCell("Col1", "2 to 1", betTrackerCtx)}
      {formatCell("Col2", "2 to 1", betTrackerCtx)}
      {formatCell("Col3", "2 to 1", betTrackerCtx)}
      {formatCell("Zero", 0, betTrackerCtx)}
      {formatCell("DoubleZero", '00', betTrackerCtx)}
      {formatCell("R1", 1, betTrackerCtx)}
      {formatCell("B2", 2, betTrackerCtx)}
      {formatCell("R3", 3, betTrackerCtx)}
      {formatCell("B4", 4, betTrackerCtx)}
      {formatCell("R5", 5, betTrackerCtx)}
      {formatCell("B6", 6, betTrackerCtx)}
      {formatCell("R7", 7, betTrackerCtx)}
      {formatCell("B8", 8, betTrackerCtx)}
      {formatCell("R9", 9, betTrackerCtx)}
      {formatCell("B10", 10, betTrackerCtx)}
      {formatCell("B11", 11, betTrackerCtx)}
      {formatCell("R12", 12, betTrackerCtx)}
      {formatCell("B13", 13, betTrackerCtx)}
      {formatCell("R14", 14, betTrackerCtx)}
      {formatCell("B15", 15, betTrackerCtx)}
      {formatCell("R16", 16, betTrackerCtx)}
      {formatCell("B17", 17, betTrackerCtx)}
      {formatCell("R18", 18, betTrackerCtx)}
      {formatCell("R19", 19, betTrackerCtx)}
      {formatCell("B20", 20, betTrackerCtx)}
      {formatCell("R21", 21, betTrackerCtx)}
      {formatCell("B22", 22, betTrackerCtx)}
      {formatCell("R23", 23, betTrackerCtx)}
      {formatCell("B24", 24, betTrackerCtx)}
      {formatCell("R25", 25, betTrackerCtx)}
      {formatCell("B26", 26, betTrackerCtx)}
      {formatCell("R27", 27, betTrackerCtx)}
      {formatCell("B28", 28, betTrackerCtx)}
      {formatCell("B29", 29, betTrackerCtx)}
      {formatCell("R30", 30, betTrackerCtx)}
      {formatCell("B31", 31, betTrackerCtx)}
      {formatCell("R32", 32, betTrackerCtx)}
      {formatCell("B33", 33, betTrackerCtx)}
      {formatCell("R34", 34, betTrackerCtx)}
      {formatCell("B35", 35, betTrackerCtx)}
      {formatCell("R36", 36, betTrackerCtx)}
    </div>
  );
};
