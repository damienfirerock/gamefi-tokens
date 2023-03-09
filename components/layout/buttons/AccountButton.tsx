import React from "react";
import { Popover, Typography } from "@mui/material";

import MenuStyledButton from "./common/MenuStyledButton";
import ConnectWalletButtons from "./ConnectWalletButtons";
import PopoverBox from "./common/PopoverBox";

import useConnectWallet from "../../../utils/hooks/useConnectWallet";
import { truncateString } from "../../../utils/common";
import useWeb3React from "../../../utils/hooks/web3React/useWeb3React";
import useActiveWeb3React from "../../../utils/hooks/web3React/useActiveWeb3React";

// FIXME: Connecting with Metamask does not update account in useActiveWeb3Wallet()
// FIXME: Button jumps to left in navbar on mobile
// TODO: Update useAirdropTransactions
// TODO: Add useSignTransactions for signatures between Sequence versus Metamask for binding of wallets

// Connects to Metamask on Desktop
// Connects to Sequence on Desktop

// Connects to Metamask via WalletConnect on Mobile
// Connects to Sequence on Mobile
// Connects to Metamask via Metamask Browser on Mobile

const AccountButton: React.FunctionComponent = () => {
  const { deactivate } = useWeb3React();
  const { account } = useActiveWeb3React();
  const { account: originalAccount } = useConnectWallet();

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

  const connectedAddress = account || originalAccount;
  console.log({ account, originalAccount });
  return (
    <>
      <MenuStyledButton variant="contained" onClick={handleClick}>
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          {connectedAddress ? truncateString(connectedAddress) : "Connect"}
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
          {connectedAddress ? (
            <>
              <MenuStyledButton variant="contained" disabled={true}>
                <Typography variant="h6" sx={{ marginLeft: 1 }}>
                  {truncateString(connectedAddress)}
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
