import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAdmissionCategoryQuery, useUpdateAdmissionCategoryMutation } from "./admissionCategorySlice";
import { AdmissionCategory } from "../../types/AdmissionCategory";
import { AdmissionCategoryForm } from "./components/AdmissionCategoryForm";

export const AdmissionCategoryEdit = () => {
  const id = useParams().id as string;
  const { data: admissionCategoryData, isFetching } = useGetAdmissionCategoryQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateAdmissionCategory, status] = useUpdateAdmissionCategoryMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [admissionCategoryState, setAdmissionCategoryState] = useState<AdmissionCategory>({} as AdmissionCategory);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateAdmissionCategory(admissionCategoryState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdmissionCategoryState({ ...admissionCategoryState, [name]: value });
  };

  useEffect(() => {
    if (admissionCategoryData) {
      setAdmissionCategoryState(admissionCategoryData.data);
    }
  }, [admissionCategoryData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Modalidade de Admissão</Typography>
        </Box>
        <AdmissionCategoryForm
          isLoading={status.isLoading}
          admissionCategory={admissionCategoryState}
          isdisabled={isFetching || isDisabled}
          setAdmissionCategory={setAdmissionCategoryState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
