import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { EnemScore } from "../../types/EnemScore";
import { useCreateEnemScoreMutation } from "./enemScoreSlice";
import { EnemScoreForm } from "./components/EnemScoreForm";

export const EnemScoreCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createEnemScore, status] = useCreateEnemScoreMutation();
  const [isdisabled, setIsdisabled] = useState(false);
  const [enemScoreState, setEnemScoreState] = useState<EnemScore>({} as EnemScore);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createEnemScore(enemScoreState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnemScoreState({ ...enemScoreState, [name]: value });
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEnemScoreState({ ...enemScoreState, [name]: checked });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("EnemScore created successfully", { variant: "success" });
      setIsdisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("EnemScore not created", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Create EnemScore</Typography>
          </Box>
        </Box>
        <EnemScoreForm
          isLoading={false}
          isdisabled={isdisabled}
          enemScore={enemScoreState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};