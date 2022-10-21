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
  CircularProgressProps,
  Button,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { styled } from "@mui/material/styles";

import { IProduct } from "../../../interfaces/IProduct";
import { truncateString } from "../../../utils/common";
import { ZERO_ADDRESS } from "../../../constants";

interface IStyledCard extends CardProps {
  shouldHoverEffect?: boolean;
}

interface IPokemonCard extends IProduct {
  pending: boolean;
  disabled: boolean;
  buttonText: string;
  handleClick: () => void;
}

export const StyledCard = styled(Card)<IStyledCard>(
  ({ theme, shouldHoverEffect }) => ({
    margin: theme.spacing(1),
    minWidth: 160,
    "@keyframes Move": {
      "0%": {
        transform: "rotate(0)",
        bottom: "-5%",
      },
      "25%": {
        transform: "rotate(-0.01turn)",
      },
      "50%": {
        transform: "rotate(0)",
        bottom: "5%",
      },
      "75%": {
        transform: "rotate(0.01turn)",
      },
      "100%": { transform: "rotate(0)", bottom: "-5%" },
    },

    "&:hover": {
      "span > img": {
        animation: shouldHoverEffect ? "Move 0.5s linear infinite" : "",
      },
    },
  })
);

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

export const StyledCircularProgress = styled(
  CircularProgress
)<CircularProgressProps>(({ theme }) => ({
  color: "rgba(60, 60, 60, 0.1)",
  position: "absolute",
  top: "50%",
  left: "50%",
  marginTop: "-12px",
  marginLeft: "-12px",
}));

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

const PokemonCard: React.FunctionComponent<IPokemonCard> = (props) => {
  const {
    name,
    description,
    image,
    owner,
    pending,
    disabled,
    buttonText,
    handleClick,
  } = props;

  return (
    <StyledCard variant="outlined" shouldHoverEffect={!disabled}>
      <StyledCardContent>
        <Typography variant="h4">{description}</Typography>
        <Typography variant="h5">{name}</Typography>
        <Box sx={{ position: "relative" }}>
          <Image src={image} alt={image} width={125} height={125} />
        </Box>
        <Typography variant="h6">{displayOwner(owner)}</Typography>
      </StyledCardContent>
      <StyledCardActions>
        <Box sx={{ position: "relative" }}>
          <Button
            size="large"
            variant="outlined"
            disabled={disabled}
            onClick={handleClick}
          >
            {buttonText}
          </Button>
          {pending && (
            <StyledCircularProgress
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
