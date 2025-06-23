import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetEnemScoreQuery, useUpdateEnemScoreMutation } from "./enemScoreSlice";
import { EnemScore } from "../../types/EnemScore";
import { EnemScoreCard } from "./components/EnemScoreCard";

export const EnemScoreDetail = () => {
  const id = useParams().id as string;
  const { data: enemScoreData, isFetching } = useGetEnemScoreQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateEnemScore, status] = useUpdateEnemScoreMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [enemScoreState, setEnemScoreState] = useState<EnemScore>({} as EnemScore);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateEnemScore(enemScoreState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEnemScoreState({ ...enemScoreState, [name]: value });
  };

  useEffect(() => {
    if (enemScoreData) {
      setEnemScoreState(enemScoreData.data);
    }
  }, [enemScoreData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Detalhes da Inscrição</Typography>
        </Box>
        <EnemScoreCard
          isLoading={status.isLoading}
          enemScore={enemScoreState}
        />
      </Paper>
    </Box>
  );
};
