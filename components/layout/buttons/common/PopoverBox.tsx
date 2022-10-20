import { Box, BoxProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const PopoverBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(1.5),
}));

export default PopoverBox;
