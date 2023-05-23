import React, { useEffect, useState } from "react";
import { Box, Typography, TypographyProps } from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { styled } from "@mui/material/styles";

import InteractButton from "../../common/InteractButton";

import { AppDispatch, RootState } from "../../../store";
import { truncateString, formatNumberValue } from "../../../utils/common";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";
import useCommonWeb3Transactions from "../../../utils/hooks/useCommonWeb3Transactions";
import { setLoading } from "../../../features/AccountSlice";
import useSignature from "../../../utils/hooks/useSignature";
import { SUPPORTED_WALLETS } from "../../../constants/wallets";
import { DETAILS_COLOUR } from "../../../src/theme";

const Detail = styled(Typography)<TypographyProps>(() => ({
  display: "inline-block",
  color: DETAILS_COLOUR,
  overflowWrap: "break-word",
  hyphens: "auto",
  maxWidth: "170px",
}));

const WalletDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { account, walletKey } = useActiveWeb3React();
  const { checkFRGBalance, checkMaticBalance } = useCommonWeb3Transactions();
  const { checkSignature } = useSignature();
  const { data: session } = useSession();

  const accountSlice = useSelector((state: RootState) => state.account);
  const { walletFRGBalance, walletMaticBalance, loading } = accountSlice;

  const [signStatus, setSignStatus] = useState<boolean>(false);

  const handleSignature = async () => {
    if (!session) return;

    dispatch(setLoading(true));

    const response = await checkSignature(session!.user.email!);
    setSignStatus(!!response);

    dispatch(setLoading(false));
  };

  const getWalletBalances = async () => {
    dispatch(setLoading(true));
    await checkFRGBalance();
    await checkMaticBalance();
    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (!account) return;

    getWalletBalances();
  }, [account]);

  return (
    <Box
      sx={{
        marginY: "0.5rem",
        maxWidth: 400,
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "1.6px solid #D8D8D8",
      }}
    >
      <Box sx={{ display: "flex", textAlign: "center" }}>
        {walletKey && (
          <Image
            src={SUPPORTED_WALLETS[walletKey].icon}
            alt={`${walletKey} Logo`}
            width="28"
            height="28"
          />
        )}
        <Typography
          variant="body2"
          sx={{ lineHeight: "2rem", marginLeft: "0.5rem" }}
        >
          {truncateString(account || "")}
        </Typography>
      </Box>
      {!!account && (
        <Typography
          variant="caption"
          sx={{ color: "red", display: "inline-block", marginY: "0.25rem" }}
        >
          [Mock] This connected wallet is different from the wallet address
          bound to your game account.
        </Typography>
      )}
      {!!account && (
        <Box
          sx={{ display: "flex", justifyContent: "center", marginY: "0.5rem" }}
        >
          <table>
            <tr>
              <td>
                <Typography variant="body2">MATIC:</Typography>
              </td>
              <td>
                <Detail variant="body2">
                  {formatNumberValue(walletMaticBalance || 0)}
                </Detail>
              </td>
            </tr>
            <tr>
              <td>
                <Typography variant="body2">$FRG:</Typography>
              </td>
              <td>
                <Detail variant="body2">
                  {formatNumberValue(walletFRGBalance || 0)}
                </Detail>
              </td>
            </tr>
          </table>
        </Box>
      )}
      {account && (
        <InteractButton
          text={signStatus ? "Bind New Wallet" : "Bind to Account"}
          method={handleSignature}
          loading={loading}
          variant="contained"
          sx={{ marginY: "0.25rem" }}
          fullWidth
        />
      )}
    </Box>
  );
};

export default WalletDetails;
