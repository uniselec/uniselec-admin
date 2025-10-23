// src/features/processSelections/ProcessSelectionDetails.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  useGetProcessSelectionQuery,
  useAttachCoursesMutation,
  useRemoveCourseFromProcessSelectionMutation,
  useUpdateProcessSelectionMutation,
} from './processSelectionSlice';
import { useGetCoursesQuery } from '../courses/courseSlice';
import { useGetConvocationListsQuery } from '../convocationLists/convocationListSlice';   // ← novo
import { DocumentList } from '../documents/DocumentList';
import useTranslate from '../polyglot/useTranslate';
import ChainsEditor from './components/ChainsEditor';
import { AdmissionCategory } from '../../types/AdmissionCategory';
import { ProcessSelection, RemapRules } from '../../types/ProcessSelection';
import { useSnackbar } from 'notistack';

export const ProcessSelectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: processSelectionResult,
    isFetching: fetchingProcess,
    refetch,
  } = useGetProcessSelectionQuery({ id: id! });

  const {
    data: convocationListsResult,
    isFetching: fetchingLists,
  } = useGetConvocationListsQuery({
    perPage: 100,
    processSelectionId: id!,
  } as any);

  const [attachedCourses, setAttachedCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [vacancy, setVacancy] = useState<number>(1);

  const [attachCourses] = useAttachCoursesMutation();
  const [removeCourse] = useRemoveCourseFromProcessSelectionMutation();
  const { data: coursesData } = useGetCoursesQuery({ perPage: 100 });

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState<string | null>(null);

  const translate = useTranslate('processSelection.status');

  useEffect(() => {
    if (processSelectionResult?.data) {
      const processSelectionData = processSelectionResult.data;
      const courses = processSelectionData.courses
        ? processSelectionData.courses.map((c: any) => ({
          ...c,
          vacancies: c.vacancies ?? (c.pivot ? c.pivot.vacancies : 0),
        }))
        : [];
      setAttachedCourses(courses);
    }
  }, [processSelectionResult]);

  /* adiciona curso */
  const handleAddCourse = async () => {
    if (!id) return;
    if (
      selectedCourse &&
      !attachedCourses.find((c) => c.id === selectedCourse.id)
    ) {
      const newCourses = [
        ...attachedCourses,
        { ...selectedCourse, vacancies: vacancy },
      ];
      try {
        await attachCourses({
          processSelectionId: id!,
          courses: newCourses,
        }).unwrap();
        setAttachedCourses(newCourses);
        refetch();
        setSelectedCourse(null);
        setVacancy(1);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const [updateProcessSelection] = useUpdateProcessSelectionMutation();
  const { enqueueSnackbar } = useSnackbar();
  const handleSaveRemapRules = async (rules: RemapRules | null) => {
    await runServiceWithToast(
      updateProcessSelection,
      { ...processSelectionState, remap_rules: rules },
      'Regras de remanejamento atualizadas',
    );
    setProcessSelectionState((prev) => ({ ...prev, remap_rules: rules }));
  };

  const handleRemoveCourse = (courseId: string) => {
    setCourseToRemove(courseId);
    setConfirmRemoveOpen(true);
  };
  const confirmRemoveCourse = async () => {
    if (!id || !courseToRemove) return;
    try {
      await removeCourse({
        process_selection_id: id!,
        course_id: courseToRemove,
      }).unwrap();
      setAttachedCourses((prev) => prev.filter((c) => c.id !== courseToRemove));
      refetch();
    } catch (error) {
      console.error(error);
    }
    setConfirmRemoveOpen(false);
    setCourseToRemove(null);
  };
  const processSelection = processSelectionResult?.data;
  const [remapEditorOpen, setRemapEditorOpen] = useState(false);
  const admissionCategories: AdmissionCategory[] = processSelectionResult?.data.admission_categories ?? [];
  const [processSelectionState, setProcessSelectionState] = useState<ProcessSelection>(
    { ...processSelectionResult?.data } as ProcessSelection,
  );
  useEffect(() => {
    if (processSelectionResult?.data) {
      setProcessSelectionState(processSelectionResult.data);
    }
  }, [processSelectionResult]);


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

  /* loaders & 404 */
  if (fetchingProcess) return <Typography>Carregando…</Typography>;
  if (!processSelectionResult) {
    return <Typography>Processo Seletivo não encontrado.</Typography>;
  }

  /* ────────── UI ────────── */
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* ───── CARD · Detalhes ───── */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4">{processSelectionState.name}</Typography>
            <Typography>{processSelectionState.description}</Typography>
            <Typography>
              Tipo:{' '}
              {processSelectionState.type === 'enem_score' ? 'Notas do Enem' : 'SISU'}
            </Typography>
            <Typography>Status: {translate(processSelectionState.status)}</Typography>
            <Typography>Início: {processSelectionState.start_date}</Typography>
            <Typography>Fim: {processSelectionState.end_date}</Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() =>
                navigate(`/process-selections/edit/${processSelectionState.id}`)
              }
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 2, mt: 2 }}
              onClick={() => setRemapEditorOpen(true)}
            >
              Remanejamento
            </Button>
            <ChainsEditor
              open={remapEditorOpen}
              onClose={() => setRemapEditorOpen(false)}
              value={processSelectionState.remap_rules ?? null}
              categories={admissionCategories}
              onSave={handleSaveRemapRules}
            />

          </Paper>
        </Grid>


        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Listas de Convocação
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <Button
                component={Link}
                to={`/process-selections/${processSelectionState.id}/convocation-lists`}
                variant="outlined"
                color="secondary"
                sx={{ fontSize: '12px' }}
              >
                Listas de Convocação
              </Button>
              <Button
                component={Link}
                to={`/process-selections/${processSelectionState.id}/convocation-lists/create`}
                variant="outlined"
                color="secondary"
                sx={{ fontSize: '12px' }}
              >
                Criar Lista de Convocação
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, mt: 2, overflowY: 'auto' }}>
              {fetchingLists && <CircularProgress size={24} />}
              {!fetchingLists &&
                convocationListsResult?.data.map((list) => (
                  <Typography
                    key={list.id}
                    component={Link}
                    to={`/process-selections/${processSelectionState.id}/convocation-lists/detail/${list.id}`}
                    sx={{
                      display: 'block',
                      color: 'primary.main',
                      textDecoration: 'none',
                      mb: 0.5,
                    }}
                  >
                    • {list.name}{' '}
                    {list.status === 'published'
                      ? `(publicada em ${new Date(
                        list.published_at!,
                      ).toLocaleDateString()})`
                      : `(rascunho)`}
                  </Typography>
                ))}
              {!fetchingLists && convocationListsResult?.data.length === 0 && (
                <Typography color="text.secondary">
                  Nenhuma lista cadastrada ainda.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* documentos vinculados */}
      <DocumentList processSelectionId={id!} />

      {/* dialogo remover curso */}
      <Dialog
        open={confirmRemoveOpen}
        onClose={() => setConfirmRemoveOpen(false)}
      >
        <DialogTitle>Remover Curso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover este curso?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)}>Cancelar</Button>
          <Button color="secondary" onClick={confirmRemoveCourse} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
