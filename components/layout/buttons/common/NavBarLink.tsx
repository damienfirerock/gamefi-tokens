import React, { ReactElement } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import NextLink from "next/link";

interface IAccountLink {
  href: string;
  text: string;
  icon?: ReactElement<any, any>;
}

const AccountLink: React.FunctionComponent<IAccountLink> = ({
  href,
  text,
  icon,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box sx={{ marginLeft: isMobile ? 0 : "0.5rem" }}>
      <NextLink href={href} passHref>
        <Button variant="outlined">
          <>
            {!!icon && icon}
            <Typography variant="body2" sx={{ marginLeft: 1 }}>
              {text}
            </Typography>
          </>
        </Button>
      </NextLink>
    </Box>
  );
};

export default AccountLink;
