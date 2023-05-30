import React, { useEffect, useMemo } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { Container, ContainerProps, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import NavBar from "./Navbar";
import AlertBar from "../common/AlertBar";
import LoginDialog from "./login/LoginDialog";
import BottomNavbar from "./BottomNavbar";

import { AppDispatch, RootState } from "../../store";
import { clearError, clearSuccess } from "../../features/TransactionSlice";
import { clearError as clearAccountError } from "../../features/AccountSlice";
import {
  setSession,
  setLoading,
  setDialogOpen,
  clearError as clearAuthError,
  clearSuccess as clearAuthSuccess,
} from "../../features/AuthSlice";
import { SUPPORTED_WALLETS } from "../../constants/wallets";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import useCommonWeb3Transactions from "../../utils/hooks/useCommonWeb3Transactions";

type LayoutProps = {
  children: React.ReactNode;
};

const StyledContainer = styled(Container)<ContainerProps>(() => ({
  textAlign: "center",
  wordWrap: "break-word",
  paddingTop: "4rem",
}));

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;
  const { account, activate } = useWeb3React();
  const { checkFRGBalance } = useCommonWeb3Transactions();
  const { t } = useTranslation(["common", "success"]);
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const { locale } = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const authSlice = useSelector((state: RootState) => state.auth);
  const {
    loading: authLoading,
    error: authError,
    success: authSuccess,
  } = authSlice;

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error, success } = transactionSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { error: accountError } = accountSlice;

  const handleClearError = () => {
    if (accountError) {
      dispatch(clearAccountError());
    } else if (authError) {
      dispatch(clearAuthError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  const handleClearSuccess = () => {
    if (success) {
      dispatch(clearSuccess());
    } else if (authSuccess) {
      dispatch(clearAuthSuccess());
    }
  };

  // Ensures that connection is maintained between browser refreshes
  useEffect(() => {
    if (account) return;

    const connectWalletOnPageLoad = async () => {
      const walletKey = localStorage?.getItem("isWalletConnected");

      if (!walletKey) return;

      const connector = SUPPORTED_WALLETS[walletKey].connector;

      try {
        await activate(connector);
        if (account) {
          await checkFRGBalance();
        }
      } catch (error) {
        console.error(error);
      }
    };

    connectWalletOnPageLoad();
  }, [activate, checkFRGBalance, account]);

  // Sets new Session on Session change
  useEffect(() => {
    if (status !== "loading") {
      dispatch(setSession(session));
      dispatch(setLoading(false));
    }
  }, [dispatch, session, status]);

  // Shows LoginDialog for new user
  useEffect(() => {
    if (!session && !authLoading) {
      const popupShown = localStorage.getItem("loginPopupShown");

      if (!popupShown) {
        dispatch(setDialogOpen());
        localStorage.setItem("loginPopupShown", "true");
      }
    }
  }, [dispatch, session, authLoading]);

  const successText = useMemo(() => {
    return success || (authSuccess && t(`success:${authSuccess}`));
    // && guard required as
    // useTranslation will attempt to show 'null'
    // even if authSuccess is just null
  }, [success, authSuccess]);

  return (
    <>
      <Head>
        <title>{t("common:contracts-explorer")}</title>
        <meta property="og:title" content="Airdrop" key="title" />
      </Head>
      {/* Mavbar Men */}
      <NavBar />
      <StyledContainer
        maxWidth="lg"
        sx={{ paddingBottom: isMobile ? "6rem" : "1rem" }}
      >
        {children}
        <LoginDialog />
        <Link href="" locale={locale === "en" ? "zh" : "en"}>
          {t("common:language")}
        </Link>
        <AlertBar
          severity="warning"
          text={error || accountError || authError}
          handleClearAlertSource={handleClearError}
        />
        <AlertBar
          severity="success"
          text={successText}
          handleClearAlertSource={handleClearSuccess}
        />
      </StyledContainer>
      {/* BottomNavbar only shows on Mobile */}
      <BottomNavbar />
    </>
  );
};

export default Layout;
