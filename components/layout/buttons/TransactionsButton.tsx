import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button, { ButtonProps } from "@mui/material/Button";
import Image from "next/image";
import { styled } from "@mui/material/styles";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const TransactionsButton: React.FunctionComponent = () => {
  const { account, chainId } = useConnectWallet();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (
    !account ||
    chainId !== parseInt(process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID || "31337")
  ) {
    return null;
  }

  return (
    <>
      <StyledButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        <Image src="/player.png" alt="me" width="28" height="28" />
        <Typography variant="h6">Transactions</Typography>
      </StyledButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        PaperProps={{ sx: { width: 300 } }}
        transitionDuration={300}
        sx={{
          top: 20,
          right: 160,
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </>
  );
};

export default TransactionsButton;
