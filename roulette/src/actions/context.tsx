import React, { useContext, useState } from 'react';
import BN from 'bn.js';
import {
    decodeRNG
} from './decoders'
import { toPublicKey } from '../utils';
import { useConnection } from '../contexts';
import { sample } from './transactions';
export * from './constants'


const defaultContext = { 
  currentSample: 0,
  currentRawSample: new BN(0),
  currentSlot: new BN(0),
  initialized: false,
  convertedSamples: [0],
  rawSamples: [new BN(0)],
  duplicated: false,
  sample,
  updateSample: async (key): Promise<void> => new Promise(() => {}),
  setState: (values: any): void => undefined,
}

const RNGContext = React.createContext({ ...defaultContext });


export function RNGProvider({ children = null as any }) {
  const connection = useConnection();
  const [state, setState] = useState({ ...defaultContext });

  return (
    <RNGContext.Provider
      value={{
        ...state,
        setState,
        updateSample: async (RNGKey: any) => {
          const newState = {...state};
          const RNGAccount = await connection.getAccountInfo(toPublicKey(RNGKey));
          if (RNGAccount === null) {
            throw new Error('Failed to find RNG account');
          }
          const data = Buffer.from(RNGAccount.data)
          let RNG = decodeRNG(data);  
          if (!newState.initialized) {
              newState.initialized = true;
              newState.convertedSamples = [];
              newState.rawSamples = [];
          }
          newState.currentRawSample = RNG.sample;
          newState.currentSample = RNG.sample.modn(38);
          newState.convertedSamples = [...newState.convertedSamples, newState.currentSample];
          if (newState.currentSlot === RNG.slot) {
              newState.duplicated = true;
          } else {
              newState.duplicated = false;
          }
          newState.currentSlot = RNG.slot;
          console.log("Newest Sample:", newState.currentSample);
          console.log("RNG", RNG);
          console.log("Previous state", state);
          console.log("Full state", newState);
          setState(newState);
        },
      }}
    >
      {children}
    </RNGContext.Provider>
  );
}

export const useRNG = () => {
  const context = useContext(RNGContext);
  return context;
};
