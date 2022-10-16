import React from "react";

import { Container } from "@mui/material";

import NavBar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = (props) => {
  const { children } = props;

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">{children}</Container>
    </>
  );
};

export default Layout;
