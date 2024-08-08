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
import { Application, Results } from "../../../types/Application";
import { useDemoData } from '@mui/x-data-grid-generator';

type Props = {
  applications: Results | undefined;
  paginationModel: object;
  isFetching: boolean;
  handleSetPaginationModel: (paginateModel: { page: number, pageSize: number }) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function ApplicationTable({
  applications,
  paginationModel,
  isFetching,
  handleSetPaginationModel,
  handleFilterChange,

}: Props) {
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
    { field: "user_name", headerName: "Nome", flex: 1, renderCell: renderNameCell },
    { field: "email", headerName: "E-mail", flex: 1, renderCell: renderNameCell },
    { field: "cpf", headerName: "CPF", flex: 1, renderCell: renderNameCell },
    { field: "enem", headerName: "ENEM", flex: 1, renderCell: renderNameCell },
  ];

  function mapDataToGridRows(data: Results) {
    const { data: applications } = data;


    return applications.map((application) => {

      const applicationShow = {
        id: application.id,
        id2: application.id,
        user_name: application?.user?.name,
        email: application?.user?.email,
        cpf: application?.user?.cpf,
        enem: application?.data?.enem,
        updated_at: application.updated_at,
        data: application.data,
        created_at: application.created_at,

      };
      return applicationShow;
    });
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
    <Box sx={{ display: "flex", height: 450, width: '100%' }}>
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
            showQuickFilter: false,
          },
        }}
        onFilterModelChange={handleFilterChange}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}