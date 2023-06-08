import React from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  InputBase,
  InputBaseProps,
  InputLabel,
  MenuItem,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled } from "@mui/material/styles";

import { PAPER_BACKGROUND, WHITE } from "../../src/theme";

const MOCK_SERVERS = ["海洋", "正式服1", "测试服1", "YH1", "SG", "A1"];
const SELECTED_COLOUR = "#413D55";

const StyledInputBase = styled(InputBase)<InputBaseProps>(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    color: WHITE,
    backgroundColor: PAPER_BACKGROUND,
    paddingTop: "0.7rem",
    paddingBottom: "0.7rem",
    borderRadius: "0.5rem",
    "&:focus": {
      backgroundColor: PAPER_BACKGROUND,
      borderRadius: "0.5rem",
    },
  },
}));

interface IServerSelection {
  selectedServer: string;
  handleSelectServer: (event: SelectChangeEvent) => void;
}

const ServerSelection: React.FunctionComponent<IServerSelection> = (props) => {
  const { selectedServer, handleSelectServer } = props;

  return (
    <Box sx={{ marginBottom: 2 }}>
      <FormControl variant="standard" fullWidth error={!selectedServer}>
        <InputLabel
          sx={{
            color: `${WHITE} !important`,
          }}
          shrink={true}
        >
          Server
        </InputLabel>
        <Select
          value={selectedServer}
          label="Server"
          onChange={handleSelectServer}
          notched={true}
          input={<StyledInputBase />}
          MenuProps={{
            PaperProps: {
              sx: {
                "& .MuiMenuItem-root": {
                  "&:active": {
                    bgcolor: SELECTED_COLOUR,
                  },
                  "&:focus": {
                    bgcolor: SELECTED_COLOUR,
                  },
                },
                "& .Mui-selected": {
                  bgcolor: SELECTED_COLOUR,
                },
              },
            },
          }}
          sx={{
            "& .MuiSvgIcon-root": {
              color: WHITE,
            },
          }}
        >
          {MOCK_SERVERS.map((server) => (
            <MenuItem key={server} value={server}>
              {server}
            </MenuItem>
          ))}
        </Select>
        {!selectedServer && (
          <FormHelperText>Server selection required</FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default ServerSelection;
