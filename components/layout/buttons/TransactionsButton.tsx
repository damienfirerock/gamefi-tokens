import React from "react";
import {
  Button,
  ButtonProps,
  CircularProgress,
  CircularProgressProps,
  Popover,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

import { RootState } from "../../../store";
import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import usePurchaseNFT from "../../../utils/hooks/usePurchaseNFT";

const StyledButton = styled(Button)<ButtonProps>(({ theme }) => ({
  marginRight: theme.spacing(1),
  minWidth: 150,
}));

const StyledCircularProgress = styled(CircularProgress)<CircularProgressProps>(
  ({ theme }) => ({
    marginRight: theme.spacing(0.5),
  })
);

const TransactionsButton: React.FunctionComponent = () => {
  const { account, chainId } = useConnectWallet();
  const transactionsSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { loading } = transactionsSlice;

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

  const showIcon = () => {
    if (loading) return <StyledCircularProgress color="secondary" size={24} />;

    return <Image src="/player.png" alt="me" width="28" height="28" />;
  };

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
        {showIcon()}
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
