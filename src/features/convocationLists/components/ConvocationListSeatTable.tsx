import React, { useMemo, useState } from "react";
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Results } from "../../../types/ConvocationListSeat";
import {
  useDeleteConvocationListSeatMutation,
  useRedistributeSeatMutation,
} from "../convocationListSeatSlice";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";

type Props = {
  convocationListSeats: Results | undefined;
  isFetching: boolean;
};

export const ConvocationListSeatTable: React.FC<Props> = ({
  convocationListSeats,
  isFetching,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [redistributeSeat, { isLoading: loadingRedistribute }] =
    useRedistributeSeatMutation();

  const [deleteSeat] = useDeleteConvocationListSeatMutation();

  const [alert, setAlert] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error";
  }>({ open: false, msg: "", sev: "success" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  const [redistributeConfirm, setRedistributeConfirm] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  /** Fechar snackbar */
  const closeAlert = () => setAlert((s) => ({ ...s, open: false }));

  /** Ações de remover vaga (idem antes) */
  const openDelete = (id: string) => setDeleteConfirm({ open: true, id });
  const closeDelete = () => setDeleteConfirm({ open: false, id: null });
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteSeat({ id: deleteConfirm.id }).unwrap();
      setAlert({ open: true, sev: "success", msg: "Vaga removida com sucesso." });
    } catch {
      setAlert({ open: true, sev: "error", msg: "Falha ao remover a vaga." });
    } finally {
      closeDelete();
    }
  };

  /** Ações de redistribuir */
  const openRedistribute = (id: string) =>
    setRedistributeConfirm({ open: true, id });
  const closeRedistribute = () =>
    setRedistributeConfirm({ open: false, id: null });
  const handleConfirmRedistribute = async () => {
    if (!redistributeConfirm.id) return;
    try {
      await redistributeSeat({ id: redistributeConfirm.id }).unwrap();
      enqueueSnackbar("Vaga redistribuída com sucesso.", { variant: "success" });
    } catch (e: any) {
      enqueueSnackbar(e?.data?.message || "Falha ao redistribuir vaga.", {
        variant: "error",
      });
    } finally {
      closeRedistribute();
    }
  };

  // Ordenação e métricas (idem antes)
  const rows = useMemo(
    () =>
      [...(convocationListSeats?.data ?? [])].sort((a, b) =>
        (a.seat_code ?? "").localeCompare(b.seat_code ?? "", "pt-BR", {
          numeric: true,
        })
      ),
    [convocationListSeats]
  );

  const totals = useMemo(() => {
    const total = rows.length;
    const reservadas = rows.filter((s) => s.status === "reserved").length;
    const pendentes = rows.filter((s) => s.status === "open").length;
    const preenchidas = rows.filter(
      (s) =>
        (s.status !== "open" && s.status !== "reserved") || !!s.application
    ).length;
    return { total, preenchidas, reservadas, pendentes };
  }, [rows]);

  return (
    <Box sx={{ mt: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6">Vagas</Typography>
            <Chip label={`Total: ${totals.total}`} size="small" />
            <Chip label={`Preenchidas: ${totals.preenchidas}`} size="small" />
            <Chip label={`Reservadas: ${totals.reservadas}`} size="small" />
            <Chip label={`Pendentes: ${totals.pendentes}`} size="small" />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Paper sx={{ p: 2 }}>
            <Table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                tableLayout: "fixed",
                wordWrap: "break-word",
                fontSize: "12px",
              }}
            >
              <TableHead>
                <TableRow>
                  {[
                    "Código",
                    "Curso",
                    "Cat. Origem",
                    "Cat. Atual",
                    "Status",
                    "Ações",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        border: "1px solid black",
                        p: 1,
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
                    <TableCell colSpan={6}>
                      <Typography align="center">Carregando…</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {!isFetching && rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography align="center">
                        Nenhuma vaga encontrada.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((seat) => (
                  <TableRow key={seat.id} hover>
                    <TableCell sx={{ border: "1px solid black", p: 1 }}>
                      {seat.seat_code}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black", p: 1 }}>
                      {seat.course?.name}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black", p: 1 }}>
                      {seat.origin_category?.name}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black", p: 1 }}>
                      {seat.current_category?.name}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black", p: 1 }}>
                      {seat.status === "open"
                        ? "Aberta"
                        : seat.status === "reserved"
                        ? "Reservada"
                        : (
                            <Link
                              to={`/application-outcomes/edit/${seat.application?.id}`}
                              style={{ textDecoration: "none", color: "blue" }}
                            >
                              {seat.application?.form_data?.name}
                            </Link>
                          )}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black", p: 1 }}>
                      {seat.can_redistribute && (
                        <Tooltip title="Redistribuir vaga">
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={loadingRedistribute}
                            onClick={() => openRedistribute(String(seat.id))}
                          >
                            Redistribuir
                          </Button>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* Snackbar de feedback */}
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

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteConfirm.open} onClose={closeDelete}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja apagar esta vaga?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Cancelar</Button>
          <Button color="secondary" onClick={handleConfirmDelete} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação de redistribuição */}
      <Dialog open={redistributeConfirm.open} onClose={closeRedistribute}>
        <DialogTitle>Redistribuir vaga</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja realmente redistribuir esta vaga para a próxima categoria?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRedistribute}>Cancelar</Button>
          <Button
            onClick={handleConfirmRedistribute}
            disabled={loadingRedistribute}
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
