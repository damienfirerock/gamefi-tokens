import React, { useEffect, useState } from "react";
import { Box, Button, BoxProps, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store";
import { claimExpPoints } from "../../features/ArenaSlice";
import useConnectWallet from "../../utils/hooks/useConnectWallet";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const { NEXT_PUBLIC_EXPERIENCE_POINTS_ADDRESS } = process.env;

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const ExpPointBalance: React.FunctionComponent = () => {
  const { account } = useConnectWallet();
  const { enquireExpPointsBalance, calculateExpPointsClaim } =
    useWeb3Transactions();

  const dispatch = useDispatch<AppDispatch>();

  const [balance, setBalance] = useState<number>(0);
  const [potentialClaim, setPotentialClaim] = useState<number>(0);

  const updatePokePointsBalance = async () => {
    if (!account) return;

    const balance = await enquireExpPointsBalance(account);
    const potentialClaim = await calculateExpPointsClaim(account);

    setBalance(balance || 0);
    setPotentialClaim(potentialClaim || 0);
  };

  const claimPoints = async () => {
    if (!account) return;

    await dispatch(claimExpPoints(account));

    await updatePokePointsBalance();
  };

  useEffect(() => {
    if (!account) return;

    updatePokePointsBalance();
  }, [account]);

  return (
    <>
      <StyledBox>
        <Typography variant="h4">
          You have earned {balance}{" "}
          <Link
            href={`https://goerli.etherscan.io/address/${NEXT_PUBLIC_EXPERIENCE_POINTS_ADDRESS}#code`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ExperiencePoints
          </Link>{" "}
          through the Pokemon Arena
        </Typography>
      </StyledBox>

      {!!potentialClaim && (
        <StyledBox>
          <Typography variant="h5">
            You can claim {potentialClaim} PokePoints
          </Typography>{" "}
          <Button
            variant="outlined"
            sx={{ marginLeft: 1 }}
            onClick={claimPoints}
          >
            Claim
          </Button>
        </StyledBox>
      )}
    </>
  );
};

export default ExpPointBalance;
