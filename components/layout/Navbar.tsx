import React from "react";
import { AppBar, Box, BoxProps, Toolbar, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import NextLink from "next/link";

import { Header } from "../common";
import AccountButton from "./buttons/AccountButton";

import MenuStyledButton from "./buttons/common/MenuStyledButton";

const StyledBox = styled(Box)<BoxProps>(() => ({
  flexGrow: 1,
}));

const NavBar: React.FunctionComponent = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary" elevation={5}>
        <Toolbar>
          <StyledBox>
            <Header text="Airdrop Explorer" variant="h4" />
          </StyledBox>
          {router.pathname !== "/" && (
            <NextLink href="/" passHref>
              <MenuStyledButton
                variant="outlined"
                sx={{ marginX: theme.spacing(1) }}
              >
                <Typography variant="h6">Back to Main</Typography>
              </MenuStyledButton>
            </NextLink>
          )}
          <AccountButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
