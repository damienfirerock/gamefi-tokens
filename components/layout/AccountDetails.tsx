import React, { useEffect, useRef } from "react";
import { Drawer, Popover, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";

import MenuStyledButton from "./buttons/common/MenuStyledButton";
import AccountOptions from "./AccountOptions";

import { AppDispatch, RootState } from "../../store";
import {
  setDialogOpen,
  setAccountDetailsOpen,
  setAccountDetailsButtonRef,
} from "../../features/AuthSlice";

const AccountDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const buttonRef = useRef(null);
  const { data: session } = useSession();

  const authSlice = useSelector((state: RootState) => state.auth);
  const { accountDetailsOpen, accountDetailsButtonRef } = authSlice;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    dispatch(setAccountDetailsOpen(event.currentTarget));
  };

  const handleClose = () => {
    dispatch(setAccountDetailsOpen(null));
  };

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  // Uses buttonRef as an anchor if Popover is opened from other parts of the webapp
  useEffect(() => {
    if (buttonRef.current)
      dispatch(setAccountDetailsButtonRef(buttonRef.current));
  }, [buttonRef]);

  const open = Boolean(accountDetailsOpen);
  const id = open ? "simple-popover" : undefined;

  const isLoggedIn = !!session;

  return (
    <>
      <MenuStyledButton
        variant="contained"
        ref={buttonRef}
        onClick={isLoggedIn ? handleClick : handleOpenLoginDialog}
      >
        <Typography variant="h6">{session?.user.email ?? "Login"}</Typography>
      </MenuStyledButton>
      {/* Popover should only show on Medium Screen and Above */}
      <Popover
        id={id}
        open={open}
        anchorEl={accountDetailsButtonRef}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        keepMounted
        PaperProps={{
          elevation: 0,
          variant: "popup",
        }}
        transitionDuration={300}
        sx={{
          top: 20,
          display: { xs: "none", sm: "none", md: "block" },
        }}
      >
        <AccountOptions />
      </Popover>
      {/* On Mobile, a bottom drawer will show instead of the Popup */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        sx={{ display: { xs: "block", sm: "block", md: "none" } }}
      >
        <AccountOptions />
      </Drawer>
    </>
  );
};

export default AccountDetails;
