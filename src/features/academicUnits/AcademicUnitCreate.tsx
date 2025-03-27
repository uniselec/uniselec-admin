import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { AcademicUnit } from "../../types/AcademicUnit";
import { useCreateAcademicUnitMutation } from "./academicUnitSlice";
import { AcademicUnitForm } from "./components/AcademicUnitForm";

export const AcademicUnitCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createAcademicUnit, status] = useCreateAcademicUnitMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [academicUnitState, setAcademicUnitState] = useState<AcademicUnit>({
    name: "",
    description: "",
    state: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createAcademicUnit(academicUnitState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAcademicUnitState({ ...academicUnitState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Curso</Typography>
        </Box>
        <AcademicUnitForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          academicUnit={academicUnitState}
          setAcademicUnit={setAcademicUnitState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
