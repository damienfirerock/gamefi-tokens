import React from "react";
import { AppBar, Toolbar, Typography, useTheme } from "@mui/material";

const NavBar: React.FunctionComponent = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="h6">ThunderDome</Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
