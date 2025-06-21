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
import { Results } from "../../../types/Admin";
import { Link } from "react-router-dom";
import { useDeleteAdminMutation } from "../adminSlice";
import useTranslate from "../../polyglot/useTranslate";
import { GridPaginationModel } from "@mui/x-data-grid";


type Props = {
  admins: Results | undefined;
  paginationModel: GridPaginationModel;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: GridPaginationModel) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function AdminTable({
  admins,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,
}: Props) {
  const translate = useTranslate("admins");
  const [deleteAdmin, { isLoading }] = useDeleteAdminMutation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Estado para controlar o modal de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedAdminId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedAdminId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdminId) return;
    try {
      await deleteAdmin({ id: selectedAdminId }).unwrap();
      setAlertSeverity("success");
      setAlertMessage("Administrador apagado com sucesso.");
    } catch (error) {
      console.error("Falha ao tentar apagar o administrador.");
      setAlertSeverity("error");
      setAlertMessage("Falha ao tentar apagar o administrador.");
    } finally {
      setAlertOpen(true);
      handleCloseConfirm();
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      type: "string",
      width: 100,
      hideable: false,
    },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
    },
    {
      field: "email",
      headerName: "E-mail",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 300,
      renderCell: (params) => (
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            component={Link}
            to={`/admins/edit/${params.row.id}`}
          >
            Editar
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
    const { data: admins } = data;
    return admins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email
    }));
  }

  const rows = admins ? mapDataToGridRows(admins) : [];
  const rowCount = admins?.meta.total || 0;

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
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handleSetPaginationModel}
        rowCount={rowCount}
        loading={isFetching}
        filterMode="server"
        onFilterModelChange={handleFilterChange}
        checkboxSelection={false}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
          },
        }}
        localeText={ptPT.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "primary.main",
            color: "#FFFFFF",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              bgcolor: "grey.100",
            },
          },
          "& .MuiDataGrid-cell": {
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
      />


      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Modal de Confirmação */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Tem certeza de que deseja apagar este administrador?
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
