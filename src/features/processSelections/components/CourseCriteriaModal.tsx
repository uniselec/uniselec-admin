import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { KnowledgeArea } from "../../../types/KnowledgeArea";
import { CourseCriteria } from "../../../types/Course";

type CourseCriteriaModalProps = {
  courseName: string;
  admissionCategories: AdmissionCategory[];
  knowledgeAreas: KnowledgeArea[];
  currentVacancies: { [key: string]: number } | undefined;
  currentMinimumScores: { [key: string]: number } | undefined;
  onClose: () => void;
  onSave: (criteria: CourseCriteria) => void;
};

const buildInitialMap = <T extends { name?: string; slug?: string }>(
  items: T[],
  currentValues: { [key: string]: number } | undefined
): { [key: string]: number } => {
  return items.reduce<{ [key: string]: number }>((acc, item) => {
    const key = "slug" in item && item.slug ? item.slug : item.name!;
    acc[key] = currentValues?.[key] ?? 0;
    return acc;
  }, {});
};

export const CourseCriteriaModal: React.FC<CourseCriteriaModalProps> = ({
  courseName,
  admissionCategories,
  knowledgeAreas,
  currentVacancies,
  currentMinimumScores,
  onClose,
  onSave,
}) => {

  const [vacanciesMap, setVacanciesMap] = useState<{ [key: string]: number }>(
    () => buildInitialMap(admissionCategories, currentVacancies)
  );

  const [minimumScoresMap, setMinimumScoresMap] = useState<{ [key: string]: number }>(
    () => buildInitialMap(knowledgeAreas, currentMinimumScores) 
  );

  const handleInputChange = (categoryName: string, value: string) => {
    const numberValue = parseInt(value, 10) || 0;
    setVacanciesMap((prev) => ({ ...prev, [categoryName]: numberValue }));
  };

  const handleMinimunScore = (knowledgeAreaName: string, value: string) => {
    const minimumScore = parseFloat(value);
    setMinimumScoresMap((prev) => ({ ...prev, [knowledgeAreaName]: isNaN(minimumScore) ? 0 : minimumScore }));
  }

  const handleSave = () => {
    onSave({
      vacanciesMap: vacanciesMap,
      minimumScoresMap: minimumScoresMap,
    });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Definir Vagas para {courseName}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {admissionCategories.map((cat) => (
            <Grid item xs={12} key={cat.id}>
              <TextField
                label={`Vagas para ${cat.name}`}
                type="number"
                value={vacanciesMap[cat.name]}
                onChange={(e) => handleInputChange(cat.name, e.target.value)}
                fullWidth
                margin="dense"
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogTitle>Definir nota mínima para</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {knowledgeAreas.map((knowledgeArea) => (
            <Grid item xs={12} key={knowledgeArea.slug}>
              <TextField
                label={knowledgeArea.name}
                type="number"
                value={minimumScoresMap[knowledgeArea.slug]}
                onChange={(e) => handleMinimunScore(knowledgeArea.slug, e.target.value)}
                fullWidth
                margin="dense"
                inputProps={{ step: "0.01" }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
