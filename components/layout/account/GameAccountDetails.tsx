import React from "react";
import { Avatar, Box, Typography, TypographyProps } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import { NAV_TEXT_COLOUR, DETAILS_COLOUR } from "../../../src/theme";

const stringToColour = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const Detail = styled(Typography)<TypographyProps>(() => ({
  display: "inline-block",
  color: DETAILS_COLOUR,
  overflowWrap: "break-word",
  hyphens: "auto",
  maxWidth: "170px",
}));

const GameAccountDetails: React.FunctionComponent = () => {
  const { t } = useTranslation(["common", "airdrop"]);

  const authSlice = useSelector((state: RootState) => state.auth);
  const { session } = authSlice;

  return (
    <>
      {session && (
        <>
          <Typography variant="body2">{t("common:account-details")}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              boxShadow: "0px 0px 20px 0.5px #d3d3d3",
              background: "white",
              marginY: "1rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              color: NAV_TEXT_COLOUR,
            }}
          >
            <Avatar
              sx={{
                width: "99px",
                height: "99px",
                bgcolor: stringToColour(session?.user?.email || ""),
                marginRight: "1rem",
              }}
              src={session?.user?.image || ""}
            >
              {session?.user?.image ? session?.user?.email?.split("")[0] : ""}
            </Avatar>
            <table>
              <tr>
                <td>
                  <Typography variant="body2">
                    {t("common:address")}:
                  </Typography>
                </td>
                <td>
                  <Detail variant="body2">{session?.user?.email}</Detail>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="body2">{t("common:id")}:</Typography>
                </td>
                <td>
                  <Detail variant="body2">{session.user.id}</Detail>
                </td>
              </tr>
              <tr>
                <td>
                  <Typography variant="body2">
                    {t("common:login-type")}:
                  </Typography>
                </td>
                <td>
                  <Detail variant="body2">{session.provider}</Detail>
                </td>
              </tr>
            </table>
          </Box>
        </>
      )}
    </>
  );
};

export default GameAccountDetails;
