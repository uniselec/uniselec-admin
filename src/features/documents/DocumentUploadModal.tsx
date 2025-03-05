import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useCreateDocumentMutation } from "./documentSlice";

export const DocumentUploadModal = ({ open, onClose, processSelectionId }: { open: boolean; onClose: () => void; processSelectionId: string }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [createDocument, { isLoading }] = useCreateDocumentMutation();

  const handleSubmit = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("process_selection_id", processSelectionId);

    await createDocument(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Documento</DialogTitle>
      <DialogContent>
        <TextField label="Título" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} disabled={isLoading} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
