import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const Badge = styled(Typography)<TypographyProps>(({ theme }) => ({
  display: "inline",
  color: "white",
  padding: theme.spacing(0.25, 0.75),
  borderRadius: 5,
}));

export default Badge;
