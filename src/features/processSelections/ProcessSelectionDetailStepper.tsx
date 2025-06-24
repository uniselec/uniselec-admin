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
// import { EnemScoreImport } from "../enemScores/EnemScoreImport";
// import { EnemScoreList } from "../enemScores/EnemScoreList";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";
import { CardAdvise } from "./components/CardAdvise";
import { ApplicationCSVDownload } from "../applications/ApplicationCSVDownload";
import { ImportEnemScoreStep } from "./ImportEnemScoreStep";
import { ApplicationOutcomesStep } from "./ApplicationOutcomesStep";


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


  const stepLabels = [
    "Processo Seletivo",
    "Importar Notas ",
    "Resultados"
  ]


  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ mt: 0, mb: 4 }}>
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
        {activeStep === 1 && <ImportEnemScoreStep />}
        {activeStep === 2 && <ApplicationOutcomesStep/>}
        {activeStep === 3 && <CardAdvise/>}
      </Box>
    </Box>
  );
};
