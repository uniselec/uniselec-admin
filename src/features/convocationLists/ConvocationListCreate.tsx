import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { ConvocationList } from "../../types/ConvocationList";
import { useCreateConvocationListMutation } from "./convocationListSlice";
import { ConvocationListForm } from "./components/ConvocationListForm";

export const ConvocationListCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createConvocationList, status] = useCreateConvocationListMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [convocationListState, setConvocationListState] = useState<ConvocationList>({} as ConvocationList);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createConvocationList(convocationListState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConvocationListState({ ...convocationListState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Curso</Typography>
        </Box>
        <ConvocationListForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          convocationList={convocationListState}
          setConvocationList={setConvocationListState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
