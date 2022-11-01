import React, { ReactElement } from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import NextLink from "next/link";

import MenuStyledButton from "./MenuStyledButton";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

interface IAccountLink {
  href: string;
  text: string;
  icon: ReactElement<any, any>;
}

const AccountLink: React.FunctionComponent<IAccountLink> = ({
  href,
  text,
  icon,
}) => {
  return (
    <StyledBox>
      <NextLink href={href} passHref>
        <MenuStyledButton variant="outlined">
          <>
            {icon}
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {text}
            </Typography>
          </>
        </MenuStyledButton>
      </NextLink>
    </StyledBox>
  );
};

export default AccountLink;
