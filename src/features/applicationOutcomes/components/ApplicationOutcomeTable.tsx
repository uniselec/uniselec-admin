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

type Props = {
  applicationOutcomes: Results | undefined;
  paginationModel: object;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: { page: number, pageSize: number }) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function ApplicationOutcomeTable({
  applicationOutcomes,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,

}: Props) {
  const translate = useTranslate('status');
  const { data  } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });



  const columns: GridColDef[] = [

    {
      field: "id",
      headerName: "Id",
      type: "string",
      width: 150,
      renderCell: renderNameCell,
    },
    { field: "id2", headerName: "ID", width: 100, renderCell: renderNameCell },
    { field: "name", headerName: "Nome", flex: 1, renderCell: renderNameCell },
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
        {...data}
        initialState={{
          ...data.initialState,
          pagination: {
            ...data.initialState?.pagination,
            paginationModel: paginationModel,
          },
        }}
        onPaginationModelChange={handleSetPaginationModel}
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
          },
        }}
        onFilterModelChange={handleFilterChange}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}