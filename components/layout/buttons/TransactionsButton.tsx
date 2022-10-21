import React, { useEffect } from "react";
import {
  Box,
  Card,
  CardProps,
  CircularProgress,
  CircularProgressProps,
  Link,
  Popover,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import PopoverBox from "./common/PopoverBox";
import MenuStyledButton from "./common/MenuStyledButton";

import { AppDispatch, RootState } from "../../../store";
import { fetchTransactions } from "../../../features/TransactionsSlice";
import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import usePreviousNumberValue from "../../../utils/hooks/usePreviousNumberValue";
import { truncateString, capitaliseString } from "../../../utils/common";

const StyledCircularProgress = styled(CircularProgress)<CircularProgressProps>(
  ({ theme }) => ({
    marginRight: theme.spacing(0.5),
  })
);

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const TransactionsButton: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const transactionsSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { loading, data, pendingTransactions } = transactionsSlice;

  const { account, chainId } = useConnectWallet();

  const prevLength = usePreviousNumberValue(pendingTransactions.length);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  useEffect(() => {
    if (account) {
      dispatch(fetchTransactions(account));
    }
  }, [account]);

  useEffect(() => {
    if (prevLength > pendingTransactions.length && !!account) {
      dispatch(fetchTransactions(account));
    }
  }, [pendingTransactions.length, account]);

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
      <MenuStyledButton
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{ marginX: 1 }}
      >
        {showIcon()}
        <Typography variant="h6" sx={{ marginLeft: 0.5 }}>
          {loading ? "Pending..." : "Transactions"}
        </Typography>
      </MenuStyledButton>
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
        PaperProps={{
          elevation: 0,
          variant: "popup",
          sx: {
            width: 380,
          },
        }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        {!!pendingTransactions.length && (
          <PopoverBox>
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
              Pending transactions:
            </Typography>
            {pendingTransactions.map(({ tokenId, name, description, type }) => (
              <StyledCard key={tokenId + type} variant="outlined">
                <Typography variant="h6">
                  {type}: #{description} - {capitaliseString(name)}
                </Typography>
              </StyledCard>
            ))}
          </PopoverBox>
        )}
        <PopoverBox>
          {!!data?.length && (
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
              Last {data.length === 5 && "5 "}transactions:
            </Typography>
          )}
          {data?.length ? (
            data.map(({ transactionHash, category }) => (
              <StyledCard key={transactionHash} variant="outlined">
                <Typography variant="h6">
                  {category}:{" "}
                  <Link
                    href={`https://goerli.etherscan.io/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {truncateString(transactionHash, 8)}
                  </Link>
                </Typography>
              </StyledCard>
            ))
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5">No transactions yet</Typography>
            </Box>
          )}
        </PopoverBox>
      </Popover>
    </>
  );
};

export default TransactionsButton;
