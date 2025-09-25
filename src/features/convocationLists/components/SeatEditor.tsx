import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

/** Estrutura <courseId,{ name,vacancies:{cat:qtd} }> */
export type VacancyPlan = Record<
  number,
  { name: string; vacancies: Record<string, number> }
>;

interface SeatEditorProps {
  open: boolean;
  onClose: () => void;
  /** Plano inicial (trazido de process_selection.courses) */
  defaultVacancyPlan: VacancyPlan;
  /** Callback para gravar no servidor */
  onSave: (vacancyPlan: VacancyPlan) => void;
}

export default function SeatEditor({
  open,
  onClose,
  defaultVacancyPlan,
  onSave,
}: SeatEditorProps) {
  const [vacancyPlanState, setVacancyPlanState] =
    useState<VacancyPlan>(defaultVacancyPlan);

  /** sempre que abrir, sincroniza */
  useEffect(() => {
    setVacancyPlanState(defaultVacancyPlan);
  }, [defaultVacancyPlan]);
    const toInt = (v: string) => Math.max(0, parseInt(v || '0', 10));

  const handleChange = (
    courseId: number,
    categoryName: string,
    value: string
  ) => {

    setVacancyPlanState((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        vacancies: {
          ...prev[courseId].vacancies,
          [categoryName]: Math.max(0, Number(value)),
        },
      },
    }));
  };

  const handleConfirm = () => onSave(vacancyPlanState);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configurar vagas por curso e categoria</DialogTitle>

      <DialogContent dividers>
        {Object.keys(vacancyPlanState).length === 0 && (
          <Typography color="text.secondary">
            Nenhum curso encontrado para este processo seletivo.
          </Typography>
        )}

        {Object.entries(vacancyPlanState).map(
          ([courseId, { name, vacancies }]) => (
            <Box key={courseId} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {name}
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    {Object.keys(vacancies).map((cat) => (
                      <TableCell key={cat}>{cat}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {Object.entries(vacancies).map(([cat, qty]) => (
                      <TableCell key={cat}>
                        <TextField
                          type="number"
                          size="small"
                          value={qty}
                          inputProps={{ min: 0 }}
                          onChange={(e) =>
                            handleChange(
                              Number(courseId),
                              cat,
                              e.target.value
                            )
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          )
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleConfirm}>
          Salvar &amp; Gerar vagas
        </Button>
      </DialogActions>
    </Dialog>
  );
}
