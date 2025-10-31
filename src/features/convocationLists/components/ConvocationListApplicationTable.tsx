import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
} from "../convocationListApplicationSlice";
import useTranslate from "../../polyglot/useTranslate";
import { Link } from "react-router-dom";
import { Results } from "../../../types/ConvocationListApplication";

type ActionType =
  | "call"
  | "accept"
  | "decline"
  | "reject";

const ACTION_LABELS: Record<ActionType, { title: string; confirm: string }> = {
  call: { title: "Convocar candidato?", confirm: "Tem certeza que deseja convocar este candidato?" },
  accept: { title: "Aceitar vaga?", confirm: "Tem certeza que deseja aceitar esta vaga?" },
  decline: { title: "Recusar vaga?", confirm: "Ao confirmar essa ação o candidato irá ser excluído de todas as as modalidades." },
  reject: { title: "Indeferir inscrição?", confirm: "Ao confirmar o candidato sera excluído apenas desta modalidade nesta lista de convocação." },
};

type Props = {
  convocationListApplications?: Results;
  isFetching: boolean;
};

export const ConvocationListApplicationTable: React.FC<Props> = ({
  convocationListApplications,
  isFetching,
}) => {
  const [callApp, { isLoading: loadingCall }] = useCallConvocationListApplicationMutation();
  const [acceptApp, { isLoading: loadingAccept }] = useAcceptConvocationMutation();
  const [declineApp, { isLoading: loadingDecline }] = useDeclineConvocationMutation();
  const [rejectApp, { isLoading: loadingReject }] = useRejectConvocationMutation();
  const translate = useTranslate("convocationListApplication");

  const [alert, setAlert] = useState<{ open: boolean; msg: string; sev: "success" | "error" }>({
    open: false, msg: "", sev: "success"
  });

  const [confirm, setConfirm] = useState<{
    open: boolean;
    id?: string;
    action?: ActionType;
  }>({ open: false });

  const closeAlert = () => setAlert(a => ({ ...a, open: false }));
  const openConfirm = (id: string, action: ActionType) => {
    setConfirm({ open: true, id, action });
  };
  const closeConfirm = () => setConfirm({ open: false });

  const doAction = async () => {
    const { id, action } = confirm;
    if (!id || !action) return;
    let fn: ((args: { id: string }) => Promise<any>);
    let successMsg = "";

    switch (action) {
      case "call": fn = callApp; successMsg = "Convocado!"; break;
      case "accept": fn = acceptApp; successMsg = "Aceito!"; break;
      case "decline": fn = declineApp; successMsg = "Recusado!"; break;
      case "reject": fn = rejectApp; successMsg = "Indeferido!"; break;
      default: return;
    }

    try {
      const res = await fn({ id });
      if ("error" in res) throw res.error;
      setAlert({ open: true, sev: "success", msg: successMsg });
    } catch (e: any) {
      setAlert({ open: true, sev: "error", msg: e?.data?.message || "Erro inesperado" });
    } finally {
      closeConfirm();
    }
  };

  const rows = useMemo(() => {
    const raw = convocationListApplications?.data ?? [];
    return [...raw].sort((a: any, b: any) => {
      const catA = a.category?.name ?? "";
      const catB = b.category?.name ?? "";
      if (catA !== catB) return catA.localeCompare(catB, "pt-BR");
      return (a.category_ranking ?? 0) - (b.category_ranking ?? 0);
    });
  }, [convocationListApplications]);

  return (
    <Box mt={2}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Table sx={{ fontSize: 12 }}>
          <TableHead>
            <TableRow>
              {["Campus", "Curso", "Candidato", "Nota", "Rank(cat.)", "Categoria", "Resultado", "Convocação", "Resposta", "Vaga", "Ações"]
                .map(h => (
                  <TableCell key={h} sx={{ border: "1px solid #ddd", p: 1, fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              <TableRow><TableCell colSpan={11}><Typography align="center">Carregando…</Typography></TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={11}><Typography align="center">Nenhum registro.</Typography></TableCell></TableRow>
            ) : rows.map((app: any) => (
              <TableRow key={app.id} hover>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>{app.course?.academic_unit?.state}</TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>{app.course?.name}</TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  <Link to={`/application-outcomes/edit/${app.application.id}`} style={{ color: "#1976d2", textDecoration: "none" }}>
                    {app.application?.form_data?.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>{app.application?.application_outcome?.final_score}</TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>{app.category_ranking}</TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>{app.category?.name}</TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {translate(`resultStatus.${app.result_status}`)}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {translate(`convocationStatus.${app.convocation_status}`)}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.convocation_status === "called"
                    ? translate(`responseStatus.${app.response_status}`)
                    : "–"}
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1 }}>
                  {app.seat?.seat_code
                    ? ["rejected", "declined"].includes(app.response_status)
                      ? <Typography component="span" sx={{ textDecoration: "line-through" }}>{app.seat.seat_code}</Typography>
                      : app.seat.seat_code
                    : "–"
                  }
                </TableCell>
                <TableCell sx={{ border: "1px solid #eee", p: 1, whiteSpace: "nowrap" }}>
                  {/* Convocar */}
                  {["pending", "called_out_of_quota"].includes(app.convocation_status) && (
                    <Tooltip title="Convocar candidato">
                      <Button
                        variant="contained" size="small"
                        disabled={loadingCall}
                        onClick={() => openConfirm(app.id, "call")}
                        sx={{ mr: 1 }}
                      >Convocar</Button>
                    </Tooltip>
                  )}

                  {/* Resposta */}
                  {app.convocation_status === "called" && app.response_status === "pending" && (
                    <ButtonGroup size="small" variant="outlined">
                      <Tooltip title="Aceitar vaga">
                        <Button
                          disabled={loadingAccept}
                          onClick={() => openConfirm(app.id, "accept")}
                        ><CheckIcon fontSize="small" /></Button>
                      </Tooltip>
                      <Tooltip title="Recusar vaga">
                        <Button
                          disabled={loadingDecline}
                          onClick={() => openConfirm(app.id, "decline")}
                        ><CloseIcon fontSize="small" /></Button>
                      </Tooltip>
                      <Tooltip title="Indeferir inscrição">
                        <Button
                          color="error" disabled={loadingReject}
                          onClick={() => openConfirm(app.id, "reject")}
                        ><BlockIcon fontSize="small" /></Button>
                      </Tooltip>
                    </ButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Snackbar */}
        <Snackbar open={alert.open} autoHideDuration={3000} onClose={closeAlert}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={closeAlert} severity={alert.sev} sx={{ width: "100%" }}>
            {alert.msg}
          </Alert>
        </Snackbar>

        {/* Diálogo de confirmação */}
        <Dialog open={confirm.open} onClose={closeConfirm}>
          <DialogTitle>
            {confirm.action ? ACTION_LABELS[confirm.action].title : ""}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {confirm.action ? ACTION_LABELS[confirm.action].confirm : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm}>Cancelar</Button>
            <Button
              onClick={doAction}
              color={"primary"}
              autoFocus
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};
