import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetConvocationListApplicationQuery, useUpdateConvocationListApplicationMutation } from "./convocationListApplicationSlice";
import { ConvocationListApplication } from "../../types/ConvocationListApplication";
import { ConvocationListApplicationForm } from "./components/ConvocationListApplicationForm";

export const ConvocationListApplicationEdit = () => {
  const id = useParams().id as string;
  const { data: convocationListApplicationData, isFetching } = useGetConvocationListApplicationQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateConvocationListApplication, status] = useUpdateConvocationListApplicationMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [convocationListApplicationState, setConvocationListApplicationState] = useState<ConvocationListApplication>({} as ConvocationListApplication);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateConvocationListApplication(convocationListApplicationState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConvocationListApplicationState({ ...convocationListApplicationState, [name]: value });
  };

  useEffect(() => {
    if (convocationListApplicationData) {
      setConvocationListApplicationState(convocationListApplicationData.data);
    }
  }, [convocationListApplicationData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Curso</Typography>
        </Box>
        <ConvocationListApplicationForm
          isLoading={status.isLoading}
          convocationListApplication={convocationListApplicationState}
          isdisabled={isFetching || isDisabled}
          setConvocationListApplication={setConvocationListApplicationState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
