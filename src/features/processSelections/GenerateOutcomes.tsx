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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useGenerateApplicationOutcomeMutation } from "../applicationOutcomes/applicationOutcomeSlice";

export const GenerateOutcomes: React.FC = () => {
  const { id: selectionId } = useParams<{ id: string }>();

  const [generate, { isLoading: loadingAll }] =
    useGenerateApplicationOutcomeMutation();

  /* estados */
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [snack, setSnack] = React.useState<{
    open: boolean;
    severity: "success" | "error";
    msg: string;
  }>({ open: false, severity: "success", msg: "" });

  /* wrapper para lidar com o snackbar */
  const handle = (promise: Promise<any>) =>
    promise
      .then(() =>
        setSnack({ open: true, severity: "success", msg: "Processamento concluído!" })
      )
      .catch(() =>
        setSnack({ open: true, severity: "error", msg: "Erro ao processar resultados." })
      );

  /* ação final após confirmar no diálogo */
  const confirmGenerate = () => {
    setDialogOpen(false);
    if (selectionId) {
      handle(generate({ selectionId }).unwrap());
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            1. Processar Resultados
          </Typography>

          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                disabled={loadingAll || !selectionId}
                onClick={() => setDialogOpen(true)}
              >
                {loadingAll ? <CircularProgress size={22} sx={{ mr: 1 }} /> : null}
                Gerar Resultados
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirmar processamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Todos os resultados anteriormente processados serão removidos e um novo
            processamento será iniciado. <br />
            Tem certeza que deseja prosseguir?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={confirmGenerate}
            variant="contained"
            color="primary"
            autoFocus
            disabled={loadingAll}
          >
            {loadingAll ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            Prosseguir
          </Button>
        </DialogActions>
      </Dialog>

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