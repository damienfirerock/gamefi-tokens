import React from "react";
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import Layout from "../layout/Layout";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { NAV_TEXT_COLOUR, WHITE } from "../../src/theme";

const addresses = Object.values(CONTRACT_ADDRESSES);

const DISCORD_LOGO_BACKGROUND = "#5865F2";

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
          height="58%"
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
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              alt="Google Play Store Link"
              src="/main-page/google-play-badge.png"
              width={147.4}
              height={44}
              style={{ objectFit: "fill" }}
            />
          </a>

          <a href="/" target="_blank" rel="noopener noreferrer">
            <Image
              alt="Apple App Store Link"
              src="/main-page/apple-download-badge.svg"
              width={132}
              height={44}
            />
          </a>
        </Box>

        {/* social links */}

        <Card
          sx={{
            marginY: "0.5rem",
            paddingTop: "0.5rem",
            paddingBottom: "1.0rem",
          }}
        >
          <Typography
            variant="body2"
            sx={{ marginBottom: "1rem", color: NAV_TEXT_COLOUR }}
          >
            Social Links
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              aria-label={`Discord Social Link`}
              size="small"
              LinkComponent="a"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: DISCORD_LOGO_BACKGROUND,
                borderRadius: 1,
                marginX: "1rem",
                "&:hover": {
                  background: DISCORD_LOGO_BACKGROUND + "99",
                },
              }}
            >
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: "2.2rem",
                    height: "2.2rem",
                    position: "relative",
                  }}
                >
                  <Image
                    src={`/main-page/discord-mark-white.svg`}
                    alt={`Discord Logo`}
                    layout="fill"
                  />
                </Box>
              </Box>
            </IconButton>

            <IconButton
              aria-label={`Discord Social Link`}
              size="small"
              LinkComponent="a"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: WHITE,
                borderRadius: 1,
                marginX: "1rem",
                "&:hover": {
                  background: WHITE + "99",
                },
              }}
            >
              <Box
                sx={{
                  width: "2.5rem",
                  height: "2.5rem",
                  position: "relative",
                }}
              >
                <Image
                  src={`/main-page/telegram-logo.svg`}
                  alt={`Discord Logo`}
                  layout="fill"
                />
              </Box>
            </IconButton>
          </Box>
        </Card>

        <Button variant="contained" fullWidth sx={{ marginY: "1rem" }}>
          <Typography variant="body2">Help Center</Typography>
        </Button>

        <Button variant="contained" fullWidth>
          <Typography variant="body2">Legal and Privacy</Typography>
        </Button>

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
                {ADDRESS_NAMES[address]} Address:
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
      </Container>
    </Layout>
  );
};

export default Main;
