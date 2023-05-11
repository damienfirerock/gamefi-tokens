import React from "react";
import { AppBar, Box, BoxProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { Header } from "../common";

// Decreases First Load from 355kb to 214kb
const DynamicAccountButton = dynamic(() => import("./buttons/AccountButton"));

const StyledBox = styled(Box)<BoxProps>(() => ({
  flexGrow: 1,
}));

const NavBar: React.FunctionComponent = () => {
  const { t } = useTranslation("common");
  const { locale } = useRouter();

  return (
    <AppBar position="fixed" color="secondary" elevation={5}>
      <Toolbar>
        <StyledBox>
          <Header text={t("contracts-explorer")} variant="h6" />
        </StyledBox>
        <Link href="" locale={locale === "en" ? "zh" : "en"}>
          {t("language")}
        </Link>
        <DynamicAccountButton />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
