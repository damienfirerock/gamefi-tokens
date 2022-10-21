import React, { useEffect, useState } from "react";
import { Box, Button, BoxProps, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import useConnectWallet from "../../utils/hooks/useConnectWallet";
import useWeb3Transactions from "../../utils/hooks/useWeb3Transactions";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(4, 0),
}));

const PokePointBalance: React.FunctionComponent = () => {
  const { account } = useConnectWallet();
  const {
    enquirePokePointsBalance,
    calculatePokePointsYield,
    withdrawPokePointsYield,
  } = useWeb3Transactions();

  const [balance, setBalance] = useState<number>(0);
  const [potentialYield, setPotentialYield] = useState<number>(0);

  const updatePokePointsBalance = async () => {
    if (!account) return;

    const balance = await enquirePokePointsBalance(account);
    const potentialYield = await calculatePokePointsYield(account);

    if (balance) setBalance(balance);
    setPotentialYield(potentialYield || 0);
  };

  const withdrawYield = async () => {
    if (!account) return;

    await withdrawPokePointsYield(account);
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
            href={
              "https://goerli.etherscan.io/address/0x405510959AD74dC775b42af151dDce93A9B48f2e#code"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            PokePoints
          </Link>{" "}
          through depositing your Pokemon
        </Typography>
      </StyledBox>

      {!!potentialYield && (
        <StyledBox>
          <Typography variant="h5">
            You can claim {potentialYield} PokePoints
          </Typography>{" "}
          <Button
            variant="outlined"
            sx={{ marginLeft: 1 }}
            onClick={withdrawYield}
          >
            Claim
          </Button>
        </StyledBox>
      )}
    </>
  );
};

export default PokePointBalance;
