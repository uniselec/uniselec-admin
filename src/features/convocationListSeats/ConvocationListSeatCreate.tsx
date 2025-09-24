import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { ConvocationListSeat } from "../../types/ConvocationListSeat";
import { useCreateConvocationListSeatMutation } from "./convocationListSeatSlice";
import { ConvocationListSeatForm } from "./components/ConvocationListSeatForm";

export const ConvocationListSeatCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createConvocationListSeat, status] = useCreateConvocationListSeatMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [convocationListSeatState, setConvocationListSeatState] = useState<ConvocationListSeat>({} as ConvocationListSeat);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createConvocationListSeat(convocationListSeatState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConvocationListSeatState({ ...convocationListSeatState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Curso</Typography>
        </Box>
        <ConvocationListSeatForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          convocationListSeat={convocationListSeatState}
          setConvocationListSeat={setConvocationListSeatState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
