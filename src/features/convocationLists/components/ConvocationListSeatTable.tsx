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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
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

  const closeAlert = () => setAlert({ ...alert, open: false });

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

  /* ---- helper ---- */
  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("pt-BR") : "-";

  /* ---- tabela ---- */
  const rows =
    [...(convocationListSeats?.data ?? [])]               // ← cópia “mutável”
      .sort((a, b) =>
        (a.seat_code ?? "").localeCompare(
          b.seat_code ?? "",
          "pt-BR",               // usa regras locais
          { numeric: true }      // 001 < 010 < 100
        )
      );
  return (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>


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
              {[
                "Código",
                "Curso",
                "Cat. Origem",
                "Cat. Atual",
                "Status",
                "Criada em",
                "Ações",
              ].map((h) => (
                <TableCell
                  key={h}
                  style={{ border: "1px solid black", padding: "8px", fontWeight: "bold" }}
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
                  {seat.status === "open" ? "Aberta" : seat.status === "reserved" ? "Reservada" : (
                    <>
                      <Link to={`/application-outcomes/edit/${seat?.application?.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                        {seat.application?.form_data?.name}
                      </Link>
                    </>
                  )}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {formatDate(seat.created_at)}
                </TableCell>
                <TableCell style={{ border: "1px solid black", padding: "6px" }}>
                  {/* <Button
                    variant="contained"
                    size="small"
                    color="secondary"
                    disabled={isLoading}
                    onClick={() => openConfirm(String(seat.id))}
                  >
                    Apagar
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* paginação simples */}
        {convocationListSeats && (
          <Box sx={{ mt: 1, display: "flex", gap: 2, justifyContent: "center" }}>
            {/* <Button
              size="small"
              disabled={!convocationListSeats.links.prev}
              onClick={() => handleSetPaginationModel(convocationListSeats.meta.current_page - 1)}
            >
              Anterior
            </Button>
            <Typography variant="caption" sx={{ mt: 1 }}>
              Página {convocationListSeats.meta.current_page} de {convocationListSeats.meta.last_page}
            </Typography>
            <Button
              size="small"
              disabled={!convocationListSeats.links.next}
              onClick={() => handleSetPaginationModel(convocationListSeats.meta.current_page + 1)}
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

        {/* diálogo de confirmação */}
        <Dialog open={confirm.open} onClose={closeConfirm}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza de que deseja apagar esta vaga?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeConfirm}>Cancelar</Button>
            <Button color="secondary" onClick={handleConfirmDelete} autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};
