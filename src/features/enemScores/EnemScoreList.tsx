import { Box, Typography } from "@mui/material";
import {
  useGetEnemScoresQuery,
} from "./enemScoreSlice";

import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { EnemScoreTable } from "./components/EnemScoreTable";
interface PaginationModel {
  pageSize: number;
  page: number;
}

export const EnemScoreList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });
  const { data, isFetching, error } = useGetEnemScoresQuery(options);

  function setPaginationModel(paginateModel:{ page: number, pageSize: number }){
    setOptions({ ...options, page: paginateModel.page + 1, perPage: paginateModel.pageSize});
  }
  function handleFilterChange(filterModel: GridFilterModel) {

    if (!filterModel.quickFilterValues?.length) {
      return setOptions({ ...options, search: "" });
    }
    const search = filterModel.quickFilterValues.join(" ");
    setOptions({ ...options, search });
  }

  if (error) {
    return <Typography>Error fetching enemScores</Typography>;
  }

  return (
    <Box sx={{ mt: 0, mb: 0 }}>
      <h3 className="pb-4 mb-2 fst-italic border-bottom">
          Usuários
      </h3>
      <EnemScoreTable
        enemScores={data}
        isFetching={isFetching}
        paginationModel={{
          pageSize: 25,
          page: 0,
        }}
        handleSetPaginationModel={setPaginationModel}
        handleFilterChange={handleFilterChange}
      />
    </Box>
  );
};