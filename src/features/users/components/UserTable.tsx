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
  GridToolbar,
  ptPT,
  GridPaginationModel,
  GridFilterModel,
} from "@mui/x-data-grid";
import { Results } from "../../../types/User";
import { Link } from "react-router-dom";
import {
  useDeleteUserMutation,
  useLazyPrintDeclarationQuery,
} from "../userSlice";
import useTranslate from "../../polyglot/useTranslate";


type Props = {
  users: Results | undefined;
  paginationModel: GridPaginationModel;
  isFetching: boolean;
  handleSetPaginationModel: (model: { page: number; pageSize: number }) => void;
  setQuickSearch: (value: string) => void;
};

export function UserTable({
  users,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  setQuickSearch,
}: Props) {
  const translate = useTranslate("users");

  /* ─── RTK Query hooks ──────────────────────────────────────────────── */
  // const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();



  /* ─── Snackbar / alert ─────────────────────────────────────────────── */
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );
  const [alertMessage, setAlertMessage] = useState("");
  const closeAlert = () => setAlertOpen(false);

  /* ─── Modal de confirmação de exclusão ─────────────────────────────── */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const openDeleteModal = (id: string) => {
    setSelectedUserId(id);
    setConfirmOpen(true);
  };
  const closeDeleteModal = () => {
    setConfirmOpen(false);
    setSelectedUserId(null);
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    const value = model.quickFilterValues?.[0] ?? "";
    setQuickSearch(value);                         // ← NOVO
  };
  // const handleConfirmDelete = async () => {
  //   if (!selectedUserId) return;
  //   try {
  //     await deleteUser({ id: selectedUserId }).unwrap();
  //     setAlertSeverity("success");
  //     setAlertMessage("Usuário apagado com sucesso.");
  //   } catch {
  //     setAlertSeverity("error");
  //     setAlertMessage("Falha ao tentar apagar o usuário.");
  //   } finally {
  //     setAlertOpen(true);
  //     closeDeleteModal();
  //   }
  // };



  /* ─── Colunas da grade ─────────────────────────────────────────────── */
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    // { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Ações",
      width: 360,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            component={Link}
            to={`/users/detail/${params.row.id}`}
          >
            Selecionar
          </Button>



          {/* <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() => openDeleteModal(params.row.id)}
            disabled={isDeleting}
          >
            Apagar
          </Button> */}
        </Box>
      ),
    },
  ];

  /* ─── Dados da grade ───────────────────────────────────────────────── */
  const rows =
    users?.data.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
    })) ?? [];
  const rowCount = users?.meta.total ?? 0;

  /* ─── Render ───────────────────────────────────────────────────────── */
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
        rows={rows}
        onFilterModelChange={handleFilterModelChange}
        columns={columns}
        pagination
        paginationMode="server"
        rowCount={rowCount}
        loading={isFetching}
        paginationModel={paginationModel}
        onPaginationModelChange={handleSetPaginationModel}
        checkboxSelection={false}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        localeText={ptPT.components.MuiDataGrid.defaultProps.localeText}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            csvOptions: { disableToolbarButton: true },
            printOptions: { disableToolbarButton: true },
          },
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "primary.main",
            color: "#fff",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:hover": {
            bgcolor: "grey.100",
          },
        }}
      />

      {/* Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alertSeverity} onClose={closeAlert} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Modal de confirmação */}
      {/* <Dialog open={confirmOpen} onClose={closeDeleteModal}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja apagar este filiado?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal}>Cancelar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="secondary"
            autoFocus
            disabled={isDeleting}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog> */}
    </Box>
  );
}