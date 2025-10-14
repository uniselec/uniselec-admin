import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProcessSelectionQuery, useUpdateProcessSelectionMutation } from "./processSelectionSlice";
import { ProcessSelection } from "../../types/ProcessSelection";
import { ProcessSelectionForm } from "./components/ProcessSelectionForm";

export const ProcessSelectionEdit = () => {
  const id = useParams().id as string;
  const { data: processSelectionData, isFetching } = useGetProcessSelectionQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateProcessSelection, status] = useUpdateProcessSelectionMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [processSelectionState, setProcessSelectionState] = useState<ProcessSelection>({
    name: "",
    description: "",
    type: "sisu",
    status: "draft",
    start_date: "",
    end_date: "",
    courses: []
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formatToSQL = (datetime: string) => {
      return datetime ? datetime.replace("T", " ").slice(0, 19) : ""; // Garante formato correto
    };


    const formattedData = {
      ...processSelectionState,
      start_date: formatToSQL(processSelectionState.start_date),
      end_date: formatToSQL(processSelectionState.end_date)
    };

    try {
      await updateProcessSelection(formattedData).unwrap();
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o processo seletivo";
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

  useEffect(() => {
    if (processSelectionData) {
      setProcessSelectionState({
        id: processSelectionData.data.id,
        name: processSelectionData.data.name,
        description: processSelectionData.data.description,
        start_date: processSelectionData.data.start_date,
        end_date: processSelectionData.data.end_date,
        preliminary_result_date: processSelectionData.data.preliminary_result_date,
        appeal_start_date: processSelectionData.data.appeal_start_date,
        appeal_end_date: processSelectionData.data.appeal_end_date,
        final_result_date: processSelectionData.data.final_result_date,
        type: processSelectionData.data.type,
        status: processSelectionData.data.status,
        courses: processSelectionData.data.courses || [],
        admission_categories: processSelectionData.data.admission_categories || [],
        knowledge_areas: processSelectionData.data.knowledge_areas || [],
        bonus_options: processSelectionData.data.bonus_options || [],
        created_at: processSelectionData.data.created_at,
        updated_at: processSelectionData.data.updated_at
      });
    }
  }, [processSelectionData]);


  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Editar Processo Seletivo</Typography>
          </Box>
        </Box>
        <ProcessSelectionForm
          isLoading={status.isLoading}
          processSelection={processSelectionState}
          isdisabled={isFetching || isDisabled}
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
