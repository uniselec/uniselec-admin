import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { ConvocationListApplication } from "../../types/ConvocationListApplication";
import { useCreateConvocationListApplicationMutation } from "./convocationListApplicationSlice";
import { ConvocationListApplicationForm } from "./components/ConvocationListApplicationForm";

export const ConvocationListApplicationCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createConvocationListApplication, status] = useCreateConvocationListApplicationMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [convocationListApplicationState, setConvocationListApplicationState] = useState<ConvocationListApplication>({} as ConvocationListApplication);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createConvocationListApplication(convocationListApplicationState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConvocationListApplicationState({ ...convocationListApplicationState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Curso</Typography>
        </Box>
        <ConvocationListApplicationForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          convocationListApplication={convocationListApplicationState}
          setConvocationListApplication={setConvocationListApplicationState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
