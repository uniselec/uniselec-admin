// features/courses/components/CourseForm.tsx
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
import { AcademicUnit } from "../../../types/AcademicUnit";
import { useGetAcademicUnitsQuery } from "../../academicUnits/academicUnitSlice"; // ajuste o caminho se necessário

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

  // Buscando a lista de unidades acadêmicas para preencher o Autocomplete
  const { data: academicUnitsData } = useGetAcademicUnitsQuery({ page: 1, perPage: 100 });
  const academicUnitOptions: AcademicUnit[] = academicUnitsData?.data || [];

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
                value={course.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          {/* Modalidade */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={modalityOptions}
                getOptionLabel={(option) => option.label}
                value={
                  modalityOptions.find(
                    (option) => option.value === course.modality
                  ) || null
                }
                onChange={(_, newValue) =>
                  setCourse((prev) => ({
                    ...prev,
                    modality: newValue ? newValue.value : "",
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Modalidade"
                    disabled={isdisabled}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Unidade Acadêmica */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={academicUnitOptions}
                getOptionLabel={(option) => option.name}
                value={
                  academicUnitOptions.find(
                    (option) => option.id === course.academic_unit?.id
                  ) || null
                }
                onChange={(_, newValue) =>
                  setCourse((prev) => ({
                    ...prev,
                    academic_unit: newValue ? newValue : ({} as AcademicUnit),
                  }))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Unidade Acadêmica"
                    disabled={isdisabled}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/courses">
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
