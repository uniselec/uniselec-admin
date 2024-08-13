import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridToolbar,
  ptBR,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Results } from "../../../types/ApplicationOutcome";
import { useDemoData } from '@mui/x-data-grid-generator';
import useTranslate from '../../polyglot/useTranslate';
import { useState } from "react";

type Props = {
  applicationOutcomes: Results | undefined;
  isFetching: boolean;
};

export function ApplicationOutcomeTable({
  applicationOutcomes,

  isFetching,


}: Props) {


  const translate = useTranslate('status');




  const columns: GridColDef[] = [

    {
      field: "id",
      headerName: "Id",
      type: "string",
      width: 100,
      renderCell: renderNameCell,
    },
    { field: "name", headerName: "Nome", flex: 1, renderCell: renderNameCell },
    { field: "enem", headerName: "N Inscrição ENEM", flex: 1, renderCell: renderNameCell },
    { field: "reason", headerName: "Motivo de Indeferimento", flex: 1, renderCell: renderNameCell },
    { field: "status", headerName: "Estado", flex: 1, renderCell: renderNameCell },
    { field: "classification_status", headerName: "Classificação", flex: 1, renderCell: renderNameCell },

  ];

  function mapDataToGridRows(data: Results) {
    const { data: applicationOutcomes } = data;
    return applicationOutcomes.map((applicationOutcome) => ({
      id: applicationOutcome.id,
      id2: applicationOutcome.id,
      reason: applicationOutcome.reason,
      enem: applicationOutcome?.application?.data?.enem,
      name: applicationOutcome?.application?.data?.name,
      status: translate(applicationOutcome?.status),
      classification_status: applicationOutcome?.classification_status != null ? translate(applicationOutcome?.classification_status) : "-",
      created_at: applicationOutcome.created_at,
    }));
  }


  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/application-outcomes/edit/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    );
  }


  const rows = applicationOutcomes ? mapDataToGridRows(applicationOutcomes) : [];
  const rowCount = applicationOutcomes?.meta.total || 0;

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
        disableColumnFilter={false}
        disableColumnSelector={true}
        disableDensitySelector={true}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}