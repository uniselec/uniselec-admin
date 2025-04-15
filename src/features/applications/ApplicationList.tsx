import { Box, Typography } from "@mui/material";
import {
  useGetApplicationsQuery,
} from "./applicationSlice";

import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
interface PaginationModel {
  pageSize: number;
  page: number;
}

export const ApplicationList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 25,
    rowsPerPage: [25, 50, 100],
  });
  const { data, isFetching, error } = useGetApplicationsQuery(options);

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
    return <Typography>Error fetching applications</Typography>;
  }

  return (
    <Box>
      O Processamento ainda está em desenvolvimento.
      <ApplicationTable
        applications={data}
        isFetching={isFetching}
        // paginationModel={{
        //   pageSize: 25,
        //   page: 0,
        // }}
        // handleSetPaginationModel={setPaginationModel}
        // handleFilterChange={handleFilterChange}
      />
    </Box>
  );
};