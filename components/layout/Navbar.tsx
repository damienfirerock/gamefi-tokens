import React from "react";
import { AppBar, Box, BoxProps, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import Image from "next/image";

// Decreases First Load from 355kb to 214kb
const DynamicAccountButton = dynamic(() => import("./buttons/AccountButton"));

const StyledBox = styled(Box)<BoxProps>(() => ({
  flexGrow: 1,
  justifyContent: "left",
}));

const NavBar: React.FunctionComponent = () => {
  const { t } = useTranslation("common");

  return (
    <AppBar position="fixed" color="secondary">
      <Toolbar>
        <StyledBox>
          <Box sx={{ position: "relative", height: "50px", width: "50px" }}>
            <Image
              alt="Fire Element Logo"
              src="/logo/火元素LOGO.svg"
              layout="fill"
            />
          </Box>
        </StyledBox>
        <DynamicAccountButton />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
