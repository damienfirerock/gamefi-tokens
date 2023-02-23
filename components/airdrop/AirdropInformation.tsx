import React, { useState } from "react";
import { Box, BoxProps, Button, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";

import StyledCircularProgress from "../common/StyledCircularProgress";
import SingleUseAirdrop from "./SingleUseAirdrop";

import { RootState } from "../../store";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import CONFIG, { CONTRACT_ADDRESSES, ADDRESS_NAMES } from "../../config";
import { AirdropType } from "../../interfaces/IAirdrop";
import CumulativeAirdrop from "./CumulativeAirdrop";

const addresses = Object.values(CONTRACT_ADDRESSES);

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(2, 0),
}));

const ContractsBox = styled(Box)<BoxProps>(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const InteractButton = (props: {
  text: string;
  method: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  const { text, method, loading, disabled = false } = props;
  return (
    <Button variant="outlined" onClick={method} disabled={loading || disabled}>
      {text}
      {loading && <StyledCircularProgress size={24} />}
    </Button>
  );
};

const AirdropInformation: React.FunctionComponent = () => {
  const { account, requestConnect } = useConnectWallet();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const [type, setType] = useState<AirdropType>(AirdropType.SINGLE_USE);

  const toggleType = () => {
    const nextType =
      type === AirdropType.SINGLE_USE
        ? AirdropType.CUMULATIVE
        : AirdropType.SINGLE_USE;
    setType(nextType);
  };

  return (
    <>
      {/* Show button to connect if not connected */}
      {!account && (
        <StyledBox>
          <InteractButton
            text="Connect"
            method={requestConnect}
            loading={loading}
          />
        </StyledBox>
      )}

      {account && (
        <>
          <Box sx={{ marginTop: 5 }}>
            <InteractButton
              text="Single Use"
              method={toggleType}
              loading={false}
              disabled={type === AirdropType.SINGLE_USE}
            />
            <InteractButton
              text="Cumulative"
              method={toggleType}
              loading={false}
              disabled={type === AirdropType.CUMULATIVE}
            />
          </Box>

          <StyledBox>
            <Typography variant="h2">
              {type === AirdropType.SINGLE_USE ? "Single Use" : "Cumulative"}{" "}
              Airdrop Details
            </Typography>
          </StyledBox>

          {/* Show JSON file for the airdrop details */}
          {type === AirdropType.SINGLE_USE ? (
            <SingleUseAirdrop />
          ) : (
            <CumulativeAirdrop />
          )}

          <ContractsBox>
            <Typography variant="h3">Addresses</Typography>
            {addresses.map((address) => {
              if (!address) return;
              return (
                <Typography
                  variant="h4"
                  key={address}
                  sx={{ display: "inline-flex", alignItems: "center" }}
                >
                  {ADDRESS_NAMES[address]}:
                  <Link
                    href={`${CONFIG.POLYGONSCAN_URL}${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address}
                  </Link>
                </Typography>
              );
            })}
          </ContractsBox>
        </>
      )}
    </>
  );
};

export default AirdropInformation;
