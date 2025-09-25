import { Box, Typography, Button, Paper } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetConvocationListsQuery } from "./convocationListSlice";
import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../auth/authSlice";
import { ConvocationListTable } from "./components/ConvocationListTable";

export const ConvocationListList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 25,
    rowsPerPage: [25, 50, 100],
  });
  const { id: processSelectionId } = useParams<{ id: string }>();
  const { data, isFetching, error } = useGetConvocationListsQuery(options);
  const navigate = useNavigate();


  function setPaginationModel(paginateModel: { page: number; pageSize: number }) {
    setOptions({ ...options, page: paginateModel.page + 1, perPage: paginateModel.pageSize });
  }

  function handleFilterChange(filterModel: GridFilterModel) {
    if (!filterModel.quickFilterValues?.length) {
      return setOptions({ ...options, search: "" });
    }
    const search = filterModel.quickFilterValues.join(" ");
    setOptions({ ...options, search });
  }



  if (error) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h6" color="error">
          Erro ao carregar a lista
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Listas de Convocação
        </Typography>

        <Button
          component={Link}
          to={`/process-selections/${processSelectionId}/convocation-lists/create`}
          variant="contained"
          color="primary"
        >
          Criar Lista de Convocação
        </Button>

      </Paper>
      <ConvocationListTable
        convocationLists={data}
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
