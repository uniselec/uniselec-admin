import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetBonusOptionQuery, useUpdateBonusOptionMutation } from "./bonusOptionSlice";
import { BonusOption } from "../../types/BonusOption";
import { BonusOptionForm } from "./components/BonusOptionForm";

export const BonusOptionEdit = () => {
  const id = useParams().id as string;
  const { data: bonusOptionData, isFetching } = useGetBonusOptionQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateBonusOption, status] = useUpdateBonusOptionMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [bonusOptionState, setBonusOptionState] = useState<BonusOption>({} as BonusOption);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateBonusOption(bonusOptionState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBonusOptionState({ ...bonusOptionState, [name]: value });
  };

  useEffect(() => {
    if (bonusOptionData) {
      setBonusOptionState(bonusOptionData.data);
    }
  }, [bonusOptionData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Modalidade de Admissão</Typography>
        </Box>
        <BonusOptionForm
          isLoading={status.isLoading}
          bonusOption={bonusOptionState}
          isdisabled={isFetching || isDisabled}
          setBonusOption={setBonusOptionState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
