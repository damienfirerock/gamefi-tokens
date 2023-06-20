import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import NavBarLink from "./buttons/common/NavBarLink";

import { DEFAULT_BACKGROUND } from "../../src/theme";

const NAVBAR_LINKS = [{ href: "/", text: "main" }];

const NavBar: React.FunctionComponent = () => {
  const { t } = useTranslation("common");

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed" sx={{ background: DEFAULT_BACKGROUND }}>
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            alignItems: "center",
            display: { xs: "none", sm: "none", md: "flex" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: "50px",
              width: "50px",
            }}
          >
            <Image
              alt="Fire Element Logo"
              src="/logo/火元素LOGO.svg"
              layout="fill"
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
