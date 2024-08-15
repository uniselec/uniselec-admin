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
import { GridToolbarContainer } from "@mui/x-data-grid";
import { GridToolbarExport } from "@mui/x-data-grid";

type Props = {
  users: Results | undefined;
  isFetching: boolean;

};
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}
export function UserTable({
  users,
  isFetching,

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




  const rows = users ? mapDataToGridRows(users) : [];
  const rowCount = users?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", height: 450, width: '100%' }}>
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