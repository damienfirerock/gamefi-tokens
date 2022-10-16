import React from "react";
import { Box, BoxProps, Container, ContainerProps } from "@mui/material";
import { styled } from "@mui/material/styles";

import Layout from "../layout/Layout";
import { Header } from "../common";

const StyledBox = styled(Box)<BoxProps>(() => ({
  display: "flex",
  justifyContent: "center",
}));

const StyledContainer = styled(Container)<ContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const MainPage = () => {
  return (
    <Layout>
      {/* Header */}
      <StyledContainer>
        <StyledBox>
          <Header text="Catch a Pokemon today" variant="h3" />
        </StyledBox>
      </StyledContainer>

      {/* Pieces on Sale */}
    </Layout>
  );
};

export default MainPage;
