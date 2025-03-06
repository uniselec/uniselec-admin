import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetDocumentsByProcessSelectionQuery, useUpdateDocumentStatusMutation, useDeleteDocumentMutation } from "./documentSlice";
import { Document } from "../../types/Document";
import { DocumentUploadModal } from "./DocumentUploadModal";

export const DocumentList = ({ processSelectionId }: { processSelectionId: string }) => {
  const { data: documentsData, isFetching, refetch } = useGetDocumentsByProcessSelectionQuery({ processSelectionId });
  const [updateDocumentStatus] = useUpdateDocumentStatusMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ id: string; newStatus: "draft" | "published" | "archived" } | null>(null);
  const [confirmStatusOpen, setConfirmStatusOpen] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);

  const handleDownload = (docPath: string) => {
    const url = `http://localhost:8000/storage/${docPath}`;
    window.open(url, "_blank");
  };

  const handleStatusChange = (docId: string, newStatus: "draft" | "published" | "archived") => {
    setPendingStatusUpdate({ id: docId, newStatus });
    setConfirmStatusOpen(true);
  };

  const confirmStatusUpdate = async () => {
    if (pendingStatusUpdate) {
      try {
        await updateDocumentStatus({ id: pendingStatusUpdate.id, status: pendingStatusUpdate.newStatus }).unwrap();
        refetch();
      } catch (error) {
        console.error(error);
      }
      setConfirmStatusOpen(false);
      setPendingStatusUpdate(null);
    }
  };

  const handleDelete = (docId: string) => {
    setPendingDeleteId(docId);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId) {
      try {
        await deleteDocument({ id: pendingDeleteId }).unwrap();
        refetch();
      } catch (error) {
        console.error(error);
      }
      setConfirmDeleteOpen(false);
      setPendingDeleteId(null);
    }
  };

  if (isFetching) return <Typography>Carregando documentos...</Typography>;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Documentos</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => setUploadOpen(true)}>
        Adicionar Documento
      </Button>
      <DocumentUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} processSelectionId={processSelectionId} />
      {documentsData && documentsData.data.length > 0 ? (
        documentsData.data.map((doc: Document) => (
          <Card key={doc.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                <a
                  href={`http://localhost:8000/storage/${doc.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {doc.title}
                </a>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Arquivo: {doc.filename}
              </Typography>
              {doc.description && (
                <Typography variant="body2" color="text.secondary">
                  {doc.description}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Criado em: {doc.created_at ? new Date(doc.created_at).toLocaleString() : "-"}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between" }}>
              <Box>
                <Button
                  startIcon={<DownloadIcon />}
                  variant="outlined"
                  size="small"
                  onClick={() => handleDownload(doc.path)}
                >
                  Download
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={doc.status || "draft"}
                    onChange={(e) =>
                      handleStatusChange(String(doc.id), e.target.value as "draft" | "published" | "archived")
                    }
                  >
                    <MenuItem value="draft">Rascunho</MenuItem>
                    <MenuItem value="published">Publicado</MenuItem>
                    <MenuItem value="archived">Arquivado</MenuItem>
                  </Select>
                </FormControl>
                <IconButton color="error" onClick={() => handleDelete(String(doc.id))}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        ))
      ) : (
        <Typography>Nenhum documento cadastrado.</Typography>
      )}
      <Dialog open={confirmStatusOpen} onClose={() => setConfirmStatusOpen(false)}>
        <DialogTitle>Confirmar Atualização</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja alterar o status deste documento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmStatusOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmStatusUpdate} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este documento?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
