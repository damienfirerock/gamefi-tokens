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
import { useDispatch } from "react-redux";

// import { RootState } from "../../../store";
// import { IProduct } from "../../../interfaces/IProduct";
// import { truncateString } from "../../../utils/common";
// import { ZERO_ADDRESS } from "../../../constants";

import WrappedGooglePayButton from "./GooglePayButton";

import { AppDispatch } from "../../store";
import useWeb3React from "../../utils/hooks/web3React/useWeb3React";
import { submitGooglePayDataForMint } from "../../features/TransactionSlice";

import {
  DisplayType,
  ICharacterSkinAttributes,
} from "../../interfaces/INFTAttributes";

export const StyledCard = styled(Card)<CardProps>(({ theme }) => ({
  margin: theme.spacing(1),
  width: theme.spacing(30),
}));

export const StyledCardContent = styled(CardContent)<CardContentProps>(
  ({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: theme.spacing(65),
  })
);

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

interface IListing extends ICharacterSkinAttributes {
  owner?: string;
  disabled?: boolean;
  buttonText?: string;
}

const Listing: React.FunctionComponent<IListing> = (props) => {
  const {
    contract,
    tokenId,
    collection,
    name,
    description,
    image,
    attributes,
    owner,
    disabled,
    buttonText,
  } = props;
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useWeb3React();

  // const transactionsSlice = useSelector(
  //   (state: RootState) => state.transactions
  // );
  // const { pendingTransactions } = transactionsSlice;

  // const pending = pendingTransactions.some((txn) => txn.tokenId === tokenId);

  // const isDisabled = disabled || pending;

  const handlePayment = (paymentData: google.payments.api.PaymentData) => {
    console.log({ paymentData });
    dispatch(
      submitGooglePayDataForMint({
        paymentData,
        account: account!,
        contract,
        tokenId: tokenId,
      })
    );
  };

  return (
    <StyledCard variant="outlined">
      <StyledCardContent>
        {" "}
        <Typography variant="h6">Token Id: {tokenId}</Typography>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="h6">{description}</Typography>
        <Typography variant="h6">Collection: {collection}</Typography>
        <Box sx={{ position: "relative" }}>
          <Image src={image} alt={image} width={125} height={125} />
        </Box>
        {attributes.map(({ trait_type, value, display_type }) => (
          <Typography variant="h6" key={trait_type}>
            {trait_type}: {!!display_type && "+"}
            {value}
            {display_type === DisplayType.BoostPercentage && "%"}
          </Typography>
        ))}
      </StyledCardContent>
      <StyledCardActions>
        <Box sx={{ position: "relative" }}>
          {/* <Button
            size="large"
            variant="outlined"
            disabled={isDisabled}
            onClick={handleClick}
          >
            {buttonText}
          </Button>
          {pending && <StyledCircularProgress size={24} />} */}
          <WrappedGooglePayButton handlePayment={handlePayment} />
        </Box>
      </StyledCardActions>
    </StyledCard>
  );
};

export default Listing;
