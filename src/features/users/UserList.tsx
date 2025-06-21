import { Box, Typography, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetUsersQuery } from "./userSlice";
import { useState, useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../auth/authSlice";
import { UserTable } from "./components/UserTable";
import { FilterComponent } from "./components/FilterCompnent";
import DownloadCsvButton from "./components/DownloadCsvButton";

export const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extrai “status” da URL (ex.: /users?status=pending)
  const params = new URLSearchParams(location.search);
  const statusFromUrl = params.get("status") || "";

  // Garante que “filters” seja sempre Record<string, string>
  const initialFilters: Record<string, string> = statusFromUrl
    ? { status: statusFromUrl }
    : {};

  const [options, setOptions] = useState<{
    page: number;
    perPage: number;
    search: string;
    filters: Record<string, string>;
  }>({
    page: 1,
    perPage: 25,
    search: "",
    filters: initialFilters,
  });

  // Se mudar o query string na URL, atualiza options.filters
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const newStatus = q.get("status") || "";
    const newFilters: Record<string, string> = newStatus ? { status: newStatus } : {};

    setOptions((prev) => ({
      ...prev,
      filters: newFilters,
      page: 1,
    }));
  }, [location.search]);

  const { data, isFetching, error } = useGetUsersQuery(options);
  const userAuth = useAppSelector(selectAuthUser);

  function setPaginationModel(model: { page: number; pageSize: number }) {
    setOptions((prev) => ({
      ...prev,
      page: model.page + 1,
      perPage: model.pageSize,
    }));
  }

  function handleFilterChange(filters: Record<string, string>) {
    setOptions((prev) => ({
      ...prev,
      filters,
      page: 1,
    }));

    // Atualiza a URL para manter “status” sincronizado
    const searchParams = new URLSearchParams(location.search);
    if (filters.status) {
      searchParams.set("status", filters.status);
    } else {
      searchParams.delete("status");
    }
    navigate({ search: searchParams.toString() });
  }
  const setQuickSearch = (value: string) => {
    setOptions((prev) => ({ ...prev, search: value, page: 1 }));
  };

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
      <Paper
        sx={{
          p: 3,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Candidatos
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FilterComponent onFilterChange={handleFilterChange} />
          {/* <DownloadCsvButton filters={options.filters} /> */}
        </Box>
      </Paper>

      <UserTable
        users={data}
        isFetching={isFetching}
        paginationModel={{
          pageSize: options.perPage,
          page: options.page - 1,
        }}
        setQuickSearch={setQuickSearch}
        handleSetPaginationModel={setPaginationModel}
      />
    </Box>
  );
};
