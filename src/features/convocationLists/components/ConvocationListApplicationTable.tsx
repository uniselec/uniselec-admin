import React, { useState, useMemo } from "react";
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
  isFetching,
}) => {
  const translate = useTranslate("convocationListApplication.status");
  const [deleteRow, { isLoading }] =
    useDeleteConvocationListApplicationMutation();

  /* ---------- feedback UI ---------- */
  const [alert, setAlert] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error";
  }>({ open: false, msg: "", sev: "success" });

  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const closeAlert = () =>
    setAlert((prev) => ({
      ...prev,
      open: false,
    }));
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

  /* ---------- dados ---------- */
  const rawRows = convocationListApplications?.data ?? [];

  /* ►► Ordena por categoria (alfabética) e, dentro dela, pelo ranking_in_category */
  const rows = useMemo(() => {
    return [...rawRows].sort((a: any, b: any) => {
      const catA = a?.category?.name ?? "";
      const catB = b?.category?.name ?? "";

      if (catA !== catB) {
        return catA.localeCompare(catB, "pt-BR");
      }
      /* mesma categoria → ranking crescente */
      const rankA = a?.ranking_in_category ?? 0;
      const rankB = b?.ranking_in_category ?? 0;
      return rankA - rankB;
    });
  }, [rawRows]);

  /* ---------- render ---------- */
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
          {/* cabeçalho -------------------------------------------------- */}
          <TableHead>
            <TableRow>
              {[
                "Campus",
                "Curso",
                "Nome do Candidato",
                "Nota",
                "Ranking (cat.)",
                "Categoria",
                "Situação",
                "Ações",
              ].map((h) => (
                <TableCell
                  key={h}
                  sx={{ border: "1px solid black", p: 1, fontWeight: "bold" }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* corpo ------------------------------------------------------ */}
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography align="center">Carregando…</Typography>
                </TableCell>
              </TableRow>
            )}

            {!isFetching && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography align="center">Nenhum registro.</Typography>
                </TableCell>
              </TableRow>
            )}

            {rows.map((app: any) => (
              <TableRow key={app.id} sx={{ border: "1px solid black" }}>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {app.course?.academic_unit?.state}
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {app.course?.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  <Link
                    to={`/application-outcomes/edit/${app.application.id}`}
                    style={{ textDecoration: "none", color: "blue" }}
                  >
                    {app.application?.form_data?.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {app.application?.application_outcome?.final_score}
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {app.ranking_in_category}
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {app.category?.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {translate(app.status)}
                </TableCell>
                <TableCell sx={{ border: "1px solid black", p: 1 }}>
                  {/* <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    disabled={isLoading}
                    onClick={() => openConfirm(app.id)}
                  >
                    Apagar
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Snackbar ---------------------------------------------------- */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={closeAlert}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={closeAlert}
            severity={alert.sev}
            sx={{ width: "100%" }}
          >
            {alert.msg}
          </Alert>
        </Snackbar>

        {/* Diálogo de confirmação -------------------------------------- */}
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
