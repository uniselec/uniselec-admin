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
import { useParams, useNavigate } from "react-router-dom";
import { useGetProcessSelectionQuery, useAttachCoursesMutation, useRemoveCourseFromProcessSelectionMutation } from "./processSelectionSlice";
import { useGetCoursesQuery } from "../courses/courseSlice";
import { DocumentList } from "../documents/DocumentList";

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
      {/* 🚀 Novo Card com Ações */}
      {/* <Paper sx={{ p: 3, mb: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        {processType === "sisu" ? (
          <>
            <Button variant="contained" color="warning" onClick={() => navigate(`/${id}/import-enem-score/`)}>
              Notas do SISU
            </Button>
            <Button variant="contained" color="error" onClick={() => navigate(`/${id}/generate-results/`)}>
              Processar Resultados
            </Button>
          </>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={() => navigate(`/${id}/applications/`)}>
              Visualizar Inscrições
            </Button>
            <Button variant="contained" color="success" onClick={() => navigate(`/${id}/export-csv/`)}>
              Exportar Inscrições
            </Button>
            <Button variant="contained" color="warning" onClick={() => navigate(`/${id}/import-enem-score/`)}>
              Importar Notas
            </Button>
            <Button variant="contained" color="info" onClick={() => navigate(`/${id}/enem-scores/`)}>
              Listar Notas do Enem
            </Button>
            <Button variant="contained" color="error" onClick={() => navigate(`/${id}/generate-results/`)}>
              Processar Resultados
            </Button>
          </>
        )}
      </Paper> */}

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4">{processSelection.data.name}</Typography>
        <Typography>{processSelection.data.description}</Typography>
        <Typography>Tipo: {processSelection.data.type === 'enem_score' ? 'Notas do Enem' : 'SISU'}</Typography>
        <Typography>Status: {processSelection.data.status}</Typography>
        <Typography>Início: {processSelection.data.start_date}</Typography>
        <Typography>Fim: {processSelection.data.end_date}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate(`/process-selections/edit/${id!}`)}>
          Editar Processo Seletivo
        </Button>
      </Paper>



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
