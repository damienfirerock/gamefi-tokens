import React, { useEffect, useState } from "react";
import { Box, Button, BoxProps, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../../store";
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

  const { loading } = useSelector((state: RootState) => state.arena);

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

    await dispatch(claimExpPoints({ address: account }));

    await updatePokePointsBalance();
  };

  useEffect(() => {
    if (!account || loading) return;

    // This updates balance after loading is done
    // By right, should update balance only upon arena victory
    updatePokePointsBalance();
  }, [account, loading]);

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
