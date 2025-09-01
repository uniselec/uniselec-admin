import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ProcessSelection } from "../../../types/ProcessSelection";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useGetCoursesQuery } from "../../courses/courseSlice";
import { useGetAdmissionCategoriesQuery } from "../../admissionCategories/admissionCategorySlice";
import { useGetKnowledgeAreasQuery } from "../../knowledgeAreas/knowledgeAreaSlice";
import { CourseSelector } from "./CourseSelector";
import { AdmissionCategorySelector } from "./AdmissionCategorySelector";
import { Course } from "../../../types/Course";
import { AllowedEnemYearsSelector } from "./AllowedEnemYearsSelector";
import { BonusOptionSelector } from "./BonusOptionSelector";
import { useGetBonusOptionsQuery } from "../../bonusOptions/bonusOptionSlice";
import { KnowledgeAreaSelector } from "./KnowledgeAreaSelector";

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
  const typeOptions = [
    // { value: "sisu", label: "SISU" },
    { value: "enem_score", label: "Notas do Enem" },
  ];
  const statusOptions = [
    { value: "draft", label: "Rascunho" },
    { value: "active", label: "Ativo" },
    { value: "finished", label: "Finalizado" },
    { value: "archived", label: "Arquivado" },
  ];


  // Buscando as opções de cursos e admission categories
  const { data: coursesData } = useGetCoursesQuery({ page: 1, perPage: 100, search: "" });
  const { data: admissionCategoriesData } = useGetAdmissionCategoriesQuery({ page: 1, perPage: 100, search: "" });
  const { data: knowledgeAreasData } = useGetKnowledgeAreasQuery({ page: 1, perPage: 100, search: "" });
  const { data: bonusOptionsData } = useGetBonusOptionsQuery({ page: 1, perPage: 100, search: "" });
  const coursesOptions = coursesData?.data || [];

  const admissionCategoriesOptions = admissionCategoriesData?.data || [];
  const knowledgeAreasOptions = knowledgeAreasData?.data || [];
  const availableBonusOptions = bonusOptionsData?.data || [];

  // Função para tratar a mudança de datas, garantindo o formato UTC para o SQL.
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
                value={
                  typeOptions.find((option) => option.value === processSelection.type) || null
                }
                onChange={handleTypeChange}
                renderInput={(params) => (
                  <TextField {...params} required label="Tipo de Seleção" disabled={isdisabled} />
                )}
              />
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                value={
                  statusOptions.find((option) => option.value === processSelection.status) || null
                }
                onChange={handleStatusChange}
                renderInput={(params) => (
                  <TextField {...params} required label="Status" disabled={isdisabled} />
                )}
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <AllowedEnemYearsSelector
                allowedYears={processSelection.allowed_enem_years || []}
                setAllowedYears={(newYears) =>
                  setProcessSelection((prev) => ({ ...prev, allowed_enem_years: newYears as number[] }))
                }
              />
            </FormControl>
          </Grid>

          {/* Seleção de Admission Categories */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <AdmissionCategorySelector
                admissionCategoriesOptions={admissionCategoriesOptions}
                selectedAdmissionCategories={processSelection.admission_categories || []}
                setSelectedAdmissionCategories={(newCategories) => {
                    return setProcessSelection((prev) => ({
                      ...prev,
                      admission_categories: Array.isArray(newCategories) ? newCategories : [],
                    }))
                  }
                }
              />
            </FormControl>
          </Grid>

          {/* Seleção das áreas de conhecimento que receberão nota mínima. */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <KnowledgeAreaSelector
                knowledgeAreasOptions={knowledgeAreasOptions}
                selectedKnowledgeAreas={processSelection.knowledge_areas || []}
                setSelectedKnowledgeAreas={(newKnowledgeAreas) => {
                    return setProcessSelection((prev) => ({
                      ...prev,
                      knowledge_areas: Array.isArray(newKnowledgeAreas) ? newKnowledgeAreas : [],
                    }))
                  }
                }
              />
            </FormControl>
          </Grid>


          {/* Seleção de Cursos */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <CourseSelector
                coursesOptions={coursesOptions}
                selectedCourses={processSelection.courses || []}
                setSelectedCourses={(newCourses) =>
                  setProcessSelection((prev) => ({ ...prev, courses: newCourses as Course[] }))
                }
                selectedAdmissionCategories={processSelection.admission_categories || []}
                selectedKnowledgeAreas={processSelection.knowledge_areas || []}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <BonusOptionSelector
                bonusOptions={availableBonusOptions} // ou chame sua API para obter as opções
                selectedBonusOptions={processSelection.bonus_options || []}
                setSelectedBonusOptions={(newOptions) =>
                  setProcessSelection((prev: any) => ({ ...prev, bonus_options: newOptions }))
                }
              />
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
