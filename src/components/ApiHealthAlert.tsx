import { Alert, Box } from "@mui/material";
import { useGetApiHealthcheckQuery } from "../features/api/healthCheckSlice";

export function ApiHealthAlert() {
  const { data, error } = useGetApiHealthcheckQuery(undefined);

  if (error) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="error">
          Falha na conexão com a API. Por favor, abra um chamado.
        </Alert>
      </Box>
    );
  }

  return null;

}
