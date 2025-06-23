import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetApplicationOutcomeQuery, useUpdateApplicationOutcomeMutation } from "./applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import { ApplicationOutcomeCard } from "./components/ApplicationOutcomeCard";

export const ApplicationOutcomeDetail = () => {
  const id = useParams().id as string;
  const { data: applicationOutcomeData, isFetching } = useGetApplicationOutcomeQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateApplicationOutcome, status] = useUpdateApplicationOutcomeMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [applicationOutcomeState, setApplicationOutcomeState] = useState<ApplicationOutcome>({} as ApplicationOutcome);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateApplicationOutcome(applicationOutcomeState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationOutcomeState({ ...applicationOutcomeState, [name]: value });
  };

  useEffect(() => {
    if (applicationOutcomeData) {
      setApplicationOutcomeState(applicationOutcomeData.data);
    }
  }, [applicationOutcomeData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Detalhes da Inscrição</Typography>
        </Box>
        <ApplicationOutcomeCard
          isLoading={status.isLoading}
          applicationOutcome={applicationOutcomeState}
        />
      </Paper>
    </Box>
  );
};
