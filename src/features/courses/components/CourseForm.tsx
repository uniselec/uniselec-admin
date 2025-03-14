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
import { Course } from "../../../types/Course";

type Props = {
  course: Course;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setCourse: React.Dispatch<React.SetStateAction<Course>>;
};

export function CourseForm({
  course,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  setCourse,
}: Props) {
  const modalityOptions = [
    { value: "distance", label: "A Distância (EAD)" },
    { value: "in-person", label: "Presencial" },
  ];

  const statesOptions = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome do Curso"
                value={course.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={modalityOptions}
                getOptionLabel={(option) => option.label}
                value={modalityOptions.find((option) => option.value === course.modality) || null}
                onChange={(_, newValue) =>
                  setCourse((prev) => ({ ...prev, modality: newValue ? newValue.value : "" }))
                }
                renderInput={(params) => (
                  <TextField {...params} required label="Modalidade" disabled={isdisabled} />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                required
                name="campus"
                label="Campus"
                value={course.campus || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={statesOptions}
                getOptionLabel={(option) => option.label}
                value={statesOptions.find((option) => option.value === course.state) || null}
                onChange={(_, newValue) =>
                  setCourse((prev) => ({ ...prev, state: newValue ? newValue.value : "" }))
                }
                renderInput={(params) => (
                  <TextField {...params} required label="Estado (UF)" disabled={isdisabled} />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/courses">
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
