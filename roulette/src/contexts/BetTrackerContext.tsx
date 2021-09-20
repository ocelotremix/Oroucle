import { createContext, FC, ReactNode, useContext, useState } from "react";
import { BET_TO_NUMBER, NUMBER_TO_COLOR } from "../actions";

export const BetTrackerContext = createContext({});

export function useBetTracker() {
  return useContext(BetTrackerContext);
}

export const BetTrackerProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState({});
  const [locked, setLocked] = useState(false);
  const [inc, setInc] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [winningBets, setWinningBets] = useState({});
  const [resolved, setResolved] = useState(false);
  const [chips, setChips] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const updateInc = (i) => {
    setInc(i);
  };

  const updateBetResults = (sample) => {
    for (const bet in state) {
      const amount = state[bet];
      if (bet in BET_TO_NUMBER && BET_TO_NUMBER[bet] === sample) {
        winningBets[bet] = amount * 36;
      }
      if (sample === 0 || sample === 37) {
        continue;
      }
      if (bet === 'Odd' && sample % 2 === 1) {
        winningBets[bet] = amount * 2;
      } else if (bet === 'Even' && sample % 2 === 0) {
        winningBets[bet] = amount * 2;
      } else if (bet === 'Col1' && sample % 3 === 1) {
        winningBets[bet] = amount * 3;
      } else if (bet === 'Col2' && sample % 3 === 2) {
        winningBets[bet] = amount * 3;
      } else if (bet === 'Col3' && sample % 3 === 0) {
        winningBets[bet] = amount * 3;
      } else if (bet === 'Dozen1' && sample <= 12) {
        winningBets[bet] = amount * 3;
      } else if (bet === 'Dozen2' && sample > 12 && sample <= 24) {
        winningBets[bet] = amount * 3;
      } else if (bet === 'Dozen3' && sample > 24) {
        winningBets[bet] = amount * 3;
      } else if (bet === 'Low' && sample <= 18) {
        winningBets[bet] = amount * 2;
      } else if (bet === 'High' && sample > 18) {
        winningBets[bet] = amount * 2;
      } else if (bet === 'Red' && NUMBER_TO_COLOR[sample] === 'R') {
        winningBets[bet] = amount * 2;
      } else if (bet === 'Black' && NUMBER_TO_COLOR[sample] === 'B') {
        winningBets[bet] = amount * 2;
      }
    }
    console.log("Winning Bets", winningBets);
    setWinningBets(winningBets);
    setResolved(true);
  };

  const increment = (cls) => {
    let size = inc;
    let currTotal = totalSize;
    if (inc + totalSize > chips) {
      size = chips - totalSize;
    }
    if (size > 0) {
      if (!(cls in state)) {
        state[cls] = 0;
      }
      state[cls] += size;
      currTotal += size;
      setState({ ...state });
      setTotalSize(currTotal);
    }
  };

  const lock = () => {
    setLocked(true);
  };

  const unlock = () => {
    setLocked(false);
  };

  const decrement = (cls) => {
    if (cls in state && state[cls] > 0) {
      let currTotal = totalSize;
      state[cls] -= inc;
      currTotal -= inc;
      if (state[cls] <= 0) {
        delete state[cls];
        setTotalSize(0);
      } else {
        setTotalSize(currTotal);
      }
      setState({ ...state });
    }
  };

  const clear = () => {
    setState({});
    setTotalSize(0);
    setWinningBets({});
    setResolved(false);
  };

  return (
    <BetTrackerContext.Provider
      value={{
        state,
        locked,
        resolved,
        winningBets,
        chips,
        loaded,
        setChips,
        setLoaded,
        lock,
        unlock,
        increment,
        decrement,
        updateInc,
        clear,
        updateBetResults,
      }}
    >
      {children}
    </BetTrackerContext.Provider>
  );
};
