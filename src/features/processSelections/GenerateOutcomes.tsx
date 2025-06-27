// features/processSelections/ApplicationOutcomesStep.tsx
import React from "react";
import {
  Grid,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGenerateApplicationOutcomeMutation } from "../applicationOutcomes/applicationOutcomeSlice";


export const GenerateOutcomes: React.FC = () => {
  const { id: selectionId } = useParams<{ id: string }>();


  const [generate, { isLoading: loadingAll }] =
    useGenerateApplicationOutcomeMutation();

  const [snack, setSnack] = React.useState<{
    open: boolean;
    severity: "success" | "error";
    msg: string;
  }>({ open: false, severity: "success", msg: "" });

  const handle = (promise: Promise<any>) =>
    promise
      .then(() =>
        setSnack({
          open: true,
          severity: "success",
          msg: "Processamento concluído!",
        })
      )
      .catch(() =>
        setSnack({
          open: true,
          severity: "error",
          msg: "Erro ao processar resultados.",
        })
      );

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            1. Processar Resultados
          </Typography>



          <Grid container spacing={2}>
            {/* Botão 1 */}
            <Grid item>
              <Button
                variant="contained"
                disabled={loadingAll || !selectionId}
                onClick={() =>
                  handle(
                    generate({ selectionId: selectionId! }).unwrap()
                  )
                }
              >
                {loadingAll ? (
                  <CircularProgress size={22} sx={{ mr: 1 }} />
                ) : null}
                Gerar Resultados
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </>
  );
};
