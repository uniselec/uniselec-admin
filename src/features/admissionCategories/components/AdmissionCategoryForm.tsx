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
import { AdmissionCategory } from "../../../types/AdmissionCategory";

type Props = {
  admissionCategory: AdmissionCategory;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setAdmissionCategory: React.Dispatch<React.SetStateAction<AdmissionCategory>>;
};

export function AdmissionCategoryForm({
  admissionCategory,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  setAdmissionCategory,
}: Props) {



  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome da Modalidade"
                value={admissionCategory.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="description"
                label="Descrição"
                value={admissionCategory.description || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>



          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/academic-units">
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
