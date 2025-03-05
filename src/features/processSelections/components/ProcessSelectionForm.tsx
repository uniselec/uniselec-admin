import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ProcessSelection } from "../../../types/ProcessSelection";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

dayjs.extend(utc);
dayjs.extend(timezone);

type Props = {
  processSelection: ProcessSelection;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTypeChange: (event: any, newValue: { value: string; label: string } | null) => void;
  handleStatusChange: (event: any, newValue: { value: string; label: string } | null) => void;
  setProcessSelection: React.Dispatch<React.SetStateAction<ProcessSelection>>;
};

export function ProcessSelectionForm({
  processSelection,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  handleTypeChange,
  handleStatusChange,
  setProcessSelection,
}: Props) {
  const typeOptions = [{ value: "sisu", label: "SISU" }];
  const statusOptions = [
    { value: "draft", label: "Rascunho" },
    { value: "active", label: "Ativo" },
    { value: "finished", label: "Finalizado" },
    { value: "archived", label: "Arquivado" },
  ];

  // ✅ Ajuste para armazenar corretamente a data em UTC
  const handleDateChange = (field: "start_date" | "end_date") => (newDate: any) => {
    if (newDate) {
      const formattedDate = dayjs(newDate).utc().format("YYYY-MM-DD HH:mm:ss");
      setProcessSelection((prev) => ({ ...prev, [field]: formattedDate }));
    }
  };

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Nome */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome da Seleção (Ex: Edital 25/2024)"
                value={processSelection.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          {/* Descrição */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="description"
                label="Descrição"
                value={processSelection.description || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          {/* Tipo */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={typeOptions}
                getOptionLabel={(option) => option.label}
                value={typeOptions.find((option) => option.value === processSelection.type) || null}
                onChange={handleTypeChange}
                renderInput={(params) => <TextField {...params} required label="Tipo de Seleção" disabled={isdisabled} />}
              />
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                value={statusOptions.find((option) => option.value === processSelection.status) || null}
                onChange={handleStatusChange}
                renderInput={(params) => <TextField {...params} required label="Status" disabled={isdisabled} />}
              />
            </FormControl>
          </Grid>

          {/* Data de Início */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Data de Início"
                  value={processSelection.start_date ? dayjs.utc(processSelection.start_date) : null}
                  onChange={handleDateChange("start_date")}
                  disabled={isdisabled}
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          {/* Data de Fim */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Data de Fim"
                  value={processSelection.end_date ? dayjs.utc(processSelection.end_date) : null}
                  onChange={handleDateChange("end_date")}
                  disabled={isdisabled}
                  ampm={false}
                  format="DD/MM/YYYY HH:mm"
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          {/* Ações */}
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/process-selections">
                Voltar
              </Button>
              <Button type="submit" variant="contained" color="secondary" disabled={isdisabled || isLoading}>
                {isLoading ? "Salvando..." : "Guardar"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
