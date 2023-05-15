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

import { NextLinkComposed } from "./buttons/common/NextLinkComposed";

import { WHITE, DEFAULT_BACKGROUND, PRIMARY_COLOR } from "../../src/theme";

type BottomNavbarProps = {};

const NAV_TEXT_COLOUR = "#8C8A9A";
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

  return (
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
        value={PATH_VALUES[pathname]}
        sx={{
          background: DEFAULT_BACKGROUND,
          paddingBottom: "5rem",
        }}
      >
        <StyledBottomNavigationAction
          label="Crystal Hub"
          component={NextLinkComposed}
          to={{ pathname: "/crystal-hub" }}
          icon={<MonetizationOnOutlinedIcon />}
          disableRipple
        />
        <StyledBottomNavigationAction
          label="Swap"
          component={NextLinkComposed}
          to={{ pathname: "/swap" }}
          icon={<CurrencyExchangeIcon />}
          disableRipple
        />
        <StyledBottomNavigationAction
          label="About"
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
