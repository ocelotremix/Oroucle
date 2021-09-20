import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import {
  AccountsProvider,
  BetTrackerProvider,
  ConnectionProvider,
  WalletProvider,
} from "./contexts";
import { UseWalletProvider } from "use-wallet";

import "antd/dist/antd.css";
import "@fontsource/open-sans";
import "@fontsource/roboto";
import "@fontsource/sora";

import theme from "./theme/theme";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RNG, RNGProvider } from "./actions";

import "./index.css";
import { ConfettiProvider } from "./components/Confetti";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

ReactDOM.render(
  <React.StrictMode>
    <ConnectionProvider>
      <WalletProvider>
        <UseWalletProvider chainId={5}>
          <AccountsProvider>
            <ConfettiProvider>
              <BetTrackerProvider>
                <RNGProvider>
                  <ChakraProvider theme={theme}>
                    <ColorModeScript
                      initialColorMode={theme.config.initialColorMode}
                    />
                    <App />
                  </ChakraProvider>
                </RNGProvider>
              </BetTrackerProvider>
            </ConfettiProvider>
          </AccountsProvider>
        </UseWalletProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
