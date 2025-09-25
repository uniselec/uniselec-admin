import { useState, useEffect } from "react";
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
  Grid
} from "@mui/material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetProcessSelectionQuery, useAttachCoursesMutation, useRemoveCourseFromProcessSelectionMutation } from "./processSelectionSlice";
import { useGetCoursesQuery } from "../courses/courseSlice";
import { DocumentList } from "../documents/DocumentList";
import useTranslate from "../polyglot/useTranslate";

export const ProcessSelectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: processSelection, isFetching, refetch } = useGetProcessSelectionQuery({ id: id! });
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
    if (processSelection && processSelection.data) {
      const psData = processSelection.data;
      const courses = psData.courses
        ? psData.courses.map((c: any) => ({
          ...c,
          vacancies: c.vacancies ?? (c.pivot ? c.pivot.vacancies : 0)
        }))
        : [];
      setAttachedCourses(courses);
    }
  }, [processSelection]);

  const handleAddCourse = async () => {
    if (!id) return;
    if (selectedCourse && !attachedCourses.find((c) => c.id === selectedCourse.id)) {
      const newCourses = [...attachedCourses, { ...selectedCourse, vacancies: vacancy }];
      try {
        await attachCourses({ processSelectionId: id!, courses: newCourses }).unwrap();
        setAttachedCourses(newCourses);
        refetch();
        setSelectedCourse(null);
        setVacancy(1);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemoveCourse = (courseId: string) => {
    setCourseToRemove(courseId);
    setConfirmRemoveOpen(true);
  };

  const confirmRemoveCourse = async () => {
    if (!id || !courseToRemove) return;
    try {
      await removeCourse({ process_selection_id: id!, course_id: courseToRemove }).unwrap();
      const newCourses = attachedCourses.filter((c) => c.id !== courseToRemove);
      setAttachedCourses(newCourses);
      refetch();
    } catch (error) {
      console.error(error);
    }
    setConfirmRemoveOpen(false);
    setCourseToRemove(null);
  };

  if (isFetching) return <Typography>Carregando...</Typography>;
  if (!processSelection) return <Typography>Processo Seletivo não encontrado.</Typography>;

  const processType = processSelection.data.type;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* CARD · Detalhes do processo seletivo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h4">{processSelection.data.name}</Typography>
            <Typography>{processSelection.data.description}</Typography>
            <Typography>
              Tipo: {processSelection.data.type === "enem_score" ? "Notas do Enem" : "SISU"}
            </Typography>
            <Typography>Status: {translate(processSelection.data.status)}</Typography>
            <Typography>Início: {processSelection.data.start_date}</Typography>
            <Typography>Fim: {processSelection.data.end_date}</Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate(`/process-selections/edit/${id!}`)}
            >
              Editar Processo Seletivo
            </Button>
          </Paper>
        </Grid>

        {/* CARD · Listas de convocação */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
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
                to={`/process-selections/${processSelection.data.id}/convocation-lists`}
                variant="outlined"
                color="secondary"
                sx={{ fontSize: '12px' }}
              >
                Listas de Convocação
              </Button>
              <Button
                component={Link}
                to={`/process-selections/${processSelection.data.id}/convocation-lists/create`}
                variant="outlined"
                color="secondary"
                sx={{ fontSize: '12px' }}
              >
                Criar Lista de Convocação
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
              <Typography>- 1ª Convocação (publicada em 08/09/2025)</Typography>
              <Typography>- 2ª Convocação (rascunho)</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>


      <DocumentList processSelectionId={id!} />

      <Dialog open={confirmRemoveOpen} onClose={() => setConfirmRemoveOpen(false)}>
        <DialogTitle>Remover Curso</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza que deseja remover este curso?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemoveOpen(false)} color="primary">Cancelar</Button>
          <Button onClick={confirmRemoveCourse} color="secondary" autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
