import React, { useMemo } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { Container, ContainerProps, useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import NavBar from "./Navbar";
import AlertBar from "../common/AlertBar";
import BottomNavbar from "./BottomNavbar";

import { AppDispatch, RootState } from "../../store";
import { clearError, clearSuccess } from "../../features/TransactionSlice";

type LayoutProps = {
  children: React.ReactNode;
};

const StyledContainer = styled(Container)<ContainerProps>(() => ({
  wordWrap: "break-word",
  paddingTop: "4rem",
}));

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;

  const { t } = useTranslation(["common", "success", "failure"]);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error, success } = transactionSlice;

  const handleClearError = () => {
    if (error) {
      dispatch(clearError());
    }
  };

  const handleClearSuccess = () => {
    if (success) {
      dispatch(clearSuccess());
    }
  };

  const successText = useMemo(() => {
    return success;
    // && guard required as
    // useTranslation will attempt to show 'null'
    // even if authSuccess is just null
  }, [success]);

  const errorText = useMemo(() => {
    return error;
  }, [error]);

  return (
    <>
      <Head>
        <title>Gamefi Tokens</title>
        <meta property="og:title" content="Airdrop" key="title" />
      </Head>

      <NavBar />
      <StyledContainer
        maxWidth="lg"
        sx={{ paddingBottom: isMobile ? "6rem" : "1rem" }}
      >
        {children}
        <AlertBar
          severity="warning"
          text={errorText && t(`failure:${errorText}`)}
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
