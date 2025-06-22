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
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridToolbar,
  ptPT,
} from "@mui/x-data-grid";
import { Results } from "../../../types/Application";
import { Link } from "react-router-dom";
import { useDeleteApplicationMutation } from "../applicationSlice";
import useTranslate from "../../polyglot/useTranslate";
import { GridPaginationModel } from "@mui/x-data-grid";


type Props = {
  applications: Results | undefined;
  paginationModel: GridPaginationModel;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: GridPaginationModel) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function ApplicationTable({
  applications,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,
}: Props) {
  const translate = useTranslate("applications");
  const [deleteApplication, { isLoading }] = useDeleteApplicationMutation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Estado para controlar o modal de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedApplicationId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedApplicationId(null);
  };

  // const handleConfirmDelete = async () => {
  //   if (!selectedApplicationId) return;
  //   try {
  //     await deleteApplication({ id: selectedApplicationId }).unwrap();
  //     setAlertSeverity("success");
  //     setAlertMessage("Desconto apagado com sucesso.");
  //   } catch (error) {
  //     console.error("Falha ao tentar apagar o desconto.");
  //     setAlertSeverity("error");
  //     setAlertMessage("Falha ao tentar apagar o desconto..");
  //   } finally {
  //     setAlertOpen(true);
  //     handleCloseConfirm();
  //   }
  // };
  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/applications/detail/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      type: "string",
      width: 150,
      renderCell: renderNameCell,
    },
    { field: "user_name", headerName: "Nome", flex: 1, renderCell: renderNameCell },
    { field: "email", headerName: "E-mail", flex: 1, renderCell: renderNameCell },
    { field: "cpf", headerName: "CPF", flex: 1, renderCell: renderNameCell },
    { field: "enem", headerName: "ENEM", flex: 1, renderCell: renderNameCell },
  ];

  function mapDataToGridRows(data: Results) {
    const { data: applications } = data;
    return applications.map((application) => ({
      id: application.id,
      user_name: application?.form_data?.name,
      email: application?.form_data?.email,
      cpf: application?.form_data?.cpf,
      enem: application?.form_data?.enem,
      updated_at: application.updated_at,
      data: [],
      created_at: application.created_at,
    }));
  }

  const rows = applications ? mapDataToGridRows(applications) : [];
  const rowCount = applications?.meta.total || 0;

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
    </Box>
  );
}
