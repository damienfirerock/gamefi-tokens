import * as React from "react";
import {
  Card,
  CardProps,
  CardActions,
  CardActionsProps,
  CardContent,
  CardContentProps,
  Button,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";

import { IProduct } from "../../interfaces/IProduct";
import { truncateString } from "../../utils/common";
import { ZERO_ADDRESS } from "../../constants";
import usePurchaseNFT from "../../utils/hooks/usePurchaseNFT";

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

  const handleClick = () => {
    if (tokenId !== undefined) purchaseNFT(tokenId, description, name);
  };

  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        <Typography variant="h4">{description}</Typography>
        <Typography variant="h5">{name}</Typography>
        <Image src={image} alt={image} width={125} height={125} />
        <Typography variant="h6">{displayOwner(owner)}</Typography>
      </StyledCardContent>
      <StyledCardActions>
        <Button
          size="large"
          variant="outlined"
          disabled={
            !(owner === process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS)
          }
          onClick={handleClick}
        >
          Buy
        </Button>
      </StyledCardActions>
    </StyledCard>
  );
};

export default PokemonCard;
