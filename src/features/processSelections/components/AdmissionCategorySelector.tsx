import React, { useState } from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";
import { AdmissionCategory } from "../../../types/AdmissionCategory";

type AdmissionCategorySelectorProps = {
  admissionCategoriesOptions: AdmissionCategory[];
  selectedAdmissionCategories: AdmissionCategory[];
  setSelectedAdmissionCategories: React.Dispatch<React.SetStateAction<AdmissionCategory[]>>;
};

export const AdmissionCategorySelector: React.FC<AdmissionCategorySelectorProps> = ({
  admissionCategoriesOptions,
  selectedAdmissionCategories,
  setSelectedAdmissionCategories,
}) => {
  const [selectedOption, setSelectedOption] = useState<AdmissionCategory | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Filtra as opções, removendo as já selecionadas
  const filteredOptions = admissionCategoriesOptions.filter(
    (option) => !selectedAdmissionCategories.some((cat) => cat.id === option.id)
  );

  // Ao selecionar uma modalidade, adiciona à lista e limpa o input
  const handleSelect = (_: any, newValue: AdmissionCategory | null) => {
    if (newValue) {
      setSelectedAdmissionCategories([...selectedAdmissionCategories, newValue]);
      setSelectedOption(null);
      setInputValue(""); // Limpa o input
    }
  };

  // Remove uma modalidade da lista
  const handleRemove = (categoryId: number) => {
    setSelectedAdmissionCategories(
      selectedAdmissionCategories.filter((cat) => cat.id !== categoryId)
    );
  };

  return (
    <Box>
      <Autocomplete
        value={selectedOption}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={handleSelect}
        options={filteredOptions}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Adicionar Modalidade de Admissão" variant="outlined" />
        )}
        onBlur={() => setSelectedOption(null)}
      />

      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {selectedAdmissionCategories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onDelete={() => handleRemove(category.id!)}
          />
        ))}
      </Box>
    </Box>
  );
};
