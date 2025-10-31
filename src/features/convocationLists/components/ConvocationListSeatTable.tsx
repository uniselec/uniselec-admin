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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Results } from "../../../types/ConvocationListSeat";
import { useDeleteConvocationListSeatMutation } from "../convocationListSeatSlice";
import { Link } from "react-router-dom";

type Props = {
  convocationListSeats: Results | undefined;
  isFetching: boolean;
};

export const ConvocationListSeatTable: React.FC<Props> = ({
  convocationListSeats,
  isFetching,
}) => {
  /* ---- mutations & feedback ---- */
  const [deleteSeat, { isLoading }] = useDeleteConvocationListSeatMutation();
  const [alert, setAlert] = useState<{ open: boolean; msg: string; sev: "success" | "error" }>({
    open: false,
    msg: "",
    sev: "success",
  });
  const [confirm, setConfirm] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });

  const closeAlert = () => setAlert((s) => ({ ...s, open: false }));
  const openConfirm = (id: string) => setConfirm({ open: true, id });
  const closeConfirm = () => setConfirm({ open: false, id: null });

  const handleConfirmDelete = async () => {
    if (!confirm.id) return;
    try {
      await deleteSeat({ id: confirm.id }).unwrap();
      setAlert({ open: true, sev: "success", msg: "Vaga removida com sucesso." });
    } catch {
      setAlert({ open: true, sev: "error", msg: "Falha ao remover a vaga." });
    } finally {
      closeConfirm();
    }
  };

  /* ---- helpers ---- */
  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("pt-BR") : "-";

  const rows = useMemo(
    () =>
      [...(convocationListSeats?.data ?? [])].sort((a, b) =>
        (a.seat_code ?? "").localeCompare(b.seat_code ?? "", "pt-BR", { numeric: true })
      ),
    [convocationListSeats]
  );

  // métricas
  const totals = useMemo(() => {
    const total = rows.length;
    const reservadas = rows.filter((s) => s.status === "reserved").length;
    const pendentes = rows.filter((s) => s.status === "open").length;
    const preenchidas = rows.filter(
      (s) => (s.status !== "open" && s.status !== "reserved") || !!s.application
    ).length;

    return { total, preenchidas, reservadas, pendentes };
  }, [rows]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Accordion de Vagas */}
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
              id="outcomes-table"
              style={{
                borderCollapse: "collapse",
                width: "100%",
                color: "black",
                tableLayout: "fixed",
                wordWrap: "break-word",
                fontSize: "12px",
              }}
            >
              <TableHead>
                <TableRow>
                  {["Código", "Curso", "Cat. Origem", "Cat. Atual", "Status", "Ações"].map(
                    (h) => (
                      <TableCell
                        key={h}
                        style={{ border: "1px solid black", padding: "8px", fontWeight: "bold" }}
                      >
                        {h}
                      </TableCell>
                    )
                  )}
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
                      <Typography align="center">Nenhuma vaga encontrada.</Typography>
                    </TableCell>
                  </TableRow>
                )}

                {rows.map((seat) => (
                  <TableRow key={seat.id} style={{ border: "1px solid black" }}>
                    <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                      {seat.seat_code}
                    </TableCell>
                    <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                      {seat.course?.name}
                    </TableCell>
                    <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                      {seat.origin_category?.name}
                    </TableCell>
                    <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                      {seat.current_category?.name}
                    </TableCell>
                    <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                      {seat.status === "open"
                        ? "Aberta"
                        : seat.status === "reserved"
                        ? "Reservada"
                        : (
                          <Link
                            to={`/application-outcomes/edit/${seat?.application?.id}`}
                            style={{ textDecoration: "none", color: "blue" }}
                          >
                            {seat.application?.form_data?.name}
                          </Link>
                        )}
                    </TableCell>
                    <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                      {/*
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        disabled={isLoading}
                        onClick={() => openConfirm(String(seat.id))}
                      >
                        Apagar
                      </Button>
                      */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </AccordionDetails>
      </Accordion>

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

      {/* diálogo de confirmação */}
      <Dialog open={confirm.open} onClose={closeConfirm}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>Tem certeza de que deseja apagar esta vaga?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancelar</Button>
          <Button color="secondary" onClick={handleConfirmDelete} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
