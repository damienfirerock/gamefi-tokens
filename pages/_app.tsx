import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import { appWithTranslation } from "next-i18next";
import { SessionProvider } from "next-auth/react";

import createEmotionCache from "../utils/createEmotionCache";
import theme from "../src/theme";
import store from "../store";
import getLibrary from "../utils/getLibrary";

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const MyApp: React.FunctionComponent<MyAppProps> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <SessionProvider session={session}>
              <CssBaseline />
              <Component {...pageProps} />
            </SessionProvider>
          </Web3ReactProvider>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default appWithTranslation(MyApp);
