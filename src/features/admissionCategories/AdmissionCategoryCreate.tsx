import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { AdmissionCategory } from "../../types/AdmissionCategory";
import { useCreateAdmissionCategoryMutation } from "./admissionCategorySlice";
import { AdmissionCategoryForm } from "./components/AdmissionCategoryForm";

export const AdmissionCategoryCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createAdmissionCategory, status] = useCreateAdmissionCategoryMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [admissionCategoryState, setAdmissionCategoryState] = useState<AdmissionCategory>({
    name: "",
    description: ""
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createAdmissionCategory(admissionCategoryState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdmissionCategoryState({ ...admissionCategoryState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Modalidade de Admissão</Typography>
        </Box>
        <AdmissionCategoryForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          admissionCategory={admissionCategoryState}
          setAdmissionCategory={setAdmissionCategoryState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
