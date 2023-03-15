import React from "react";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useSession, signIn, signOut } from "next-auth/react";

import Layout from "../layout/Layout";
import AlertBar from "../common/AlertBar";
import AccountDetails from "../main/AccountDetails";
import StyledCircularProgress from "../common/StyledCircularProgress";

import { AppDispatch, RootState } from "../../store";
import { clearError } from "../../features/TransactionSlice";
import { clearError as clearAirdropError } from "../../features/AirdropSlice";
import useSignature from "../../utils/hooks/useSignature";

//TODO: Change into common component
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

const Account: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common");
  const { data: session } = useSession();

  const { checkSignature } = useSignature();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { error } = transactionSlice;

  const airdropSlice = useSelector((state: RootState) => state.airdrop);
  const { error: airdropError } = airdropSlice;

  const handleClearAlert = () => {
    if (airdropError) {
      dispatch(clearAirdropError());
    } else if (error) {
      dispatch(clearError());
    }
  };

  const handleSignature = async () => {
    if (!session) return;

    const response = await checkSignature(session!.user.email!);
    console.log({ handle: response });
  };

  return (
    <Layout>
      {/* Header */}
      <AccountDetails />

      {session && (
        <Typography variant="h4">
          Email Account: {session.user.email}
        </Typography>
      )}

      <InteractButton
        text={session ? "Log Out" : "Log In"}
        method={session ? signOut : signIn}
        loading={false}
        // disabled={type === AirdropType.CUMULATIVE}
      />

      {session && (
        <InteractButton
          text={"Sign"}
          method={handleSignature}
          loading={false}
          // disabled={type === AirdropType.CUMULATIVE}
        />
      )}

      <AlertBar
        severity="warning"
        text={error || airdropError}
        handleClearAlertSource={handleClearAlert}
      />
    </Layout>
  );
};

export default Account;
