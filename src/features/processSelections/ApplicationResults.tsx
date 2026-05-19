import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, Grid, Autocomplete, TextField, Card, CardContent,
} from "@mui/material";

import { useGetProcessSelectionQuery } from
  "../processSelections/processSelectionSlice";
import { CategoryBlock } from "./components/CategoryBlock";
import { DocumentButtons, CategoryData } from "./components/DocumentButtons";
import { GENERAL_CLASSIFICATION } from "./utils/generalClassification";

const ApplicationResults = () => {
  /* ---------- query-string helpers -------------------------------------- */
  const { search } = useLocation();
  const navigate = useNavigate();
  const qs = new URLSearchParams(search);

  const processSelectionId = qs.get("process_selection_id") ?? "";
  const admissionCategoryIds = qs.get("admission_category_ids") ?? "";
  const courseId = qs.get("course_id") ?? "";

  /* ---------- fetch processo seletivo ----------------------------------- */
  const { data: psData, isFetching: fetchingPS } =
    useGetProcessSelectionQuery({ id: processSelectionId }, { skip: !processSelectionId });

  const selectedCategoryIds = admissionCategoryIds
    ? admissionCategoryIds.split(",").map(Number)
    : [];

  /* ---------- estado agregado de outcomes por categoria ----------------- */
  const [allCategoryData, setAllCategoryData] = useState<Record<number, CategoryData>>({});

  /* limpa entradas de categorias que foram desmarcadas */
  useEffect(() => {
    setAllCategoryData(prev => {
      const next: Record<number, CategoryData> = {};
      for (const id of selectedCategoryIds) {
        if (prev[id]) next[id] = prev[id];
      }
      return next;
    });
  }, [admissionCategoryIds]);

  /* ---------- estados de carregamento / erro ---------------------------- */
  if (!processSelectionId)
    return <Typography>process_selection_id ausente na URL.</Typography>;
  if (fetchingPS) return <Typography>Carregando…</Typography>;
  if (!psData) return null;

  /* ---------- helpers --------------------------------------------------- */
  const categories = [GENERAL_CLASSIFICATION, ...(psData.data.admission_categories ?? [])];
  const courses = psData.data.courses ?? [];

  const selectedCategories = categories.filter(category => selectedCategoryIds.includes(category.id!));
  const selectedCourse = courses.find(course => course.id === Number(courseId));

  const shouldShowResults = !!processSelectionId && selectedCategories.length > 0 && !!courseId;

  const updateParam = (key: string, value?: string | number) => {
    const next = new URLSearchParams(search);
    if (!value) next.delete(key);
    else next.set(key, String(value));
    navigate({ search: `?${next.toString()}` }, { replace: true });
  };

  const updateCategories = (ids: number[]) => {
    const next = new URLSearchParams(search);
    if (ids.length === 0) next.delete("admission_category_ids");
    else next.set("admission_category_ids", ids.join(","));
    navigate({ search: `?${next.toString()}` }, { replace: true });
  };

  const handleCategoryData = (categoryId: number, data: CategoryData) => {
    setAllCategoryData(prev => ({ ...prev, [categoryId]: data }));
  };

  /* lista na ordem de seleção, apenas as que já carregaram */
  const categoryDataList = selectedCategories
    .filter(category => !!allCategoryData[category.id!])
    .map(category => allCategoryData[category.id!]);

  const allDataLoaded =
    selectedCategories.length > 0 &&
    selectedCategories.every(category => !!allCategoryData[category.id!]);

  /* ---------- render ---------------------------------------------------- */
  return (
    <Box sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Resultados</Typography>

        {/* filtros ----------------------------------------------------- */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={courses}
              getOptionLabel={course => `${course.name} - ${course.academic_unit?.name ?? ""}`}
              value={selectedCourse ?? null}
              onChange={(_, selectedValue) => updateParam("course_id", selectedValue?.id)}
              renderInput={inputProps => <TextField {...inputProps} label="Curso" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={categories}
              getOptionLabel={category => category.description ?? category.name}
              value={selectedCategories}
              onChange={(_, selectedValues) => updateCategories(selectedValues.map(category => category.id!))}
              renderInput={inputProps => <TextField {...inputProps} label="Modalidade" />}
            />
          </Grid>
        </Grid>

        {/* conteudo principal ----------------------------------------- */}
        {!shouldShowResults ? (
          <Card variant="outlined">
            <CardContent>
              <Typography>
                Selecione um <strong>Curso</strong> e ao menos uma <strong>Modalidade</strong> para visualizar ou gerar documentos.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          selectedCourse && (
            <>
              <DocumentButtons
                categoryDataList={categoryDataList}
                processSelection={psData.data}
                course={selectedCourse}
                disabled={!allDataLoaded}
              />
                <Typography variant="h5" sx={{ mt: 5, mb: 5, fontWeight: "bold"}}>
                  {psData?.data?.name} - {selectedCourse.name}
                </Typography>  
              {selectedCategories.map(category => (
                <CategoryBlock
                  key={category.id}
                  processSelection={psData.data}
                  admissionCategory={category}
                  course={selectedCourse}
                  processSelectionId={processSelectionId}
                  onData={handleCategoryData}
                />
              ))}
            </>
          )
        )}
      </Paper>
    </Box>
  );
};

export { ApplicationResults };
