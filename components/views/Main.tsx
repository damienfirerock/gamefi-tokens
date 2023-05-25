import React from "react";
import {
  Box,
  BoxProps,
  Button,
  Card,
  Container,
  Link,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import Layout from "../layout/Layout";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { NAV_TEXT_COLOUR } from "../../src/theme";

const addresses = Object.values(CONTRACT_ADDRESSES);

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Main: React.FunctionComponent = () => {
  const { t } = useTranslation("common");

  return (
    <Layout>
      <Container maxWidth="sm">
        <Image
          alt="XY3 Banner"
          src="/main-page/main-page-placeholder-image.png"
          layout="responsive"
          objectFit="contain"
          width="100%"
          height="50%"
        />

        <Typography
          variant="body2"
          sx={{ marginY: "1rem", textAlign: "justify" }}
        >
          JoM draws inspiration mainly from Eastern mythology, creating an
          enormous virtual universe of memorable and unique characters. As the
          player gains access to more characters over time, they can level up
          their favourite characters and form the ultimate team to defeat the
          demons (PvE) or other teams of players (PvP).
        </Typography>

        {/* Install buttons */}
        <Box>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              alt="Google Play Store Link"
              src="/main-page/google-play-badge.png"
              width={154}
              height={44}
              style={{ objectFit: "fill" }}
            />
          </a>

          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              alt="Apple App Store Link"
              src="/main-page/apple-download-badge.svg"
              width={154}
              height={44}
            />
          </a>
        </Box>

        {/* social links */}

        <Card sx={{ marginY: "0.5rem", padding: "0.5rem" }}>
          <Typography
            variant="body2"
            sx={{ marginBottom: "1rem", color: NAV_TEXT_COLOUR }}
          >
            Social Links
          </Typography>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Image
              alt="XY3 Banner"
              src="/main-page/google-play-badge.png"
              width={154}
              height={44}
              style={{ objectFit: "fill" }}
            />
          </Link>

          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Image
              alt="XY3 Banner"
              src="/main-page/apple-download-badge.svg"
              width={154}
              height={44}
            />
          </Link>
        </Card>
        {/* Add paper background like in crystal hub */}
        {/* Add social links buttons */}

        <Button variant="contained" fullWidth sx={{ marginY: "1rem" }}>
          <Typography variant="body2">Help Center</Typography>
        </Button>

        <Button variant="contained" fullWidth>
          <Typography variant="body2">Legal and Privacy</Typography>
        </Button>

        <ContractsBox>
          {addresses.map((address) => {
            if (!address) return;
            return (
              <Box
                key={address}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginY: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ADDRESS_NAMES[address]}:
                </Typography>
                <Typography variant="body2">
                  <Link
                    href={`${CONFIG.POLYGONSCAN_URL}${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address}
                  </Link>
                </Typography>
              </Box>
            );
          })}
        </ContractsBox>
      </Container>
    </Layout>
  );
};

export default Main;
