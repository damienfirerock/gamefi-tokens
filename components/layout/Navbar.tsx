import React from "react";
import { AppBar, Box, BoxProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Header } from "../common";
import ConnectMetamask from "./ConnectMetamask";

const StyledBox = styled(Box)<BoxProps>(() => ({
  flexGrow: 1,
}));

const NavBar: React.FunctionComponent = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <StyledBox>
            <Header text="ThunderDome" variant="h4" />
          </StyledBox>
          <ConnectMetamask />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
