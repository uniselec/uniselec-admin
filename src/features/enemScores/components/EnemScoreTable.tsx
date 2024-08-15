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
import { Results } from "../../../types/EnemScore";

type Props = {
  enemScores: Results | undefined;
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

export function EnemScoreTable({
  enemScores,
  isFetching,
}: Props) {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      type: "string",
      width: 100,
      renderCell: renderNameCell,
    },
    { field: "name", headerName: "Nome", width: 300, renderCell: renderNameCell },
    { field: "enem", headerName: "Inscrição ENEM", width: 150, renderCell: renderNameCell },
    { field: "original_score", headerName: "Score INEP", flex: 1, renderCell: renderNameCell },
  ];

  function mapDataToGridRows(data: Results) {
    const { data: enemScores } = data;
    return enemScores.map((enemScore) => ({
      id: enemScore.id,
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
