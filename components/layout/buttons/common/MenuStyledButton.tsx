import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const MenuStyledButton = styled(Button)<ButtonProps>(() => ({
  minWidth: 180,
}));

export default MenuStyledButton;
