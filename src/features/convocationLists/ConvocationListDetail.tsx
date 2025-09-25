import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  useGetConvocationListQuery,
  useUpdateConvocationListMutation,
  useGenerateSeatsMutation,
  useGenerateApplicationsMutation,
  useAllocateSeatsMutation,
  usePublishConvocationListMutation,
} from './convocationListSlice';

import ChainsEditor from './components/ChainsEditor';
import SeatEditor, { VacancyPlan } from './components/SeatEditor';

import { useGetProcessSelectionQuery } from '../processSelections/processSelectionSlice';

import {
  ConvocationList,
  RemapRules,
} from '../../types/ConvocationList';
import { AdmissionCategory } from '../../types/AdmissionCategory';
import { Course } from '../../types/Course';
import { ConvocationListSeatList } from './ConvocationListSeatist';
import { ConvocationListApplicationList } from './ConvocationListApplicationList';

/* ────────────────────────────────────────────────────────────── */
/* utilitário: converte o VacancyPlan no formato aceito pelo back */
const vacancyPlanToSeats = (plan: VacancyPlan) =>
  Object.entries(plan).map(([courseId, { vacancies }]) => ({
    course_id: Number(courseId),
    vacanciesByCategory: vacancies,
  }));

/* ────────────────────────────────────────────────────────────── */
export const ConvocationListDetail = () => {
  const { id: processSelectionId, convocationListId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  /* ────── dados remotos ────── */
  const { data: convocationListResponse, isFetching } =
    useGetConvocationListQuery({ id: convocationListId! });

  const { data: processSelectionResponse } = useGetProcessSelectionQuery({
    id: processSelectionId!,
  });

  /* ────── mutations ────── */
  const [updateConvocationList] = useUpdateConvocationListMutation();
  const [generateSeats, generateSeatsStatus] = useGenerateSeatsMutation();
  const [generateApplications, generateApplicationsStatus] =
    useGenerateApplicationsMutation();
  const [allocateSeats, allocateSeatsStatus] = useAllocateSeatsMutation();
  const [publishConvocationList, publishStatus] =
    usePublishConvocationListMutation();

  /* ────── estado local ────── */
  const [convocationList, setConvocationList] = useState<ConvocationList>(
    {} as ConvocationList,
  );
  const [remapEditorOpen, setRemapEditorOpen] = useState(false);
  const [seatEditorOpen, setSeatEditorOpen] = useState(false);
  const [defaultVacancyPlan, setDefaultVacancyPlan] =
    useState<VacancyPlan>({});

  useEffect(() => {
    if (convocationListResponse?.data) {
      setConvocationList(convocationListResponse.data);
    }
  }, [convocationListResponse]);

  const admissionCategories: AdmissionCategory[] =
    processSelectionResponse?.data.admission_categories ?? [];

  /* ───────────── helpers ───────────── */
  const runServiceWithToast = async (
    service: (arg: any) => any,
    arg: object,
    successMessage: string,
  ) => {
    try {
      await service(arg).unwrap();
      enqueueSnackbar(successMessage, { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || 'Erro inesperado', {
        variant: 'error',
      });
    }
  };

  const handleSaveRemapRules = async (rules: RemapRules | null) => {
    await runServiceWithToast(
      updateConvocationList,
      { ...convocationList, remap_rules: rules },
      'Regras de remanejamento atualizadas',
    );
    setConvocationList((prev) => ({ ...prev, remap_rules: rules }));
  };

  const handleOpenSeatEditor = () => {
    const initialPlan: VacancyPlan = {};
    processSelectionResponse?.data.courses.forEach((course: Course) => {
      initialPlan[course.id!] = {
        name: course.name,
        vacancies: { ...course.vacanciesByCategory },
      };
    });
    setDefaultVacancyPlan(initialPlan);
    setSeatEditorOpen(true);
  };

  /* 👇🏻 AQUI enviamos seats já no formato exigido pela API */
  const handleSaveVacancyPlan = async (plan: VacancyPlan) => {
    setSeatEditorOpen(false);
    await runServiceWithToast(
      generateSeats,
      {
        id: convocationListId!,
        seats: vacancyPlanToSeats(plan),
      },
      'Vagas geradas com sucesso',
    );
  };

  if (isFetching) return <Typography>Carregando…</Typography>;

  /* ───────────────── UI ───────────────── */
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">{convocationList.name}</Typography>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {/* editar remanejamento */}
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => setRemapEditorOpen(true)}
            >
              Editar remanejamento
            </Button>
          </Grid>

          {/* criar vagas */}
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              disabled={generateSeatsStatus.isLoading}
              onClick={handleOpenSeatEditor}
            >
              Criar vagas
            </Button>
          </Grid>

          {/* gerar inscrições */}
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              disabled={generateApplicationsStatus.isLoading}
              onClick={() =>
                runServiceWithToast(
                  generateApplications,
                  { id: convocationListId! },
                  'Inscrições geradas',
                )
              }
            >
              Gerar inscrições
            </Button>
          </Grid>

          {/* processar distribuição */}
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              disabled={allocateSeatsStatus.isLoading}
              onClick={() =>
                runServiceWithToast(
                  allocateSeats,
                  { id: convocationListId! },
                  'Distribuição concluída',
                )
              }
            >
              Processar distribuição
            </Button>
          </Grid>

          {/* publicar lista */}
          {convocationList.status === 'draft' && (
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={publishStatus.isLoading}
                onClick={() =>
                  runServiceWithToast(
                    publishConvocationList,
                    { id: convocationListId! },
                    'Lista publicada',
                  )
                }
              >
                Publicar lista
              </Button>
            </Grid>
          )}

          {/* voltar */}
          <Grid item>
            <Button
              component={Link}
              to={`/process-selections/${processSelectionId}/convocation-lists`}
            >
              Voltar
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <ConvocationListSeatList />
      <ConvocationListApplicationList />
      {/* EDITORs */}
      <ChainsEditor
        open={remapEditorOpen}
        onClose={() => setRemapEditorOpen(false)}
        value={convocationList.remap_rules ?? null}
        categories={admissionCategories}
        onSave={handleSaveRemapRules}
      />

      <SeatEditor
        open={seatEditorOpen}
        onClose={() => setSeatEditorOpen(false)}
        defaultVacancyPlan={defaultVacancyPlan}
        onSave={handleSaveVacancyPlan}
      />
    </Box>
  );
};
