/* --------------------------------------------------------------------------
 * src/features/applicationResults/ApplicationResults.tsx
 * -------------------------------------------------------------------------- */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box, Paper, Typography, Grid, Autocomplete, TextField, Card, CardContent,
} from "@mui/material";

import { useGetProcessSelectionQuery }  from
  "../processSelections/processSelectionSlice";
import { useGetApplicationOutcomesQuery } from
  "../applicationOutcomes/applicationOutcomeSlice";

import { ApplicationOutcomeGenerateDocuments } from
  "./components/ApplicationOutcomeGenerateDocuments";

const ApplicationResults = () => {
  /* ---------- query-string helpers -------------------------------------- */
  const { search } = useLocation();
  const navigate   = useNavigate();
  const qs         = new URLSearchParams(search);

  const processSelectionId  = qs.get("process_selection_id")  ?? "";
  const admissionCategoryId = qs.get("admission_category_id") ?? "";
  const courseId            = qs.get("course_id")             ?? "";

  /* ---------- fetch processo seletivo ----------------------------------- */
  const { data: psData, isFetching: fetchingPS } =
    useGetProcessSelectionQuery({ id: processSelectionId }, { skip: !processSelectionId });

  /* ---------- fetch outcomes (apenas quando tudo escolhido) ------------- */
  const shouldFetchOutcomes =
    !!processSelectionId && !!admissionCategoryId && !!courseId;

  const {
    data: outData,
    isFetching: fetchingOut,
    error: outError,
  } = useGetApplicationOutcomesQuery(
    shouldFetchOutcomes
      ? {
          page: 1,
          perPage: 5000,
          filters: {
            process_selection_id: processSelectionId,
            admission_category_id: admissionCategoryId,
            course_id: courseId,
          },
        }
      : // não faz consulta se não deve
        { skip: true } as any
  );

  /* ---------- estados de carregamento / erro ---------------------------- */
  if (!processSelectionId)
    return <Typography>process_selection_id ausente na URL.</Typography>;
  if (fetchingPS)           return <Typography>Carregando…</Typography>;
  if (!psData)              return null;

  /* ---------- helpers --------------------------------------------------- */
  const categories = psData.data.admission_categories ?? [];
  const courses    = psData.data.courses ?? [];

  const selectedCategory = categories.find(c => c.id === Number(admissionCategoryId));
  const selectedCourse   = courses   .find(c => c.id === Number(courseId));

  /* ===>>  NOVO: quantidade de vagas da modalidade no curso  <<=== */
  const vacancies =
    selectedCourse && selectedCategory
      ? selectedCourse.vacanciesByCategory?.[selectedCategory.name] ?? 0
      : 0;

  /* controla a QS */
  const updateParam = (key: string, value?: string|number) => {
    const next = new URLSearchParams(search);
    if (!value) next.delete(key);
    else        next.set(key, String(value));
    navigate({ search:`?${next.toString()}` }, { replace:true });
  };

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
              getOptionLabel={o => `${o.name} - ${o.academic_unit?.name ?? ""}`}
              value={selectedCourse ?? null}
              onChange={(_, v) => updateParam("course_id", v?.id)}
              renderInput={p => <TextField {...p} label="Curso" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={categories}
              getOptionLabel={o => o.description ?? o.name}
              value={selectedCategory ?? null}
              onChange={(_, v) => updateParam("admission_category_id", v?.id)}
              renderInput={p => <TextField {...p} label="Modalidade" />}
            />
          </Grid>
        </Grid>

        {/* conteudo principal ----------------------------------------- */}
        { !shouldFetchOutcomes ? (
          <Card variant="outlined">
            <CardContent>
              <Typography>
                Selecione um <strong>Curso</strong> e uma <strong>Modalidade</strong> para visualizar ou gerar documentos.
              </Typography>
            </CardContent>
          </Card>
        ) : outError ? (
          <Typography color="error">Erro ao carregar resultados.</Typography>
        ) : fetchingOut ? (
          <Typography>Carregando resultados…</Typography>
        ) : (
          selectedCategory && selectedCourse && (
            <ApplicationOutcomeGenerateDocuments
              applicationOutcomes={outData?.data ?? []}
              processSelection={psData.data}
              admissionCategory={selectedCategory}
              course={selectedCourse}
              vacancies={vacancies}
            />
          )
        )}
      </Paper>
    </Box>
  );
};

export { ApplicationResults };
