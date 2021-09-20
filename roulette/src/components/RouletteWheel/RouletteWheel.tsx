import React, { useEffect, useState } from "react";
import SpinButton from "../SpinButton";
import { useRNG } from "../../actions";
import { useWallet } from "@solana/wallet-adapter-react";

import "./styles.css";
import { useBetTracker, useConnection, useConnectionConfig } from "../../contexts";
import { notify } from "../../utils/notifications";
import { useConfetti } from "../Confetti";

const rouletteState = {
  list: [
    "37",
    "27",
    "10",
    "25",
    "29",
    "12",
    "8",
    "19",
    "31",
    "18",
    "6",
    "21",
    "33",
    "16",
    "4",
    "23",
    "35",
    "14",
    "2",
    "0",
    "28",
    "9",
    "26",
    "30",
    "11",
    "7",
    "20",
    "32",
    "17",
    "5",
    "22",
    "34",
    "15",
    "3",
    "24",
    "36",
    "13",
    "1",
  ],
  radius: 150, // PIXELS
  spinning: false,
};

export const RouletteWheel: React.FC = ({ ...children }) => {
  let rngCtx: any = useRNG();
  let confettiCtx: any = useConfetti();
  let wallet = useWallet();
  let connection = useConnection();
  let betTrackerCtx: any = useBetTracker();
  let [state, setState] = useState(rouletteState);
  let [surprise, setSurprise] = useState(false);
  let [startIdx, setStartIdx] = useState(0);
  let [responseState, setResponseState] = useState({
    received: true,
    selected: 0,
  });
  let { env } = useConnectionConfig();
  useEffect(() => {
    const renderSector = (start, arc, color) => {
      const canvas = document.getElementById("wheel") as HTMLCanvasElement;
      if (!canvas) {
        return;
      }
      let ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      let radius = state.radius;
      let startAngle = start;
      let endAngle = start + arc;
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle, false);
      ctx.lineWidth = radius * 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    const renderText = (index, text, start, arc) => {
      let canvas = document.getElementById("wheel") as HTMLCanvasElement;
      if (!canvas) {
        return;
      }
      let ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      let radius = state.radius;
      let angle = arc * index;
      ctx.save();
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.lineWidth = 3;
      let x_offset = x + Math.cos(start + angle + arc / 2) * 1.8 * radius;
      let y_offset = y + Math.sin(start + angle + arc / 2) * 1.8 * radius;
      ctx.translate(x_offset, y_offset);
      ctx.rotate(angle);
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    };

    const drawTriangle = () => {
      let canvas = document.getElementById("wheel") as HTMLCanvasElement;
      if (!canvas) {
        return;
      }
      let ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      let radius = state.radius;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";
      let region = new Path2D();
      region.moveTo(x, y - 2 * radius);
      region.lineTo(x - 20, y - 2 * radius - 40);
      region.lineTo(x + 20, y - 2 * radius - 40);
      region.lineTo(x, y - 2 * radius);
      region.closePath();
      ctx.fill(region);
    };

    const getColor = (i) => {
      if (parseInt(state.list[i]) === 0 || parseInt(state.list[i]) === 37) {
        return "darkseagreen";
      } else if (i % 2 === 1) {
        return "sienna";
      } else {
        return "#121212";
      }
    };

    const renderWheel = async () => {
      let canvas = document.getElementById("wheel") as HTMLCanvasElement;
      if (!canvas) {
        return;
      }
      let ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let numOptions = state.list.length;
      let arcSize = (2 * Math.PI) / numOptions;
      let startAngle = (3 * Math.PI) / 2 - Math.PI / numOptions;
      let angle = startAngle;
      let counter = startIdx;
      for (let i = 0; i < numOptions; i++) {
        renderSector(angle, arcSize, getColor(counter));
        counter = (counter + 1) % numOptions;
        angle += arcSize;
      }
      counter = startIdx;
      for (let i = 0; i < numOptions; i++) {
        let text = state.list[counter];
        if (text === "37") {
          text = "00";
        }
        renderText(i, text, startAngle, arcSize);
        counter = (counter + 1) % numOptions;
      }
      const x = canvas.width / 2;
      const y = canvas.height / 2;
      ctx.beginPath();
      ctx.fillStyle = "#121212";
      ctx.arc(x, y, state.radius * 1.2, 0, 2*Math.PI);
      ctx.fill()
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(x - 55, y, 15, 0, 2*Math.PI);
      ctx.fill()
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(x, y, 15, 0, 2*Math.PI);
      ctx.fill()
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(x + 55, y, 15, 0, 2*Math.PI);
      ctx.fill()
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.arc(x, y, state.radius * 1.5, 0, 2*Math.PI);
      ctx.stroke()
      ctx.beginPath();
      ctx.strokeStyle = "gold";
      ctx.lineWidth = 2;
      ctx.arc(x, y, .5 + state.radius * 1.5, 0, 2*Math.PI);
      ctx.stroke()
      if (state.spinning) {
        let nextIdx = (startIdx + 1) % numOptions;
        if (
          responseState.received &&
          parseInt(state.list[nextIdx]) === responseState.selected
        ) {
          setState({ ...state, spinning: false });
          if (surprise) {
            betTrackerCtx.updateBetResults(rngCtx.currentSample);
            let bet =  (Object.values(betTrackerCtx.state).reduce(
              (a, b) => (a as number) + (b as number),
              0
            ))
            let winnings = (Object.values(betTrackerCtx.winningBets).reduce(
              (a, b) => (a as number) + (b as number),
              0
            ));
            if ((winnings as number) >= (bet as number)) {
              confettiCtx.dropConfetti();
              setSurprise(false);
            }
          }
        }
        await new Promise((r) => setTimeout(r, 30)).then(() => {
          setStartIdx(nextIdx);
        });
      }
    };
    renderWheel();
    drawTriangle();
  }, [state.spinning, startIdx, responseState]);

  useEffect(() => {
    if (rngCtx.initialized) {
      if (!rngCtx.duplicated) {
        setResponseState({ received: true, selected: rngCtx.currentSample });
        setSurprise(true);
      } else {
        notify({
          message:
            "Failed to read new value from on-chain sampler. Please try again!",
        });
        console.log("ctx", rngCtx);
        setState({ ...state, spinning: false });
        setStartIdx(0);
        setResponseState({ received: false, selected: 0 });
      }
    }
  }, [rngCtx.currentSample, rngCtx.duplicated, rngCtx.currentSlot]);

  const spin = async () => {
    setState({
      ...state,
      spinning: true,
    });
    betTrackerCtx.lock();
    setResponseState({ ...responseState, received: false });
    if (!(await rngCtx.sample(connection, wallet, env, rngCtx, betTrackerCtx))) {
      setState({ ...state, spinning: false });
      setStartIdx(0);
      setResponseState({ received: false, selected: 0 });
      return;
    }
  };

  const reset = () => {
    setStartIdx(0);
    setState({
      ...state,
      spinning: false,
    });
    betTrackerCtx.unlock();
    betTrackerCtx.clear();
    setResponseState({ received: true, selected: 0 });
  };

  return (
    <div>
      <canvas id="wheel" width="600" height="680" />
      {state.spinning ? (
        <SpinButton name="Loading..." disabled={true} />
      ) : !betTrackerCtx.locked ? (
        <SpinButton
          name="Spin the Wheel"
          disabled={
            0 ===
            Object.values(betTrackerCtx.state).reduce(
              (a, b) => (a as number) + (b as number),
              0
            )
          }
          onClick={spin}
        />
      ) : (
        <SpinButton name="Reset" onClick={reset} />
      )}
    </div>
  );
};
