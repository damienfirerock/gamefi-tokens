import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useSession } from "next-auth/react";

import Layout from "../layout/Layout";
import AccountDetails from "../main/AccountDetails";
import InteractButton from "../common/InteractButton";

import { AppDispatch, RootState } from "../../store";
import { setLoading } from "../../features/TransactionSlice";
import useSignature from "../../utils/hooks/useSignature";

const Account: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("common");
  const { data: session } = useSession();

  const { checkSignature } = useSignature();

  const transactionSlice = useSelector((state: RootState) => state.transaction);
  const { loading } = transactionSlice;

  const [signStatus, setSignStatus] = useState<boolean>(false);

  const handleSignature = async () => {
    if (!session) return;

    dispatch(setLoading(true));

    const response = await checkSignature(session!.user.email!);
    setSignStatus(!!response);

    dispatch(setLoading(false));
    console.log({ handle: response });
  };

  return (
    <Layout>
      {/* Header */}
      <AccountDetails />
      {session && (
        <Typography variant="h6">
          Email Account: {session.user.email}
        </Typography>
      )}

      {session && (
        <InteractButton
          text={"Sign"}
          method={handleSignature}
          loading={loading}
          variant="contained"
        />
      )}

      {session && (
        <Typography variant="h6">Signed:{signStatus.toString()}</Typography>
      )}
    </Layout>
  );
};

export default Account;
