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
import { Results } from "../../../types/ProcessSelection";
import { Link } from "react-router-dom";
import { useDeleteProcessSelectionMutation } from "../processSelectionSlice";

type Props = {
  processSelections: Results | undefined;
  paginationModel: object;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: { page: number; pageSize: number }) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function ProcessSelectionCardResume({
  processSelections,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,
}: Props) {
  const [deleteProcessSelection, { isLoading }] = useDeleteProcessSelectionMutation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProcessSelectionId, setSelectedProcessSelectionId] = useState<string | null>(null);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedProcessSelectionId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedProcessSelectionId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProcessSelectionId) return;
    try {
      await deleteProcessSelection({ id: selectedProcessSelectionId }).unwrap();
      setAlertSeverity("success");
      setAlertMessage("Processo seletivo apagado com sucesso.");
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage("Falha ao tentar apagar o processo seletivo.");
    } finally {
      setAlertOpen(true);
      handleCloseConfirm();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", type: "string", width: 100 },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "description", headerName: "Descrição", flex: 2 },
    { field: "type", headerName: "Tipo", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "start_date",
      headerName: "Data de Início",
      flex: 1,
      valueGetter: (params) => formatDate(params.value),
    },
    {
      field: "end_date",
      headerName: "Data de Fim",
      flex: 1,
      valueGetter: (params) => formatDate(params.value),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            component={Link}
            to={`/process-selections/details/${params.row.id}`}
          >
            Selecionar
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => handleOpenConfirm(params.row.id)}
            disabled={isLoading}
          >
            Apagar
          </Button>
        </Box>
      ),
    },
  ];

  function mapDataToGridRows(data: Results) {
    return data.data.map((processSelection) => ({
      id: processSelection.id,
      name: processSelection.name,
      description: processSelection.description,
      type: processSelection.type,
      status: processSelection.status,
      start_date: processSelection.start_date,
      end_date: processSelection.end_date,
    }));
  }

  const rows = processSelections ? mapDataToGridRows(processSelections) : [];
  const rowCount = processSelections?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: 500, width: "100%", boxShadow: 3, borderRadius: 2, bgcolor: "background.paper", overflow: "hidden" }}>
      <DataGrid
        columns={columns}
        rows={rows}
        filterMode="server"
        rowCount={rowCount}
        loading={isFetching}
        paginationMode="server"
        checkboxSelection={false}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
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

      {/* Modal de Confirmação */}
      <Dialog open={confirmOpen} onClose={handleCloseConfirm} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
        <DialogTitle id="confirm-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Tem certeza de que deseja apagar este processo seletivo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
