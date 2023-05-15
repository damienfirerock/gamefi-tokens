import React, { useEffect } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  Container,
  ContainerProps,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";

import NavBar from "./Navbar";
import AlertBar from "../common/AlertBar";
import LoginDialog from "./LoginDialog";

import { AppDispatch, RootState } from "../../store";
import { clearError, clearSuccess } from "../../features/TransactionSlice";
import { clearError as clearAccountError } from "../../features/AccountSlice";
import {
  setSession,
  setLoading,
  setDialogOpen,
} from "../../features/AuthSlice";
import { SUPPORTED_WALLETS } from "../../constants/wallets";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import useCommonWeb3Transactions from "../../utils/hooks/useCommonWeb3Transactions";
import {
  WHITE,
  DEFAULT_BACKGROUND,
  PAPER_BACKGROUND,
  PRIMARY_COLOR,
} from "../../src/theme";

type LayoutProps = {
  children: React.ReactNode;
};

const NAV_TEXT_COLOUR = "#8C8A9A";
const SVG_BACKGROUND = "#2B2734";

const StyledContainer = styled(Container)<ContainerProps>(() => ({
  textAlign: "center",
  wordWrap: "break-word",
}));

const StyledBottomNavigationAction = styled(
  BottomNavigationAction
)<BottomNavigationActionProps>(() => ({
  color: NAV_TEXT_COLOUR,
  height: "5rem",
  span: { fontSize: "0.75rem" },
  svg: {
    background: SVG_BACKGROUND,
    color: WHITE,
    border: "0.3125rem",
    fontSize: "2rem",
    padding: "0.25rem",
    borderRadius: "0.4375rem",
  },
  "&.Mui-selected": {
    color: WHITE,
    svg: {
      background: PRIMARY_COLOR,
      fontSize: "2rem",
    },
    span: { fontSize: "0.75rem" },
  },
}));

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;
  const { account, activate } = useWeb3React();
  const { checkWalletBalance } = useCommonWeb3Transactions();
  const { t } = useTranslation("common");
  const dispatch = useDispatch<AppDispatch>();
  const { data: session, status } = useSession();
  const { locale } = useRouter();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { loading: authLoading } = authSlice;

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error, success } = transactionSlice;

  const accountSlice = useSelector((state: RootState) => state.account);
  const { error: accountError } = accountSlice;

  const [value, setValue] = React.useState(0);

  const handleClearAlert = () => {
    if (accountError) {
      dispatch(clearAccountError());
    } else if (error) {
      dispatch(clearError());
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
          await checkWalletBalance();
        }
      } catch (error) {
        console.error(error);
      }
    };

    connectWalletOnPageLoad();
  }, [account]);

  // Sets new Session on Session change
  useEffect(() => {
    if (status !== "loading") {
      dispatch(setSession(session));
      dispatch(setLoading(false));
    }
  }, [session, status]);

  // Shows LoginDialog for new user
  useEffect(() => {
    if (!session && !authLoading) {
      const popupShown = localStorage.getItem("loginPopupShown");

      if (!popupShown) {
        dispatch(setDialogOpen());
        localStorage.setItem("loginPopupShown", "true");
      }
    }
  }, [session, authLoading]);

  return (
    <>
      <Head>
        <title>{t("contracts-explorer")}</title>
        <meta property="og:title" content="Airdrop" key="title" />
      </Head>
      <NavBar />
      <StyledContainer maxWidth="lg" sx={{ paddingTop: 8 }}>
        {children}
        <LoginDialog />
        <Link href="" locale={locale === "en" ? "zh" : "en"}>
          {t("language")}
        </Link>
        <AlertBar
          severity="warning"
          text={error || accountError}
          handleClearAlertSource={handleClearAlert}
        />
        <AlertBar
          severity="success"
          text={success}
          handleClearAlertSource={() => dispatch(clearSuccess())}
        />
      </StyledContainer>
      <Paper
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: `${SVG_BACKGROUND} 1px solid`,
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            background: DEFAULT_BACKGROUND,
            paddingBottom: "5rem",
          }}
        >
          <StyledBottomNavigationAction
            label="Crystal Hub"
            icon={<MonetizationOnOutlinedIcon />}
            disableRipple
          />
          <StyledBottomNavigationAction
            label="Swap"
            icon={<CurrencyExchangeIcon />}
            disableRipple
          />
          <StyledBottomNavigationAction
            label="About"
            icon={<GppGoodOutlinedIcon />}
            disableRipple
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Layout;
