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
import { useUpdateApplicationMutation } from "../applications/applicationSlice";
import { ResolvedInconsistencies } from "../../types/Application";

export const ApplicationOutcomeEdit = () => {
  const id = useParams().id as string;
  const { data: applicationOutcome, isFetching } = useGetApplicationOutcomeQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateApplicationOutcome, status] = useUpdateApplicationOutcomeMutation();
  const [applicationOutcomeState, setApplicationOutcomeState] = useState<ApplicationOutcome>({} as ApplicationOutcome);
  const [updateApplication, applicationRequestStatus] = useUpdateApplicationMutation();
  const [resolvedInconsistencies, setResolvedInconsistencies] = useState<ResolvedInconsistencies>(
    {
      id: undefined,
      name_source: "",
      birthdate_source: "",
      cpf_source: ""
    }
  );

  const { enqueueSnackbar } = useSnackbar();

  const handleSolutionsInconsistencies = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResolvedInconsistencies((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (applicationOutcomeState.application?.id) {
        await updateApplication({
          ...applicationOutcomeState.application,
          name_source: resolvedInconsistencies.name_source ?? null,
          birthdate_source: resolvedInconsistencies.birthdate_source ?? null,
          cpf_source: resolvedInconsistencies.cpf_source ?? null
        }).unwrap();

        enqueueSnackbar("Application updated successfully", { variant: "success" });
      } else {
        console.error("ID não encontrado no application");
      }

      if (applicationOutcomeState.id) {
        await updateApplicationOutcome(applicationOutcomeState).unwrap();
        enqueueSnackbar("ApplicationOutcome updated successfully", { variant: "success" });
        setIsdisabled(false);
      } else {
        console.error("ID não encontrado no applicationOutcomeState");
      }
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message || "Erro ao atualizar", { variant: "error" });
      setIsdisabled(false);
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
      setResolvedInconsistencies({
        id: applicationOutcome?.data?.application?.id,
        name_source: applicationOutcome?.data?.application?.name_source,
        birthdate_source: applicationOutcome?.data?.application?.birthdate_source,
        cpf_source: applicationOutcome?.data?.application?.cpf_source
      });
    }

  }, [applicationOutcome]);

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
          handleSolutionsInconsistencies={handleSolutionsInconsistencies}
          resolvedInconsistencies={resolvedInconsistencies}
          applicationRequestIsLoading={applicationRequestStatus.isLoading}
        />
      </Paper>
    </Box>
  );
};
