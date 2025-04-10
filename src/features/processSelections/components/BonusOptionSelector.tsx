import React from "react";
import { Box, TextField, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { BonusOption } from "../../../types/BonusOption";

type BonusOptionSelectorProps = {
  bonusOptions: BonusOption[]; // Lista de opções disponíveis
  selectedBonusOptions: BonusOption[]; // Lista de opções já selecionadas
  setSelectedBonusOptions: React.Dispatch<React.SetStateAction<BonusOption[]>>; // Função para atualizar as opções selecionadas
};

export const BonusOptionSelector: React.FC<BonusOptionSelectorProps> = ({
  bonusOptions,
  selectedBonusOptions,
  setSelectedBonusOptions,
}) => {
  return (
    <Box>
      <Autocomplete
        multiple
        options={bonusOptions}
        getOptionLabel={(option) => `${option.name} (${option.value}%)`}
        value={selectedBonusOptions}
        onChange={(_, newValue) => setSelectedBonusOptions(newValue)}
        renderTags={(value: BonusOption[], getTagProps) =>
          value.map((option, index) => {
            // Remove a propriedade key vinda do getTagProps para evitar duplicidade
            const { key, ...chipProps } = getTagProps({ index });
            return (
              <Chip
                {...chipProps}
                key={option.id || index}
                label={`${option.name} (${option.value}%)`}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Bonus Options"
            placeholder="Select bonus options"
          />
        )}
      />
    </Box>
  );
};
