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
import { Results } from "../../../types/ApplicationOutcome";
import { Link } from "react-router-dom";
import useTranslate from "../../polyglot/useTranslate";
import { GridPaginationModel } from "@mui/x-data-grid";


type Props = {
  applicationOutcomes: Results | undefined;
  paginationModel: GridPaginationModel;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: GridPaginationModel) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function ApplicationOutcomeTable({
  applicationOutcomes,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,
}: Props) {
  const translate = useTranslate("applicationOutcomes");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  // Estado para controlar o modal de confirmação
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedApplicationOutcomeId, setSelectedApplicationOutcomeId] = useState<string | null>(null);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleOpenConfirm = (id: string) => {
    setSelectedApplicationOutcomeId(id);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedApplicationOutcomeId(null);
  };


  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/application-outcomes/detail/${rowData.id}`}
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
    const { data: applicationOutcomes } = data;
    return applicationOutcomes.map((applicationOutcome) => ({
      id: applicationOutcome.id,
      // user_name: applicationOutcome?.form_data?.name,
      // email: applicationOutcome?.form_data?.email,
      // cpf: applicationOutcome?.form_data?.cpf,
      // enem: applicationOutcome?.form_data?.enem,
      updated_at: applicationOutcome.updated_at,
      data: [],
      created_at: applicationOutcome.created_at,
    }));
  }

  const rows = applicationOutcomes ? mapDataToGridRows(applicationOutcomes) : [];
  const rowCount = applicationOutcomes?.meta.total || 0;

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
