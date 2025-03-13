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

  return (
    <Box sx={{ mt: 4, mb: 4 }}>

      {/* 🚀 Novo Card com Ações */}
      <Paper sx={{ p: 3, mb: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        {/* <Button variant="contained" onClick={() => navigate(`/applications`)}>
          Inscrições
        </Button> */}
        {/* <Button variant="contained" color="success"  onClick={() => navigate(`/export-csv`)}>
          Exportar Inscrições
        </Button> */}
        <Button variant="contained" color="warning" onClick={() => navigate(`/import-enem-score`)}>
          Importar Notas
        </Button>
        <Button variant="contained" color="info" onClick={() => navigate(`/enem-scores`)}>
          Notas do Enem
        </Button>
        <Button variant="contained" color="error" onClick={() => navigate(`/generate-results`)}>
          Processar Resultados
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4">{processSelection.data.name}</Typography>
        <Typography>{processSelection.data.description}</Typography>
        <Typography>Tipo: {processSelection.data.type}</Typography>
        <Typography>Status: {processSelection.data.status}</Typography>
        <Typography>Início: {processSelection.data.start_date}</Typography>
        <Typography>Fim: {processSelection.data.end_date}</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate(`/process-selections/edit/${id!}`)}>
          Editar Processo Seletivo
        </Button>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5">Cursos Vinculados</Typography>
        {attachedCourses.length > 0
          ? attachedCourses.map((course) => (
            <Box key={course.id} sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
              <Typography>
                {course.name} - {course.campus} ({course.state}) (Vagas: {course.vacancies})
              </Typography>
              <Button variant="outlined" color="secondary" onClick={() => handleRemoveCourse(course.id)}>
                Remover
              </Button>
            </Box>
          ))
          : <Typography>Nenhum curso vinculado.</Typography>}
        <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Autocomplete
            sx={{ minWidth: 300 }}
            options={coursesData ? coursesData.data : []}
            getOptionLabel={(option: any) => option.name}
            value={selectedCourse}
            onChange={(_, newValue) => setSelectedCourse(newValue)}
            renderInput={(params) => <TextField {...params} label="Selecionar Curso" variant="outlined" />}
          />
          <TextField
            type="number"
            label="Vagas"
            value={vacancy}
            onChange={(e) => setVacancy(Number(e.target.value))}
            sx={{ width: 100 }}
            inputProps={{ min: 1 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddCourse}>
            Adicionar Curso
          </Button>
        </Box>
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
