import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetApplicationQuery, useUpdateApplicationMutation } from "./applicationSlice";
import { Application } from "../../types/Application";
import { ApplicationCard } from "./components/ApplicationCard";

export const ApplicationDetail = () => {
  const id = useParams().id as string;
  const { data: applicationData, isFetching } = useGetApplicationQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateApplication, status] = useUpdateApplicationMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [applicationState, setApplicationState] = useState<Application>({} as Application);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateApplication(applicationState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationState({ ...applicationState, [name]: value });
  };

  useEffect(() => {
    if (applicationData) {
      setApplicationState(applicationData.data);
    }
  }, [applicationData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Detalhes da Inscrição</Typography>
        </Box>
        <ApplicationCard
          isLoading={status.isLoading}
          application={applicationState}
        />
      </Paper>
    </Box>
  );
};
