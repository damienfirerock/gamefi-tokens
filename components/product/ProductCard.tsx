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
import { truncateWalletAddress } from "../../utils/common";

const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledCardContent = styled(CardContent)<CardContentProps>(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const StyledCardActions = styled(CardActions)<CardActionsProps>(() => ({
  display: "flex",
  justifyContent: "center",
}));

const PokemonCard: React.FunctionComponent<IProduct> = (props) => {
  const { name, description, image, tokenId, owner } = props;

  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        <Typography variant="h4">{description}</Typography>
        <Typography variant="h5">{name}</Typography>
        <Image src={image} alt={image} width={125} height={125} />
        <Typography>{truncateWalletAddress(owner)}</Typography>
      </StyledCardContent>
      <StyledCardActions>
        <Button
          size="large"
          disabled={
            !(owner === process.env.NEXT_PUBLIC_TOKEN_SALE_CONTRACT_ADDRESS)
          }
        >
          Buy
        </Button>
      </StyledCardActions>
    </StyledCard>
  );
};

export default PokemonCard;
