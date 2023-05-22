import React from "react";
import { Drawer, Popover, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";

import MenuStyledButton from "./buttons/common/MenuStyledButton";
import AccountOptions from "./AccountOptions";

import { AppDispatch } from "../../store";
import { setDialogOpen } from "../../features/AuthSlice";

const AccountDetails: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenLoginDialog = () => {
    dispatch(setDialogOpen());
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const isLoggedIn = !!session;

  return (
    <>
      <MenuStyledButton
        variant="contained"
        onClick={isLoggedIn ? handleClick : handleOpenLoginDialog}
      >
        <Typography variant="h6">{session?.user.email ?? "Login"}</Typography>
      </MenuStyledButton>
      {/* Popover should only show on Medium Screen and Above */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
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
