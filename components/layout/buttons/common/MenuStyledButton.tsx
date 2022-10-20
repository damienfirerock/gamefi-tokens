import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const MenuStyledButton = styled(Button)<ButtonProps>(() => ({
  minWidth: 150,
}));

export default MenuStyledButton;
