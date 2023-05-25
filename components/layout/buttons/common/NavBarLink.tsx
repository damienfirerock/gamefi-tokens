import React, { ReactElement } from "react";
import { Box, Button, Typography } from "@mui/material";
import NextLink from "next/link";
import { isMobile } from "react-device-detect";

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
  return (
    <Box sx={{ mx: isMobile ? 0 : 1 }}>
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
