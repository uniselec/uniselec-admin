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
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridToolbar,
  ptPT,
} from "@mui/x-data-grid";
import { Results } from "../../../types/ConvocationList";
import { Link } from "react-router-dom";
import { useDeleteConvocationListMutation } from "../convocationListSlice";
import useTranslate from "../../polyglot/useTranslate";

type Props = {
  convocationLists: Results | undefined;
  paginationModel: object;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: { page: number; pageSize: number }) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function ConvocationListTable({
  convocationLists,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,
}: Props) {
  const translate = useTranslate("convocationLists");
  const [deleteConvocationList, { isLoading }] = useDeleteConvocationListMutation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedConvocationListId, setSelectedConvocationListId] = useState<string | null>(null);

  const handleAlertClose = () => setAlertOpen(false);
  const handleOpenConfirm = (id: string) => {
    setSelectedConvocationListId(id);
    setConfirmOpen(true);
  };
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedConvocationListId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedConvocationListId) return;
    try {
      await deleteConvocationList({ id: selectedConvocationListId }).unwrap();
      setAlertSeverity("success");
      setAlertMessage("Curso apagado com sucesso.");
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("Falha ao tentar apagar o curso.");
    } finally {
      setAlertOpen(true);
      handleCloseConfirm();
    }
  };



  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nome", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button variant="contained" size="small" color="primary" component={Link} to={`/convocationLists/edit/${params.row.id}`}>
            Editar
          </Button>
          <Button variant="contained" size="small" color="secondary" onClick={() => handleOpenConfirm(params.row.id)} disabled={isLoading}>
            Apagar
          </Button>
        </Box>
      ),
    },
  ];

  const mapDataToGridRows = (data: Results) => {
    return data.data.map((convocationList) => ({
      id: convocationList.id,
      name: convocationList.name,
      created_at: convocationList.created_at,
      updated_at: convocationList.updated_at,
    }));
  };

  const rows = convocationLists ? mapDataToGridRows(convocationLists) : [];
  const rowCount = convocationLists?.meta.total || 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: 500,
        width: "100%",
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        filterMode="server"
        rowCount={rowCount}
        loading={isFetching}
        paginationMode="server"
        checkboxSelection={false}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
          },
        }}
        onPaginationModelChange={handleSetPaginationModel}
        onFilterModelChange={handleFilterChange}
        localeText={ptPT.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": { bgcolor: "primary.main", color: "#FFFFFF", fontWeight: "bold" },
          "& .MuiDataGrid-row:hover": { bgcolor: "grey.100" },
          "& .MuiDataGrid-cell": { overflow: "hidden", textOverflow: "ellipsis" },
        }}
      />

      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
        <DialogTitle id="confirm-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">Tem certeza de que deseja apagar esta lista?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
