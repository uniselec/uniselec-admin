import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetConvocationListSeatQuery, useUpdateConvocationListSeatMutation } from "./convocationListSeatSlice";
import { ConvocationListSeat } from "../../types/ConvocationListSeat";
import { ConvocationListSeatForm } from "./components/ConvocationListSeatForm";

export const ConvocationListSeatEdit = () => {
  const id = useParams().id as string;
  const { data: convocationListSeatData, isFetching } = useGetConvocationListSeatQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateConvocationListSeat, status] = useUpdateConvocationListSeatMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [convocationListSeatState, setConvocationListSeatState] = useState<ConvocationListSeat>({} as ConvocationListSeat);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateConvocationListSeat(convocationListSeatState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConvocationListSeatState({ ...convocationListSeatState, [name]: value });
  };

  useEffect(() => {
    if (convocationListSeatData) {
      setConvocationListSeatState(convocationListSeatData.data);
    }
  }, [convocationListSeatData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Curso</Typography>
        </Box>
        <ConvocationListSeatForm
          isLoading={status.isLoading}
          convocationListSeat={convocationListSeatState}
          isdisabled={isFetching || isDisabled}
          setConvocationListSeat={setConvocationListSeatState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
