import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetConvocationListApplicationsQuery } from "./convocationListApplicationSlice";
import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../auth/authSlice";
import { ConvocationListApplicationTable } from "./components/ConvocationListApplicationTable";

export const ConvocationListApplicationList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 5000,
    rowsPerPage: [25, 50, 100],
  });

  const { data, isFetching, error } = useGetConvocationListApplicationsQuery(options);
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
          Inscrições em Listas de Convocação
        </Typography>
      </Paper>
      <ConvocationListApplicationTable
        convocationListApplications={data}
        isFetching={isFetching}
        handleSetPaginationModel={(page) => setOptions({ ...options, page })}
        handleFilterChange={(search) => setOptions({ ...options, search })}
      />
    </Box>
  );
};
