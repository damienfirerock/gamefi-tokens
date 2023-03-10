import React, { useEffect } from "react";
import Head from "next/head";
import { Container } from "@mui/material";

import NavBar from "./Navbar";

import { SUPPORTED_WALLETS } from "../../constants/wallets";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;
  const { activate } = useWeb3React();

  // Ensures that connection is maintained between browser refreshes
  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      const walletKey = localStorage?.getItem("isWalletConnected");

      if (!walletKey) return;

      const connector = SUPPORTED_WALLETS[walletKey].connector;
      console.log({ connector });
      try {
        await activate(connector);
      } catch (error) {
        console.error(error);
      }
    };
    connectWalletOnPageLoad();
  }, []);

  return (
    <>
      <Head>
        <title>Airdrop</title>
        <meta property="og:title" content="Airdrop" key="title" />
      </Head>
      <NavBar />
      <Container maxWidth="lg" sx={{ paddingTop: 8 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;
