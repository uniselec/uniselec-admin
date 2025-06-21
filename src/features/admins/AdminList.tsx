import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetAdminsQuery } from "./adminSlice";
import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../auth/authSlice";
import { AdminTable } from "./components/AdminTable";

export const AdminList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 25,
    rowsPerPage: [25, 50, 100],
  });

  const { data, isFetching, error } = useGetAdminsQuery(options);
  const navigate = useNavigate();
  const userAuth = useAppSelector(selectAuthUser);

  const isSuperUser = userAuth.role === "super_user";
  const isPromoter = userAuth.role === "promoter";
  const isCCSBilhetica = userAuth.role === "ccs_bilhetica";

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
          Erro ao carregar a lista de operadores.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Administrador
        </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admins/create")}
          >
            Incluir Novo
          </Button>
      </Paper>
      <AdminTable
        admins={data}
        isFetching={isFetching}
        paginationModel={{
          pageSize: options.perPage,
          page: options.page - 1,
        }}
        handleSetPaginationModel={setPaginationModel}
        handleFilterChange={handleFilterChange}
      />
    </Box>
  );
};
