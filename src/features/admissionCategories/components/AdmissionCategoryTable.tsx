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
import { Results } from "../../../types/AdmissionCategory";
import { Link } from "react-router-dom";
import { useDeleteAdmissionCategoryMutation } from "../admissionCategorySlice";
import useTranslate from "../../polyglot/useTranslate";

type Props = {
  admissionCategories: Results | undefined;
  paginationModel: object;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: { page: number; pageSize: number }) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function AdmissionCategoryTable({
  admissionCategories,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,
}: Props) {
  const translate = useTranslate("admissionCategories");
  const [deleteAdmissionCategory, { isLoading }] = useDeleteAdmissionCategoryMutation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdmissionCategoryId, setSelectedAdmissionCategoryId] = useState<string | null>(null);

  const handleAlertClose = () => setAlertOpen(false);
  const handleOpenConfirm = (id: string) => {
    setSelectedAdmissionCategoryId(id);
    setConfirmOpen(true);
  };
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedAdmissionCategoryId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdmissionCategoryId) return;
    try {
      await deleteAdmissionCategory({ id: selectedAdmissionCategoryId }).unwrap();
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const modalityLabels: Record<string, string> = {
    "distance": "EAD",
    "in-person": "Presencial"
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "description", headerName: "Descrição", flex: 1 },
    // { field: "created_at", headerName: "Criado em", flex: 1, valueGetter: (params) => formatDate(params.value) },
    // { field: "updated_at", headerName: "Atualizado em", flex: 1, valueGetter: (params) => formatDate(params.value) },
    {
      field: "actions",
      headerName: "Ações",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button variant="contained" size="small" color="primary" component={Link} to={`/admission-categories/edit/${params.row.id}`}>
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
    return data.data.map((admissionCategory) => ({
      id: admissionCategory.id,
      name: admissionCategory.name,
      description: admissionCategory.description,
      created_at: admissionCategory.created_at,
      updated_at: admissionCategory.updated_at,
    }));
  };

  const rows = admissionCategories ? mapDataToGridRows(admissionCategories) : [];
  const rowCount = admissionCategories?.meta.total || 0;

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
          <DialogContentText id="confirm-dialog-description">Tem certeza de que deseja apagar esta Unidade Acadêmica?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
