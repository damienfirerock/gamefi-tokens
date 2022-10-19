import * as React from "react";
import {
  Box,
  Card,
  CardProps,
  CardActions,
  CardActionsProps,
  CardContent,
  CardContentProps,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

import { RootState } from "../../store";
import { IProduct } from "../../interfaces/IProduct";
import { truncateString } from "../../utils/common";
import usePurchaseNFT from "../../utils/hooks/usePurchaseNFT";
import { ZERO_ADDRESS } from "../../constants";

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 160,
}));

export const StyledCardContent = styled(CardContent)<CardContentProps>(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

export const StyledCardActions = styled(CardActions)<CardActionsProps>(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    paddingBottom: theme.spacing(3),
  })
);

const displayOwner = (address: string) => {
  switch (address) {
    case ZERO_ADDRESS:
      return "???";
    case process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS:
      return "Available";
    default:
      return truncateString(address);
  }
};

const PokemonCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, image, tokenId, owner } = props;

  const { purchaseNFT } = usePurchaseNFT();
  const transactionsSlice = useSelector(
    (state: RootState) => state.transactions
  );
  const { pendingTransactions } = transactionsSlice;

  const handleClick = () => {
    if (tokenId !== undefined) purchaseNFT(tokenId, description, name);
  };

  const isPending = pendingTransactions.some((txn) => txn.tokenId === tokenId);

  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        <Typography variant="h4">{description}</Typography>
        <Typography variant="h5">{name}</Typography>
        <Image src={image} alt={image} width={125} height={125} />
        <Typography variant="h6">{displayOwner(owner)}</Typography>
      </StyledCardContent>
      <StyledCardActions>
        <Box sx={{ position: "relative" }}>
          <Button
            size="large"
            variant="outlined"
            disabled={
              !(
                owner === process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS
              ) || isPending
            }
            onClick={handleClick}
          >
            Buy
          </Button>
          {isPending && (
            <CircularProgress
              size={24}
              sx={{
                color: "rgba(60, 60, 60, 0.1)",
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </StyledCardActions>
    </StyledCard>
  );
};

export default PokemonCard;
