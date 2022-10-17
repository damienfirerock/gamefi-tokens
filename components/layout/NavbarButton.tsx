import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import ConnectMetamask from "./ConnectMetamask";
import ChangeChainId from "./ChangeChainId";

import useConnectWallet from "../../utils/hooks/useConnectWallet";

const NavbarButton: React.FunctionComponent = () => {
  const { account, chainId, error } = useConnectWallet();

  console.log({ account, chainId, error });

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

  if (!account) return <ConnectMetamask />;

  // TODO: use ENV file
  if (chainId !== 5 && chainId !== 31337) return <ChangeChainId />;

  return (
    <>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Menu
        </Typography>
      </Button>
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
        PaperProps={{ sx: { width: 300 } }}
        transitionDuration={300}
        sx={{
          top: 20,
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </>
  );
};

export default NavbarButton;
