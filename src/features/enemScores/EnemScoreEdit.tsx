import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetEnemScoreQuery,
  useUpdateEnemScoreMutation,
} from "./enemScoreSlice";
import { EnemScore } from "../../types/EnemScore";
import { EnemScoreForm } from "./components/EnemScoreForm";

export const EnemScoreEdit = () => {
  const id = useParams().id as string;
  const { data: enemScore, isFetching } = useGetEnemScoreQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateEnemScore, status] = useUpdateEnemScoreMutation();
  const [enemScoreState, setEnemScoreState] = useState<EnemScore>({} as EnemScore);

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateEnemScore(enemScoreState);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEnemScoreState({ ...enemScoreState, [name]: value });
  };


  useEffect(() => {
    if (enemScore) {
      setEnemScoreState(enemScore.data);
    }
  }, [enemScore]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("EnemScore updated successfully", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("EnemScore not updated", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Edit EnemScore</Typography>
          </Box>
        </Box>
        <EnemScoreForm
          isLoading={false}
          enemScore={enemScoreState}
          isdisabled={isFetching || isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};