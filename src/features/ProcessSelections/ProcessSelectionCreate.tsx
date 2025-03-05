import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { ProcessSelection } from "../../types/ProcessSelection";
import { useCreateProcessSelectionMutation } from "./processSelectionSlice";
import { ProcessSelectionForm } from "./components/ProcessSelectionForm";

export const ProcessSelectionCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createProcessSelection, status] = useCreateProcessSelectionMutation();
  const [isDisabled, setIsDisabled] = useState(false);
  const [processSelectionState, setProcessSelectionState] = useState<ProcessSelection>({
    name: "",
    description: "",
    type: "sisu",
    status: "draft",
    start_date: "",
    end_date: ""
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createProcessSelection(processSelectionState).unwrap();
      enqueueSnackbar("Processo seletivo criado com sucesso", { variant: "success" });
      setIsDisabled(true);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao criar o processo seletivo";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProcessSelectionState({ ...processSelectionState, [name]: value });
  };

  const handleTypeChange = (_: any, newValue: { value: string; label: string } | null) => {
    setProcessSelectionState({ ...processSelectionState, type: newValue ? newValue.value : "sisu" });
  };

  const handleStatusChange = (_: any, newValue: { value: string; label: string } | null) => {
    setProcessSelectionState({ ...processSelectionState, status: newValue ? newValue.value : "draft" });
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Criar Processo Seletivo</Typography>
          </Box>
        </Box>
        <ProcessSelectionForm
          isLoading={status.isLoading}
          isdisabled={isDisabled}
          processSelection={processSelectionState}
          setProcessSelection={setProcessSelectionState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleTypeChange={handleTypeChange}
          handleStatusChange={handleStatusChange}
        />
      </Paper>
    </Box>
  );
};
