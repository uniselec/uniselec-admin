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
} from './processSelectionSlice';
import { useGetCoursesQuery } from '../courses/courseSlice';
import { useGetConvocationListsQuery } from '../convocationLists/convocationListSlice';   // ← novo
import { DocumentList } from '../documents/DocumentList';
import useTranslate from '../polyglot/useTranslate';

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

  /* remover curso */
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

  /* loaders & 404 */
  if (fetchingProcess) return <Typography>Carregando…</Typography>;
  if (!processSelectionResult) {
    return <Typography>Processo Seletivo não encontrado.</Typography>;
  }

  const processSelection = processSelectionResult.data;

  /* ────────── UI ────────── */
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* ───── CARD · Detalhes ───── */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h4">{processSelection.name}</Typography>
            <Typography>{processSelection.description}</Typography>
            <Typography>
              Tipo:{' '}
              {processSelection.type === 'enem_score' ? 'Notas do Enem' : 'SISU'}
            </Typography>
            <Typography>Status: {translate(processSelection.status)}</Typography>
            <Typography>Início: {processSelection.start_date}</Typography>
            <Typography>Fim: {processSelection.end_date}</Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() =>
                navigate(`/process-selections/edit/${processSelection.id}`)
              }
            >
              Editar Processo Seletivo
            </Button>
          </Paper>
        </Grid>

        {/* ───── CARD · Listas de convocação ───── */}
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
                to={`/process-selections/${processSelection.id}/convocation-lists`}
                variant="outlined"
                color="secondary"
                sx={{ fontSize: '12px' }}
              >
                Listas de Convocação
              </Button>
              <Button
                component={Link}
                to={`/process-selections/${processSelection.id}/convocation-lists/create`}
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
                    to={`/process-selections/${processSelection.id}/convocation-lists/detail/${list.id}`}
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
