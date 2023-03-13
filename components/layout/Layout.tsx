import React, { useEffect } from "react";
import Head from "next/head";
import { Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import NavBar from "./Navbar";

import { SUPPORTED_WALLETS } from "../../constants/wallets";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";

type LayoutProps = {
  children: React.ReactNode;
};

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  paddingY: 8,
  textAlign: "center",
  wordWrap: "break-word",
}));

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;
  const { account, activate } = useWeb3React();
  const { t } = useTranslation("common");

  // Ensures that connection is maintained between browser refreshes
  useEffect(() => {
    if (account) return;

    const connectWalletOnPageLoad = async () => {
      const walletKey = localStorage?.getItem("isWalletConnected");

      if (!walletKey) return;

      const connector = SUPPORTED_WALLETS[walletKey].connector;

      try {
        await activate(connector);
      } catch (error) {
        console.error(error);
      }
    };

    connectWalletOnPageLoad();
  }, [account]);

  return (
    <>
      <Head>
        <title>{t("contracts-explorer")}</title>
        <meta property="og:title" content="Airdrop" key="title" />
      </Head>
      <NavBar />
      <StyledContainer maxWidth="lg" sx={{ paddingTop: 8 }}>
        {children}
      </StyledContainer>
    </>
  );
};

export default Layout;
