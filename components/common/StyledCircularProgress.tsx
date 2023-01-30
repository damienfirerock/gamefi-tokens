import { CircularProgress, CircularProgressProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCircularProgress = styled(CircularProgress)<CircularProgressProps>(
  () => ({
    color: "rgba(60, 60, 60, 0.1)",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-12px",
    marginLeft: "-12px",
  })
);

export default StyledCircularProgress;
