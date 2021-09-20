import React, { useContext, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useBetTracker } from '../../contexts';

export interface ConfettiContextState {
  dropConfetti: (bool) => void;
}

const ConfettiContext = React.createContext<ConfettiContextState | null>(null);

export const ConfettiProvider = ({ children = null as any }) => {
  const canvasRef = useRef<HTMLCanvasElement>();
  const confettiRef = useRef<confetti.CreateTypes>();
  const betTrackerCtx: any = useBetTracker()

  const dropConfetti = useMemo(
    () => (won) => {
      if (confettiRef.current && canvasRef.current) {
        if (!won) {
          canvasRef.current.style.filter = "grayscale(1)";
        } else {
          canvasRef.current.style.filter = "";
        }
        canvasRef.current.style.visibility = 'visible';
        confettiRef
          .current({
            particleCount: 400,
            spread: 160,
            origin: { y: 0.3 },
          })
          ?.finally(() => {
            if (canvasRef.current) {
              canvasRef.current.style.visibility = 'hidden';
            }
          });
      }
    },
    [],
  );

  useEffect(() => {
    if (canvasRef.current && !confettiRef.current) {
      canvasRef.current.style.visibility = 'hidden';
      confettiRef.current = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });
    }
  }, []);

  const canvasStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
  };

  return (
    <ConfettiContext.Provider value={{ dropConfetti }}>
      <canvas ref={canvasRef as any} style={canvasStyle} />
      {children}
    </ConfettiContext.Provider>
  );
};

export const Confetti = () => {
  const { dropConfetti } = useConfetti();

  useEffect(() => {
    dropConfetti(true);
  }, [dropConfetti]);

  return <></>;
};

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  return context as ConfettiContextState;
};