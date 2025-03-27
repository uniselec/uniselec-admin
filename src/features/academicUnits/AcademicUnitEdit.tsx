import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetCourseQuery, useUpdateCourseMutation } from "./courseSlice";
import { Course } from "../../types/Course";
import { CourseForm } from "./components/CourseForm";

export const CourseEdit = () => {
  const id = useParams().id as string;
  const { data: courseData, isFetching } = useGetCourseQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateCourse, status] = useUpdateCourseMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [courseState, setCourseState] = useState<Course>({} as Course);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateCourse(courseState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseState({ ...courseState, [name]: value });
  };

  useEffect(() => {
    if (courseData) {
      setCourseState(courseData.data);
    }
  }, [courseData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Curso</Typography>
        </Box>
        <CourseForm
          isLoading={status.isLoading}
          course={courseState}
          isdisabled={isFetching || isDisabled}
          setCourse={setCourseState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
