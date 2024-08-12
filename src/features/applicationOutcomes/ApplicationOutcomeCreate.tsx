import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import { useCreateApplicationOutcomeMutation } from "./applicationOutcomeSlice";
import { ApplicationOutcomeForm } from "./components/ApplicationOutcomeForm";

export const ApplicationOutcomeCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createApplicationOutcome, status] = useCreateApplicationOutcomeMutation();
  const [isdisabled, setIsdisabled] = useState(false);
  const [applicationOutcomeState, setApplicationOutcomeState] = useState<ApplicationOutcome>({} as ApplicationOutcome);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createApplicationOutcome(applicationOutcomeState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApplicationOutcomeState({ ...applicationOutcomeState, [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setApplicationOutcomeState({ ...applicationOutcomeState, [name]: checked });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("ApplicationOutcome created successfully", { variant: "success" });
      setIsdisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("ApplicationOutcome not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create ApplicationOutcome</Typography>
          </Box>
        </Box>
        <ApplicationOutcomeForm
          isLoading={false}
          isdisabled={isdisabled}
          applicationOutcome={applicationOutcomeState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};