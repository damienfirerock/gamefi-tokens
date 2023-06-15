import React from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { NextLinkComposed } from "./buttons/common/NextLinkComposed";

import {
  WHITE,
  DEFAULT_BACKGROUND,
  PRIMARY_COLOR,
  NAV_TEXT_COLOUR,
} from "../../src/theme";

type BottomNavbarProps = {};

const SVG_BACKGROUND = "#2B2734";

// Affects active Bottom Navigation highlight
const PATH_VALUES: Record<string, number> = {
  "/crystal-hub": 0,
  "/swap": 1,
  "/": 2,
};

interface StyledBottomNavigationAction extends BottomNavigationActionProps {
  component: unknown;
  to: { pathname: string };
}

const StyledBottomNavigationAction = styled(
  BottomNavigationAction
)<StyledBottomNavigationAction>(() => ({
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

const BottomNavbar: React.FunctionComponent<BottomNavbarProps> = (props) => {
  const { pathname } = useRouter();
  const { t } = useTranslation("common");

  return (
    <Paper
      sx={{
        display: { xs: "block", sm: "block", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: `${SVG_BACKGROUND} 1px solid`,
        zIndex: 1,
      }}
    >
      <BottomNavigation
        showLabels
        value={PATH_VALUES[pathname]}
        sx={{
          background: DEFAULT_BACKGROUND,
          paddingBottom: "5rem",
        }}
      >
        <StyledBottomNavigationAction
          label={t("crystal-hub")}
          component={NextLinkComposed}
          to={{ pathname: "/crystal-hub" }}
          icon={<MonetizationOnOutlinedIcon />}
          disableRipple
        />
        <StyledBottomNavigationAction
          label={t("swap")}
          component={NextLinkComposed}
          to={{ pathname: "/swap" }}
          icon={<CurrencyExchangeIcon />}
          disableRipple
        />
        <StyledBottomNavigationAction
          label={t("main")}
          component={NextLinkComposed}
          to={{ pathname: "/" }}
          icon={<GppGoodOutlinedIcon />}
          disableRipple
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavbar;
