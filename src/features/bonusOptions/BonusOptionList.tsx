import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetBonusOptionsQuery } from "./bonusOptionSlice";
import { GridFilterModel } from "@mui/x-data-grid";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../auth/authSlice";
import { BonusOptionTable } from "./components/BonusOptionTable";

export const BonusOptionList = () => {
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 25,
    rowsPerPage: [25, 50, 100],
  });

  const { data, isFetching, error } = useGetBonusOptionsQuery(options);
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
          Critérios de Bonificação
        </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/bonus-options/create")}
          >
            Incluir Novo
          </Button>
      </Paper>
      <BonusOptionTable
        admissionCategories={data}
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
