import { createContext, FC, ReactNode, useContext, useState } from "react";

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

  const updateInc = (i) => {
    setInc(i);
  };

  const increment = (cls) => {
    let size = inc;
    let currTotal = totalSize;
    if (inc + totalSize > 100) {
      size = 100 - totalSize;
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
  };

  return (
    <BetTrackerContext.Provider
      value={{
        state,
        locked,
        lock,
        unlock,
        increment,
        decrement,
        updateInc,
        clear,
      }}
    >
      {children}
    </BetTrackerContext.Provider>
  );
};
