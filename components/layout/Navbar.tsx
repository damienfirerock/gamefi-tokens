import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";

import NavBarLink from "./buttons/common/NavBarLink";

// Decreases First Load from 355kb to 214kb
const DynamicAccountButton = dynamic(() => import("./buttons/AccountButton"));

const NAVBAR_LINKS = [
  { href: "/", text: "Main" },
  { href: "/swap", text: "Swap" },
  { href: "/account", text: "Account" },
  { href: "/crystal-hub", text: "Crystal Hub" },
];

const NavBar: React.FunctionComponent = () => {
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
    <AppBar position="fixed" color="secondary">
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
                <NavBarLink href={href} text={text} />
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
            <NavBarLink key={text} href={href} text={text} />
          ))}
        </Box>
        <DynamicAccountButton />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
