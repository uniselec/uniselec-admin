import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  ptBR,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Results } from "../../../types/Application";

type Props = {
  applications: Results | undefined;
  isFetching: boolean;
};

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'space-between' }}>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export function ApplicationTable({
  applications,
  isFetching,
}: Props) {
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
      user_name: application?.user?.name,
      email: application?.user?.email,
      cpf: application?.user?.cpf,
      enem: application?.data?.enem,
      updated_at: application.updated_at,
      data: application.data,
      created_at: application.created_at,
    }));
  }

  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/applications/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    );
  }

  const rows = applications ? mapDataToGridRows(applications) : [];
  const rowCount = applications?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", height: "60vh", width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        filterMode="client"
        rowCount={rowCount}
        loading={isFetching}
        paginationMode="client"
        checkboxSelection={false}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        slots={{ toolbar: CustomToolbar }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}
