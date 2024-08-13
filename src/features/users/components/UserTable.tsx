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
import { Results } from "../../../types/User";
import { useDemoData } from '@mui/x-data-grid-generator';

type Props = {
  users: Results | undefined;
  // paginationModel: object;
  isFetching: boolean;
  // handleSetPaginationModel: (paginateModel: { page: number, pageSize: number }) => void;
  // handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function UserTable({
  users,
  // paginationModel,
  isFetching,
  // handleSetPaginationModel,
  // handleFilterChange,

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
      width: 100
    },
    { field: "name", headerName: "Nome", flex: 1 },
    { field: "email", headerName: "E-mail", flex: 1 },
    { field: "cpf", headerName: "CPF", flex: 1 }
  ];

  function mapDataToGridRows(data: Results) {
    const { data: users } = data;
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      created_at: user.created_at,
    }));
  }


  // function renderNameCell(rowData: GridRenderCellParams) {
  //   return (
  //     <Link
  //       style={{ textDecoration: "none" }}
  //       to={`/users/edit/${rowData.id}`}
  //     >
  //       <Typography color="primary">{rowData.value}</Typography>
  //     </Link>
  //   );
  // }


  const rows = users ? mapDataToGridRows(users) : [];
  const rowCount = users?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", height: 450, width: '100%' }}>
      <DataGrid
        // {...data}
        // initialState={{
        //   ...data.initialState,
        //   pagination: {
        //     ...data.initialState?.pagination,
        //     paginationModel: paginationModel,
        //   },
        // }}
        // onPaginationModelChange={handleSetPaginationModel}
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
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        // onFilterModelChange={handleFilterChange}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
      />
    </Box>
  );
}