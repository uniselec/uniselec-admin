import { Box, Paper, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";
import { DocumentList } from "../documents/DocumentList";
import { DocumentUploadModal } from "../documents/DocumentUploadModal";

export const ProcessSelectionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: processSelection, isFetching } = useGetProcessSelectionQuery({ id: id! });

  if (isFetching) return <Typography>Carregando...</Typography>;
  if (!processSelection) return <Typography>Processo Seletivo não encontrado.</Typography>;

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h4">{processSelection.data.name}</Typography>
        <Typography>{processSelection.data.description}</Typography>
        <Typography>Tipo: {processSelection.data.type}</Typography>
        <Typography>Status: {processSelection.data.status}</Typography>
        <Typography>Início: {processSelection.data.start_date}</Typography>
        <Typography>Fim: {processSelection.data.end_date}</Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/process-selections/edit/${id}`)}
        >
          Editar Processo Seletivo
        </Button>
      </Paper>

      <DocumentList processSelectionId={id!} />
    </Box>
  );
};
