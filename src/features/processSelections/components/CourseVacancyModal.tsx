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

type CourseVacancyModalProps = {
  courseName: string;
  admissionCategories: AdmissionCategory[];
  currentVacancies: { [key: string]: number } | undefined;
  onClose: () => void;
  onSave: (vacanciesMapping: { [key: string]: number }) => void;
};

export const CourseVacancyModal: React.FC<CourseVacancyModalProps> = ({
  courseName,
  admissionCategories,
  currentVacancies,
  onClose,
  onSave,
}) => {
  const [vacanciesMap, setVacanciesMap] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Initialize mapping using category names as keys.
    const initialMap: { [key: string]: number } = {};
    admissionCategories.forEach((cat) => {
      initialMap[cat.name] =
        currentVacancies && currentVacancies[cat.name] ? currentVacancies[cat.name] : 0;
    });
    setVacanciesMap(initialMap);
  }, [admissionCategories, currentVacancies]);

  const handleInputChange = (categoryName: string, value: string) => {
    const numberValue = parseInt(value, 10) || 0;
    setVacanciesMap((prev) => ({ ...prev, [categoryName]: numberValue }));
  };

  const handleSave = () => {
    onSave(vacanciesMap);
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
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
