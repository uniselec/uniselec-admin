import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Course } from "../../types/Course";
import { useCreateCourseMutation } from "./courseSlice";
import { CourseForm } from "./components/CourseForm";

export const CourseCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createCourse, status] = useCreateCourseMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [courseState, setCourseState] = useState<Course>({
    name: "",
    modality: "",
    campus: "",
    state: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createCourse(courseState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseState({ ...courseState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Curso</Typography>
        </Box>
        <CourseForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          course={courseState}
          setCourse={setCourseState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
