import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";

const ConnectMetamask: React.FunctionComponent = () => {
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
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        <Image
          src="/metamask-logo-black-and-white.png"
          alt="me"
          width="28"
          height="28"
        />
        <Typography variant="h6" sx={{ marginLeft: 1 }}>
          Connect Metamask
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
    </div>
  );
};

export default ConnectMetamask;
