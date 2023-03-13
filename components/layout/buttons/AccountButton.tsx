import React from "react";
import { Popover, Typography } from "@mui/material";

import MenuStyledButton from "./common/MenuStyledButton";
import ConnectWalletButtons from "./ConnectWalletButtons";
import PopoverBox from "./common/PopoverBox";

import { truncateString } from "../../../utils/common";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";

// FIXME: Button jumps to left in navbar on mobile
// FIXME: Need to double try connect with Metamask on Walletconnect ??
// TODO: Add useSignTransactions for signatures between Sequence versus Metamask for binding of wallets
// TODO: Potential issues in the future as font size between chinese and english text are clearly different

const AccountButton: React.FunctionComponent = () => {
  const { deactivate } = useWeb3React();
  const { account } = useActiveWeb3React();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <MenuStyledButton variant="contained" onClick={handleClick}>
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {account ? truncateString(account) : "Connect"}
        </Typography>
      </MenuStyledButton>
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
          sx: {
            width: 300,
          },
        }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        <PopoverBox sx={{ textAlign: "center" }}>
          {account ? (
            <>
              <MenuStyledButton variant="contained" disabled={true}>
                <Typography variant="h6" sx={{ marginLeft: 1 }}>
                  {truncateString(account)}
                </Typography>
              </MenuStyledButton>
              <MenuStyledButton variant="contained" onClick={deactivate}>
                <Typography variant="h6" sx={{ marginLeft: 1 }}>
                  Disconnect
                </Typography>
              </MenuStyledButton>
            </>
          ) : (
            <ConnectWalletButtons />
          )}
        </PopoverBox>
      </Popover>{" "}
    </>
  );
};

export default AccountButton;
