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
        {/* Mobile Navigation */}
        <Box
          sx={{ flexGrow: 1, display: { xs: "flex", sm: "flex", md: "none" } }}
        >
          <IconButton
            sx={{ position: "relative", height: "50px", width: "50px" }}
            onClick={handleOpenNavMenu}
          >
            <Image
              alt="Fire Element Logo"
              src="/logo/火元素LOGO.svg"
              layout="fill"
            />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { sm: "block", md: "none" },
            }}
          >
            {NAVBAR_LINKS.map(({ href, text }) => (
              <MenuItem key={text}>
                <NavBarLink href={href} text={t(text)} />
              </MenuItem>
            ))}
          </Menu>
        </Box>
        {/* Desktop Navigation */}
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
          {NAVBAR_LINKS.map(({ href, text }) => (
            <NavBarLink key={text} href={href} text={t(text)} />
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
