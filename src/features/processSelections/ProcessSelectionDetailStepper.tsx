import { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { ProcessSelectionDetails } from "./ProcessSelectionDetails";
import { EnemScoreImport } from "../enemScores/EnemScoreImport";
import { EnemScoreList } from "../enemScores/EnemScoreList";
import { ApplicationList } from "../applications/ApplicationList";
import { ApplicationCSVDownload } from "../applications/ApplicationCSVDownload";
import { GenerateApplicationOutcomes } from "../applicationOutcomes/GenerateApplicationOutcomes";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";

const steps = {
  sisu: [
    "Detalhes do Processo Seletivo",
    "Notas do SISU",
    "Processar Resultados",
  ],
  enem_scores: [
    "Detalhes do Processo Seletivo",
    "Visualizar Inscrições",
    "Exportar Inscrições",
    "Importar Notas",
    "Listar Notas",
    "Processar Resultados",
  ],
};

export const ProcessSelectionDetailStepper = () => {
  const { id } = useParams<{ id: string }>();
  const { data: processSelection, isLoading } = useGetProcessSelectionQuery({ id: id! });

  const processType = (processSelection?.data?.type as keyof typeof steps) || "sisu"; // Valor padrão "sisu" se não houver dados
  const stepLabels = steps[processType]; // Se o tipo for desconhecido, usa "sisu"

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  if (isLoading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!processSelection) {
    return <Typography>Processo Seletivo não encontrado.</Typography>;
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
    <Paper sx={{ p: 3, mb: 3, textAlign: "center" }}>
      <Typography variant="h4">Gerenciamento do Processo Seletivo</Typography>
    </Paper>

      <Stepper activeStep={activeStep} alternativeLabel>
        {stepLabels.map((label: string, index: number) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ p: 3, mt: 3, minHeight: 300 }}>
        {activeStep === 0 && <ProcessSelectionDetails />}
        {activeStep === 1 && processType === "sisu" && <EnemScoreImport />}
        {activeStep === 1 && processType === "enem_scores" && <ApplicationList />}
        {activeStep === 2 && processType === "enem_scores" && <ApplicationCSVDownload />}
        {activeStep === 3 && processType === "enem_scores" && <EnemScoreImport />}
        {activeStep === 4 && processType === "enem_scores" && <EnemScoreList />}
        {activeStep === 5 && processType === "enem_scores" && <GenerateApplicationOutcomes />}
        {activeStep === 2 && processType === "sisu" && <GenerateApplicationOutcomes />}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Voltar
        </Button>
        <Button disabled={activeStep === stepLabels.length - 1} onClick={handleNext}>
          Próximo
        </Button>
      </Box>
    </Box>
  );
};
