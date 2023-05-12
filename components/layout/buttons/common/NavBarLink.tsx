import React, { ReactElement } from "react";
import { Box, Typography } from "@mui/material";
import NextLink from "next/link";

import MenuStyledButton from "./MenuStyledButton";

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
    <Box sx={{ mx: 1 }}>
      <NextLink href={href} passHref>
        <MenuStyledButton variant="outlined">
          <>
            {!!icon && icon}
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {text}
            </Typography>
          </>
        </MenuStyledButton>
      </NextLink>
    </Box>
  );
};

export default AccountLink;
