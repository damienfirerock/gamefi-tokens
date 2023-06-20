import React from "react";
import { Container, Typography } from "@mui/material";

import Layout from "../layout/Layout";

const Main: React.FunctionComponent = () => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Typography
          variant="body2"
          sx={{ marginY: "1rem", textAlign: "justify" }}
        >
          game Fi Tokens
        </Typography>
      </Container>
    </Layout>
  );
};

export default Main;
