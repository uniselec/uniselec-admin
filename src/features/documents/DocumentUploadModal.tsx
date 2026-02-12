import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useCreateDocumentMutation } from "./documentSlice";
import { useSnackbar } from "notistack";

export const DocumentUploadModal = ({ open, onClose, processSelectionId }: { open: boolean; onClose: () => void; processSelectionId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [createDocument] = useCreateDocumentMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    formData.append("process_selection_id", processSelectionId);
    try {
      await createDocument(formData).unwrap();
      onClose();
      setTitle("");
      setDescription("");
      setFile(null);
      enqueueSnackbar("Documento adicionado com sucesso", { variant: "success" });
    } catch (error: any) {
      console.error("Error sending file: ", error);
      const errorMessage = error?.data?.message || "Erro ao adicionar o documento";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Documento</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Descrição"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginTop: "16px" }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};
