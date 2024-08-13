import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetEnemScoreQuery, useUpdateEnemScoreMutation } from "./enemScoreSlice";
import { EnemScore } from "../../types/EnemScore";
import { EnemScoreCard } from "./components/EnemScoreCard";

export const EnemScoreSelected = () => {
  const id = useParams().id as string;
  const { data: enemScore, isFetching } = useGetEnemScoreQuery({ id });
  const [updateEnemScore, status] = useUpdateEnemScoreMutation();
  const [enemScoreState, setEnemScoreState] = useState<EnemScore>({} as EnemScore);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (enemScore) {
      setEnemScoreState(enemScore.data);
    }
  }, [enemScore]);

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("EnemScore updated successfully", { variant: "success" });
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
            <Typography variant="h4">Pontuação do ENEM</Typography>
          </Box>
        </Box>
        <EnemScoreCard enemScore={enemScoreState} isLoading={isFetching} />
      </Paper>
    </Box>
  );
};
