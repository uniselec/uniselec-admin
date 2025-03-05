import { Box, Paper, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useGetDocumentsByProcessSelectionQuery } from "./documentSlice";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { Document } from "../../types/Document";

export const DocumentList = ({ processSelectionId }: { processSelectionId: string }) => {
  const { data: documents, isFetching } = useGetDocumentsByProcessSelectionQuery({ processSelectionId });
  const [open, setOpen] = useState(false);

  if (isFetching) return <Typography>Carregando documentos...</Typography>;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5">Documentos</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
        Adicionar Documento
      </Button>

      <DocumentUploadModal open={open} onClose={() => setOpen(false)} processSelectionId={processSelectionId} />

      {documents?.data.length ? (
        documents.data.map((doc: Document) => (
          <Box key={doc.id} sx={{ mt: 2, p: 2, bgcolor: "grey.100" }}>
            <Typography>{doc.title}</Typography>
          </Box>
        ))
      ) : (
        <Typography>Nenhum documento cadastrado.</Typography>
      )}
    </Paper>
  );
};
