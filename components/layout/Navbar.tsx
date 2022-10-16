import React from "react";
import { AppBar, Toolbar } from "@mui/material";

import { Header } from "../common";

const NavBar: React.FunctionComponent = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Header text="ThunderDome" variant="h5" />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
