import React from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";

type AllowedEnemYearsSelectorProps = {
  allowedYears: number[];
  setAllowedYears: React.Dispatch<React.SetStateAction<number[]>>;
};

export const AllowedEnemYearsSelector: React.FC<AllowedEnemYearsSelectorProps> = ({
  allowedYears,
  setAllowedYears,
}) => {
  const currentYear = new Date().getFullYear();
  const options = Array.from({ length: 6 }, (_, i) => currentYear - i); // [current, current-1, ..., current-5]

  return (
    <Box>
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.toString()}
        value={allowedYears}
        onChange={(_, newValue) => setAllowedYears(newValue)}
        renderTags={(value: number[], getTagProps) =>
          value.map((option, index) => (
            <Chip label={option.toString()} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Anos Permitidos para o ENEM" variant="outlined" />
        )}
      />
    </Box>
  );
};
