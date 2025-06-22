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
import { ApplicationList } from "../applications_bkp/ApplicationList";
import { ApplicationCSVDownload } from "../applications_bkp/ApplicationCSVDownload";
import { GenerateApplicationOutcomes } from "../applicationOutcomes/GenerateApplicationOutcomes";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";
import { CardAdvise } from "./components/CardAdvise";

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

  // Sempre chamar os Hooks no topo, antes de qualquer retorno condicional.
  const [activeStep, setActiveStep] = useState<number>(0);

  // Agora, condicione a renderização após todos os Hooks terem sido chamados.
  if (isLoading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!processSelection) {
    return <Typography>Processo Seletivo não encontrado.</Typography>;
  }

  const processType = (processSelection.data.type as keyof typeof steps) || "sisu";
  const stepLabels = steps[processType] ?? steps["sisu"];

  // Se o tipo não for suportado (por exemplo, não houver steps definidos), exibe um aviso
  if (!stepLabels || stepLabels.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h5">
          O sistema ainda não suporta este tipo de Seleção
        </Typography>
      </Paper>
    );
  }

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Voltar
        </Button>
        <Button disabled={activeStep === stepLabels.length - 1} onClick={handleNext}>
          Próximo
        </Button>
      </Box>
      <Box sx={{ p: 3, mt: 3, minHeight: 300 }}>
        {activeStep === 0 && <ProcessSelectionDetails />}
        {activeStep != 0 && <CardAdvise/>}
        {/* {activeStep === 1 && processType === "sisu" && <EnemScoreImport />}
        {activeStep === 1 && processType === "enem_scores" && <ApplicationList />}
        {activeStep === 2 && processType === "enem_scores" && <ApplicationCSVDownload />}
        {activeStep === 3 && processType === "enem_scores" && <EnemScoreImport />}
        {activeStep === 4 && processType === "enem_scores" && <EnemScoreList />}
        {activeStep === 5 && processType === "enem_scores" && <GenerateApplicationOutcomes />}
        {activeStep === 2 && processType === "sisu" && <GenerateApplicationOutcomes />} */}
      </Box>


    </Box>
  );
};
