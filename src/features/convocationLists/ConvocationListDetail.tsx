import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Autocomplete,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

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
import { useGetConvocationListApplicationsQuery } from './convocationListApplicationSlice';
import { ConvocationListApplicationTable } from './components/ConvocationListApplicationTable';
import { ConvocationListSeatTable } from './components/ConvocationListSeatTable';
import { useGetConvocationListSeatsQuery } from './convocationListSeatSlice';

/* ────────────────────────────────────────────────────────────── */
/* utilitário: converte o VacancyPlan no formato aceito pelo back */
const vacancyPlanToSeats = (plan: VacancyPlan) =>
  Object.entries(plan).map(([courseId, { vacancies }]) => ({
    course_id: Number(courseId),
    vacanciesByCategory: vacancies,
  }));

/* ────────────────────────────────────────────────────────────── */
export const ConvocationListDetail = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const qs = new URLSearchParams(search);
  const admissionCategoryId = qs.get("admission_category_id") ?? "";
  const courseId = qs.get("course_id") ?? "";


  const { id: processSelectionId, convocationListId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  /* ────── dados remotos ────── */
  const { data: convocationListResponse, isFetching } =
    useGetConvocationListQuery({ id: convocationListId! });

  const { data: processSelectionResponse, isFetching: fetchingOut,
    error: outError
  } = useGetProcessSelectionQuery({
    id: processSelectionId!,
  });

  const [updateConvocationList] = useUpdateConvocationListMutation();
  const [generateSeats, generateSeatsStatus] = useGenerateSeatsMutation();
  const [generateApplications, generateApplicationsStatus] = useGenerateApplicationsMutation();
  const [allocateSeats, allocateSeatsStatus] = useAllocateSeatsMutation();
  const [publishConvocationList, publishStatus] = usePublishConvocationListMutation();
  const hasAllParams =
    !!processSelectionId && !!courseId;

  const { data: dataApplication, isFetching: isFetchingApplication, error: errorApplication } = useGetConvocationListApplicationsQuery(
    hasAllParams
      ? {
        fixedCacheKey: "convocationList",
        page: 1,
        perPage: 5000,
        filters: {
          convocation_list_id: convocationListId,
          admission_category_id: admissionCategoryId,
          course_id: courseId,
        },
      }
      : // não faz consulta se não deve
      { skip: true } as any);


  const { data: dataSeats, isFetching: isFetchingSeats, error: errorSeats } = useGetConvocationListSeatsQuery(
    hasAllParams
      ? {
        fixedCacheKey: "convocationList",
        page: 1,
        perPage: 5000,
        filters: {
          convocation_list_id: convocationListId,
          admission_category_id: admissionCategoryId,
          course_id: courseId,
        },
      }
      : // não faz consulta se não deve
      { skip: true } as any);

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

  if (isFetchingSeats) return <Typography>Carregando…</Typography>;
  if (!processSelectionResponse) return null;

  const categories = processSelectionResponse.data.admission_categories ?? [];
  const courses = processSelectionResponse.data.courses ?? [];
  const updateParam = (key: string, value?: string | number) => {
    const next = new URLSearchParams(search);
    if (!value) next.delete(key);
    else next.set(key, String(value));
    navigate({ search: `?${next.toString()}` }, { replace: true });
  };
  const selectedCategory = categories.find(c => c.id === Number(admissionCategoryId));
  const selectedCourse = courses.find(c => c.id === Number(courseId));




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
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Vagas e Inscrições</Typography>
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
        </Paper>

      </Box>
      {!hasAllParams ? (
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
        selectedCourse && (
          <>
            <Box sx={{ mt: 4, mb: 4 }}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Vagas
                </Typography>

              </Paper>
              <ConvocationListSeatTable
                convocationListSeats={dataSeats}
                isFetching={isFetchingSeats}
              />
            </Box>
            <Box sx={{ mt: 4, mb: 4 }}>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="h4" gutterBottom>
                  Inscrições em Listas de Convocação
                </Typography>
              </Paper>
              <ConvocationListApplicationTable
                convocationListApplications={dataApplication}
                isFetching={isFetchingApplication}
              />
            </Box>
          </>
        )
      )}

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
