import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import {
  WagmiConfig,
  configureChains,
  createClient,
  createStorage,
} from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import createEmotionCache from "../utils/createEmotionCache";
import theme from "../src/theme";
import store from "../store";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const { provider, webSocketProvider } = configureChains(
  [polygon, polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  storage:
    typeof window !== "undefined"
      ? createStorage({ storage: window?.localStorage })
      : undefined,
});

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CssBaseline />
          <WagmiConfig client={client}>
            <Component {...pageProps} />
          </WagmiConfig>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
