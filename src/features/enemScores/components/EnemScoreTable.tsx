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
import { Results } from "../../../types/EnemScore";
import { useDemoData } from '@mui/x-data-grid-generator';

type Props = {
  enemScores: Results | undefined;
  // paginationModel: object;
  isFetching: boolean;
  // handleSetPaginationModel: (paginateModel: { page: number, pageSize: number }) => void;
  // handleFilterChange: (filterModel: GridFilterModel) => void;
};

export function EnemScoreTable({
  enemScores,
  // paginationModel,
  isFetching,
  // handleSetPaginationModel,
  // handleFilterChange,

}: Props) {
  // const { data  } = useDemoData({
  //   dataSet: 'Commodity',
  //   rowLength: 100,
  //   maxColumns: 6,
  // });



  const columns: GridColDef[] = [

    {
      field: "id",
      headerName: "Id",
      type: "string",
      width: 150,
      renderCell: renderNameCell,
    },
    { field: "id2", headerName: "ID", width: 100, renderCell: renderNameCell },
    { field: "name", headerName: "Nome", width: 300, renderCell: renderNameCell },
    { field: "enem", headerName: "Inscrição ENEM", width: 150, renderCell: renderNameCell },
    { field: "original_score", headerName: "Score INEP", flex: 1, renderCell: renderNameCell },
  ];

  function mapDataToGridRows(data: Results) {
    const { data: enemScores } = data;
    return enemScores.map((enemScore) => ({
      id: enemScore.id,
      id2: enemScore.id,
      enem: enemScore.enem,
      name: enemScore?.scores?.name,
      original_score: enemScore.original_scores,
      created_at: enemScore.created_at,
    }));
  }


  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/enem-scores/edit/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    );
  }


  const rows = enemScores ? mapDataToGridRows(enemScores) : [];
  const rowCount = enemScores?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", height: "60vh", width: '100%' }}>
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