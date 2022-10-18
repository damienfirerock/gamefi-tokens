import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../../store";
import { fetchTransactions } from "../../../features/TransactionsSlice";
import useConnectWallet from "../../../utils/hooks/useConnectWallet";

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
  const dispatch = useDispatch<AppDispatch>();

  const transactionsSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { loading, data } = transactionsSlice;

  const { account, chainId } = useConnectWallet();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  useEffect(() => {
    if (account) {
      dispatch(fetchTransactions(account));
    }
  }, [account]);

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
  console.log({ data });
  return (
    <>
      <StyledButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
      >
        {showIcon()}
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {loading ? "Pending..." : "Transactions"}
        </Typography>
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
        PaperProps={{ sx: { width: 500 } }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        {data?.length ? (
          data.map((element) => (
            <Typography sx={{ p: 2 }} key={element.transactionHash}>
              {JSON.stringify(element)}
            </Typography>
          ))
        ) : (
          <Typography sx={{ p: 2 }}>No transactions yet</Typography>
        )}
      </Popover>
    </>
  );
};

export default TransactionsButton;
