import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { BonusOption } from "../../types/BonusOption";
import { useCreateBonusOptionMutation } from "./bonusOptionSlice";
import { BonusOptionForm } from "./components/BonusOptionForm";

export const BonusOptionCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createBonusOption, status] = useCreateBonusOptionMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [bonusOptionState, setBonusOptionState] = useState<BonusOption>({
    name: "",
    description: ""
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createBonusOption(bonusOptionState).unwrap();
      enqueueSnackbar("Curso criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBonusOptionState({ ...bonusOptionState, [name]: value });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Criar Modalidade de Admissão</Typography>
        </Box>
        <BonusOptionForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          bonusOption={bonusOptionState}
          setBonusOption={setBonusOptionState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
