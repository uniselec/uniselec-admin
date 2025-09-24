// features/convocationListApplications/components/ConvocationListApplicationForm.tsx
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
import { ConvocationListApplication } from "../../../types/ConvocationListApplication";



type Props = {
  convocationListApplication: ConvocationListApplication;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setConvocationListApplication: React.Dispatch<React.SetStateAction<ConvocationListApplication>>;
};

export function ConvocationListApplicationForm({
  convocationListApplication,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  setConvocationListApplication,
}: Props) {
  const modalityOptions = [
    { value: "distance", label: "A Distância (EAD)" },
    { value: "in-person", label: "Presencial" },
  ];


  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Nome do Curso */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome do Curso"
                value={convocationListApplication.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>


          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/convocationListApplications">
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isdisabled || isLoading}
              >
                {isLoading ? "Salvando..." : "Guardar"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
