import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { ConvocationList } from "../../types/ConvocationList";
import { useCreateConvocationListMutation } from "./convocationListSlice";
import { ConvocationListForm } from "./components/ConvocationListForm";
import { useNavigate, useParams } from "react-router-dom";

export const ConvocationListCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id: processSelectionId } = useParams<{ id: string }>();
  const [createConvocationList, status] = useCreateConvocationListMutation();
  const [isDisabled, setIsDisabled] = useState(false);


  const [convocationListState, setConvocationListState] = useState<ConvocationList>({
    process_selection_id: processSelectionId!
  } as ConvocationList);


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const dataResponse = await createConvocationList(convocationListState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
      navigate(`/process-selections/${processSelectionId}/convocation-lists/detail/${dataResponse?.data?.id}`);
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
          <Typography variant="h4">Criar Lista de Convocação</Typography>
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
