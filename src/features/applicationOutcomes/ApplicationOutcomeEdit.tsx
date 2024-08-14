import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetApplicationOutcomeQuery,
  useUpdateApplicationOutcomeMutation,
} from "./applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import { ApplicationOutcomeForm } from "./components/ApplicationOutcomeForm";

export const ApplicationOutcomeEdit = () => {
  const id = useParams().id as string;
  const { data: applicationOutcome, isFetching } = useGetApplicationOutcomeQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateApplicationOutcome, status] = useUpdateApplicationOutcomeMutation();
  const [applicationOutcomeState, setApplicationOutcomeState] = useState<ApplicationOutcome>({} as ApplicationOutcome);

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (applicationOutcomeState.id) {
        await updateApplicationOutcome(applicationOutcomeState);
    } else {
        console.error("ID não encontrado no applicationOutcomeState");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicationOutcomeState({ ...applicationOutcomeState, [name]: value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setApplicationOutcomeState({ ...applicationOutcomeState, status: value });
  };

  useEffect(() => {
    if (applicationOutcome) {
      setApplicationOutcomeState(applicationOutcome.data);
    }
  }, [applicationOutcome]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("ApplicationOutcome updated successfully", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("ApplicationOutcome not updated", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Resultado</Typography>
          </Box>
        </Box>
        <ApplicationOutcomeForm
          isLoading={isFetching || status.isLoading}
          applicationOutcome={applicationOutcomeState}
          isdisabled={isFetching || isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleStatusChange={handleStatusChange}
        />
      </Paper>
    </Box>
  );
};
