import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";

import createEmotionCache from "../utils/createEmotionCache";
import theme from "../src/theme";
import store from "../store";
import getLibrary from "../utils/getLibrary";
import { NETWORK_CONTEXT_NAME } from "../constants/common";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
const Web3ProviderNetwork = createWeb3ReactRoot(NETWORK_CONTEXT_NAME);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <CssBaseline />
              <Component {...pageProps} />{" "}
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
