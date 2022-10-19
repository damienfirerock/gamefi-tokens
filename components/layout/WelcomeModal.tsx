import React, { useEffect } from "react";
import { Box, BoxProps, Typography, Link, Modal } from "@mui/material";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  background: "white",
  padding: theme.spacing(4),
  textAlign: "center",
  border: `5px solid rgba(201, 58, 42, 0.4)`,
  outline: "none",
}));

const WelcomeModal: React.FunctionComponent = () => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("thunderDomeWelcomeModalShown", "true");
  };

  useEffect(() => {
    const modalShown = localStorage.getItem("thunderDomeWelcomeModalShown");
    if (modalShown !== "true") setOpen(true);
  }, []);

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        <Image src="/prof-oak.jpeg" alt="me" width="150" height="150" />
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="h5" component="h2">
            Hello there!
            <br />
            You will need a{" "}
            <Link
              href={"https://metamask.io/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              wallet
            </Link>{" "}
            to interact with the pokemon here.
            <br />
            The contracts here are on the Goerli testnet.
            <br />
            You can get some Goerli Eth to run transactions from{" "}
            <Link
              href={"https://goerlifaucet.com/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
            .
          </Typography>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default WelcomeModal;
