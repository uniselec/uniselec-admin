import React, { useState } from "react";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { Results } from "../../../types/ConvocationListApplication";
import { useDeleteConvocationListApplicationMutation } from "../convocationListApplicationSlice";
import useTranslate from "../../polyglot/useTranslate";
import { Link } from "react-router-dom";

type Props = {
  convocationListApplications: Results | undefined;
  isFetching: boolean;
};

export const ConvocationListApplicationTable: React.FC<Props> = ({
  convocationListApplications,
  isFetching
}) => {
  const translate = useTranslate("convocationListApplication.status");
  const [deleteRow, { isLoading }] =
    useDeleteConvocationListApplicationMutation();

  const [alert, setAlert] = useState<{ open: boolean; msg: string; sev: "success" | "error" }>({
    open: false,
    msg: "",
    sev: "success",
  });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const closeAlert = () => setAlert({ ...alert, open: false });
  const openConfirm = (id: string) => setConfirm({ open: true, id });
  const closeConfirm = () => setConfirm({ open: false, id: null });

  const doDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteRow({ id: confirm.id }).unwrap();
      setAlert({ open: true, sev: "success", msg: "Inscrição removida." });
    } catch {
      setAlert({ open: true, sev: "error", msg: "Falha ao remover." });
    } finally {
      closeConfirm();
    }
  };

  const rows = convocationListApplications?.data ?? [];

  return (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            fontSize: "12px",
            tableLayout: "fixed",
            wordWrap: "break-word",
          }}
        >
          <TableHead>
            <TableRow>
              {[
                "Campus",
                "Curso",
                "Nome do Candidato",
                "Nota",
                "Ranking",
                "Categoria",
                "Situação",
                "Ações",
              ].map((h) => (
                <TableCell
                  key={h}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography align="center">Carregando…</Typography>
                </TableCell>
              </TableRow>
            )}

            {!isFetching && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography align="center">Nenhum registro.</Typography>
                </TableCell>
              </TableRow>
            )}

            {rows.map((app) => (
              <TableRow key={app.id} style={{ border: "1px solid black" }}>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {app.course?.academic_unit?.state}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {app.course?.name}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  <Link to={`/application-outcomes/edit/${app.application.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    {app.application?.form_data?.name}
                  </Link>
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {app.application?.application_outcome?.final_score}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {app.ranking_at_generation}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {app.category?.name}
                </TableCell>

                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {translate(app.status)}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {/* <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    disabled={isLoading}
                    onClick={() => {
                      setAlert({ open: true, sev: "info" as any, msg: "EM desenvolvimento" });
                    }}
                  >
                    Eleger Manual
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* paginação simples */}
        {convocationListApplications && (
          <Box sx={{ mt: 1, display: "flex", gap: 2, justifyContent: "center" }}>
            {/* <Button
              size="small"
              disabled={!convocationListApplications.links.prev}
              onClick={() =>
                handleSetPaginationModel(
                  convocationListApplications.meta.current_page - 1,
                )
              }
            >
              Anterior
            </Button>
            <Typography variant="caption" sx={{ mt: 1 }}>
              Página {convocationListApplications.meta.current_page} de{" "}
              {convocationListApplications.meta.last_page}
            </Typography>
            <Button
              size="small"
              disabled={!convocationListApplications.links.next}
              onClick={() =>
                handleSetPaginationModel(
                  convocationListApplications.meta.current_page + 1,
                )
              }
            >
              Próxima
            </Button> */}
          </Box>
        )}

        {/* snack de feedback */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={closeAlert}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={closeAlert} severity={alert.sev} sx={{ width: "100%" }}>
            {alert.msg}
          </Alert>
        </Snackbar>

        {/* diálogo confirmação */}
        <Dialog open={confirm.open} onClose={closeConfirm}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza de que deseja apagar esta inscrição?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm}>Cancelar</Button>
            <Button color="secondary" onClick={doDelete} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};
