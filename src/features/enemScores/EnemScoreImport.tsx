// features/enemScores/EnemScoreImport.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useImportEnemScoresMutation } from "./enemScoreSlice";

export const EnemScoreImport: React.FC = () => {
  const { id: processSelectionId } = useParams<{ id: string }>();

  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<null | {
    processed: number;
    created: number;
    updated: number;
    not_found: number;
    errors: number;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const [importScores, { isLoading }] = useImportEnemScoresMutation();

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setSummary(null);

    try {
      const res = await importScores({
        file,
        processSelectionId: Number(processSelectionId),
      }).unwrap();
      setSummary(res);
    } catch (e: any) {
      setError(e?.data?.message || "Erro ao importar notas.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          2. Faça upload das notas obtidas no sistema do INEP
        </Typography>

        <Box mt={2}>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </Box>

        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="contained"
            disabled={!file || isLoading}
            onClick={handleUpload}
          >
            Enviar Arquivo
          </Button>
          {isLoading && <CircularProgress size={24} />}
        </Box>

        {summary && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Processadas: {summary.processed} &nbsp;|&nbsp; Criadas:
            {summary.created} &nbsp;|&nbsp; Atualizadas: {summary.updated}
            &nbsp;|&nbsp; Não encontradas: {summary.not_found}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
