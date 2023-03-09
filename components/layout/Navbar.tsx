import React from "react";
import { AppBar, Box, BoxProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";

import { Header } from "../common";

// Decreases First Load from 355kb to 214kb
const DynamicAccountButton = dynamic(() => import("./buttons/AccountButton"));

const StyledBox = styled(Box)<BoxProps>(() => ({
  flexGrow: 1,
}));

const NavBar: React.FunctionComponent = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary" elevation={5}>
        <Toolbar>
          <StyledBox>
            <Header text="Airdrop Explorer" variant="h4" />
          </StyledBox>

          <DynamicAccountButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
