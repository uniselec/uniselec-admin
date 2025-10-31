import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import BlockIcon from "@mui/icons-material/Block";
import {
  useCallConvocationListApplicationMutation,
  useAcceptConvocationMutation,
  useDeclineConvocationMutation,
  useRejectConvocationMutation,
  useDeleteConvocationListApplicationMutation,
} from "../convocationListApplicationSlice";
import useTranslate from "../../polyglot/useTranslate";
import { Link } from "react-router-dom";
import { Results } from "../../../types/ConvocationListApplication";

type Props = {
  convocationListApplications: Results | undefined;
  isFetching: boolean;
};

export const ConvocationListApplicationTable: React.FC<Props> = ({
  convocationListApplications,
  isFetching,
}) => {
  const [callApp, { isLoading: loadingCall }] =
    useCallConvocationListApplicationMutation();
  const [acceptApp, { isLoading: loadingAccept }] =
    useAcceptConvocationMutation();
  const [declineApp, { isLoading: loadingDecline }] =
    useDeclineConvocationMutation();
  const [rejectApp, { isLoading: loadingReject }] =
    useRejectConvocationMutation();
  const [deleteRow, { isLoading: loadingDelete }] =
    useDeleteConvocationListApplicationMutation();

  const translate = useTranslate("convocationListApplication");

  const [alert, setAlert] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error";
  }>({ open: false, msg: "", sev: "success" });

  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const closeAlert = () =>
    setAlert((prev) => ({ ...prev, open: false }));

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

  const handleAction = async (
    fn: (args: { id: string }) => Promise<any>,
    id: string,
    successMsg: string,
    errorMsg = "Erro inesperado"
  ) => {
    try {
      const result = await fn({ id });
      if ("error" in result) throw result.error;
      setAlert({ open: true, sev: "success", msg: successMsg });
    } catch (e: any) {
      setAlert({
        open: true,
        sev: "error",
        msg: e?.data?.message || errorMsg,
      });
    }
  };

  const rows = useMemo(() => {
    const raw = convocationListApplications?.data ?? [];
    return [...raw].sort((a: any, b: any) => {
      const catA = a.category?.name ?? "";
      const catB = b.category?.name ?? "";
      if (catA !== catB) {
        return catA.localeCompare(catB, "pt-BR");
      }
      return (a.category_ranking ?? 0) - (b.category_ranking ?? 0);
    });
  }, [convocationListApplications]);

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
                "Candidato",
                "Nota",
                "Rank(cat.)",
                "Categoria",
                "Resultado",
                "Convocação",
                "Resposta",
                "Vaga",
                "Ações",
              ].map((h) => (
                <TableCell
                  key={h}
                  sx={{ border: "1px solid #ddd", p: 1, fontWeight: "bold" }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching && (
              <TableRow>
                <TableCell colSpan={11}>
                  <Typography align="center">Carregando…</Typography>
                </TableCell>
              </TableRow>
            )}
            {!isFetching && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={11}>
                  <Typography align="center">Nenhum registro.</Typography>
                </TableCell>
              </TableRow>
            )}
            {rows.map((app: any) => (
              <TableRow key={app.id} hover>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.course?.academic_unit?.state}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.course?.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  <Link
                    to={`/application-outcomes/edit/${app.application.id}`}
                    style={{ textDecoration: "none", color: "#1976d2" }}
                  >
                    {app.application?.form_data?.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.application?.application_outcome?.final_score}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.category_ranking}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.category?.name}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {translate(`resultStatus.${app.result_status}`)}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {translate(`convocationStatus.${app.convocation_status}`)}
                </TableCell>
                {/* resposta só se called */}
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.convocation_status === "called"
                    ? translate(`responseStatus.${app.response_status}`)
                    : "–"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.seat?.seat_code ? (
                    ["rejected", "declined"].includes(app.response_status) ? (
                      <Typography
                        component="span"
                        sx={{ textDecoration: "line-through" }}
                      >
                        {app.seat.seat_code}
                      </Typography>
                    ) : (
                      app.seat.seat_code
                    )
                  ) : (
                    "–"
                  )}
                </TableCell>

                {/* Ações */}
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {["pending", "called_out_of_quota"].includes(
                    app.convocation_status
                  ) && (
                    <Tooltip title="Convocar candidato">
                      <Button
                        variant="contained"
                        size="small"
                        disabled={loadingCall}
                        onClick={() =>
                          handleAction(callApp, app.id, "Convocado!")
                        }
                        sx={{ mr: 1 }}
                      >
                        Convocar
                      </Button>
                    </Tooltip>
                  )}

                  {app.convocation_status === "called" &&
                    app.response_status === "pending" && (
                      <ButtonGroup
                        size="small"
                        variant="outlined"
                        aria-label="group resposta"
                      >
                        <Tooltip title="Aceitar vaga">
                          <Button
                            onClick={() =>
                              handleAction(acceptApp, app.id, "Aceito!")
                            }
                            disabled={loadingAccept}
                          >
                            <CheckIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Recusar vaga">
                          <Button
                            onClick={() =>
                              handleAction(declineApp, app.id, "Recusado!")
                            }
                            disabled={loadingDecline}
                          >
                            <CloseIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Indeferir inscrição">
                          <Button
                            onClick={() =>
                              handleAction(rejectApp, app.id, "Indeferido!")
                            }
                            color="error"
                            disabled={loadingReject}
                          >
                            <BlockIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </ButtonGroup>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* notificação */}
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

        {/* confirmação de exclusão */}
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
