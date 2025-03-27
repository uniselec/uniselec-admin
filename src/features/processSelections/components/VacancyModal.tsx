import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

type VacancyModalProps = {
  courseName: string;
  currentVacancies: number;
  onClose: () => void;
  onSave: (vacancies: number) => void;
};

export const VacancyModal: React.FC<VacancyModalProps> = ({
  courseName,
  currentVacancies,
  onClose,
  onSave,
}) => {
  const [vacancies, setVacancies] = useState<number>(currentVacancies);

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Definir Vagas para {courseName}</DialogTitle>
      <DialogContent>
        <TextField
          label="Número de Vagas"
          type="number"
          value={vacancies}
          onChange={(e) => setVacancies(Number(e.target.value))}
          fullWidth
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(vacancies)} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
