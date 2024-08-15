import React, { useState } from 'react';
import { useCreateEnemScoreMutation } from '../enemScores/enemScoreSlice';
import Papa from 'papaparse';
import { Box, Paper, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useSnackbar } from 'notistack';

const EnemScoreImport = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [createEnemScore] = useCreateEnemScoreMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<string[][] | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [importSummary, setImportSummary] = useState<{ success: number; failed: number } | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: false,
                delimiter: ";",
                complete: (results) => {
                    const filteredData = (results.data as string[][]).filter(row => row.some(cell => cell.trim() !== ""));
                    setParsedData(filteredData);
                },
            });
        }
    };

    const resetForm = () => {
        setIsLoading(false);
        setParsedData(null);
        setProgress(0);
        setErrors([]);
        setError(null);
        setImportSummary(null);
    };

    const handleConfirm = async () => {
        if (parsedData) {
            setIsLoading(true);
            setError(null);
            setErrors([]);
            setProgress(0);
            let successCount = 0;
            const errorMessages: string[] = [];

            for (let i = 0; i < parsedData.length; i++) {
                const row = parsedData[i];

                const isNotFound = row[1] === "Candidato não encontrado";

                const enemScore = {
                    enem: row[0],
                    original_scores: row.join(';'),
                    scores: {
                        name: isNotFound ? "N/A" : row[2],
                        cpf: isNotFound ? "N/A" : row[1],
                        birthdate: isNotFound ? "N/A" : row[13],
                        science_score: isNotFound ? "0" : row[3],
                        humanities_score: isNotFound ? "0" : row[4],
                        language_score: isNotFound ? "0" : row[5],
                        math_score: isNotFound ? "0" : row[6],
                        writing_score: isNotFound ? "0" : row[7],
                    },
                };

                try {
                    await createEnemScore(enemScore).unwrap();
                    successCount++;
                } catch (err) {
                    const message = `Erro ao importar a linha ${i + 1}: ${row[0]}`;
                    errorMessages.push(message);
                }

                setProgress(i + 1);

                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            setImportSummary({
                success: successCount,
                failed: errorMessages.length,
            });

            if (errorMessages.length > 0) {
                setErrors(errorMessages);
                enqueueSnackbar("Erro ao importar algumas linhas.", { variant: "error" });
            } else {
                enqueueSnackbar("Importação concluída com sucesso.", { variant: "success" });
            }

            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ padding: 4, width: '80%', maxWidth: 800 }}>
                <Box mb={2}>
                    <Typography variant="h4" align="center">Importar Notas do ENEM</Typography>
                </Box>
                <Box mb={2} display="flex" flexDirection="column" alignItems="center">
                    <input type="file" accept=".txt, .csv" onChange={handleFileUpload} />
                </Box>
                {parsedData && (
                    <Box mb={2}>
                        <Box mt={2} display="flex" justifyContent="center" gap={2}>
                            <Button variant="contained" color="primary" onClick={handleConfirm} disabled={isLoading}>
                                Confirmar Importação
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={resetForm} disabled={isLoading}>
                                Cancelar
                            </Button>
                        </Box>
                    </Box>
                )}

                {isLoading && (
                    <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                        <CircularProgress />
                        <Typography variant="body1" mt={2}>
                            Importando dados... {progress}/{parsedData?.length}
                        </Typography>
                    </Box>
                )}
                {error && <Typography variant="body1" color="error">{error}</Typography>}
                {errors.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="body1" color="error">Ocorreram erros ao importar algumas linhas:</Typography>
                        <ul>
                            {errors.map((errMsg, idx) => (
                                <li key={idx}>{errMsg}</li>
                            ))}
                        </ul>
                    </Box>
                )}
                {importSummary && (
                    <Box mt={2}>
                        <Alert severity="info">
                            <Typography variant="body1">
                                Importação concluída! Sucesso: {importSummary.success}, Falhas: {importSummary.failed}
                            </Typography>
                        </Alert>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export { EnemScoreImport };
