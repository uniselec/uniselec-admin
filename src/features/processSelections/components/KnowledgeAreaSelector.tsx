import React, { useState } from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";
import { KnowledgeArea } from "../../../types/KnowledgeArea";

type KnowledgeAreaSelectorProps = {
  knowledgeAreasOptions: KnowledgeArea[];
  selectedKnowledgeAreas: KnowledgeArea[];
  setSelectedKnowledgeAreas: React.Dispatch<React.SetStateAction<KnowledgeArea[]>>;
};

export const KnowledgeAreaSelector: React.FC<KnowledgeAreaSelectorProps> = ({
  knowledgeAreasOptions,
  selectedKnowledgeAreas,
  setSelectedKnowledgeAreas,
}) => {
  const [selectedOption, setSelectedOption] = useState<KnowledgeArea | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Filtra as opções, removendo as já selecionadas
  const filteredOptions = knowledgeAreasOptions.filter(
    (option) => !selectedKnowledgeAreas.some((knowledgeArea) => knowledgeArea.id === option.id)
  );

  // Ao selecionar uma modalidade, adiciona à lista e limpa o input
  const handleSelect = (_: any, newValue: KnowledgeArea | null) => {
    if (newValue) {
      setSelectedKnowledgeAreas([...selectedKnowledgeAreas, newValue]);
      setSelectedOption(null);
      setInputValue(""); // Limpa o input
    }
  };

  // Remove uma modalidade da lista
  const handleRemove = (knowledgeAreaId: number) => {
    setSelectedKnowledgeAreas(
      selectedKnowledgeAreas.filter((knowledgeArea) => knowledgeArea.id !== knowledgeAreaId)
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
          <TextField {...params} label="Adicione a Área de Conhecimento que Receberá Nota Mínima" variant="outlined" />
        )}
        onBlur={() => setSelectedOption(null)}
      />


      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {selectedKnowledgeAreas.map((knowledgeArea) => (
          <Chip
            key={`${knowledgeArea.id}-${knowledgeArea.name}`}
            label={knowledgeArea.name}
            onDelete={() => handleRemove(knowledgeArea.id!)}
          />
        ))}
      </Box>
    </Box>
  );
};
