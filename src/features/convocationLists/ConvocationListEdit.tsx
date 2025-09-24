import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetConvocationListQuery, useUpdateConvocationListMutation } from "./convocationListSlice";
import { ConvocationList } from "../../types/ConvocationList";
import { ConvocationListForm } from "./components/ConvocationListForm";

export const ConvocationListEdit = () => {
  const id = useParams().id as string;
  const { data: convocationListData, isFetching } = useGetConvocationListQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateConvocationList, status] = useUpdateConvocationListMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [convocationListState, setConvocationListState] = useState<ConvocationList>({} as ConvocationList);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateConvocationList(convocationListState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConvocationListState({ ...convocationListState, [name]: value });
  };

  useEffect(() => {
    if (convocationListData) {
      setConvocationListState(convocationListData.data);
    }
  }, [convocationListData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Curso</Typography>
        </Box>
        <ConvocationListForm
          isLoading={status.isLoading}
          convocationList={convocationListState}
          isdisabled={isFetching || isDisabled}
          setConvocationList={setConvocationListState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
