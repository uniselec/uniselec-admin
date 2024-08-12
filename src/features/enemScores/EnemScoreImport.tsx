import React, { useState } from 'react';
import { useCreateEnemScoreMutation } from '../enemScores/enemScoreSlice';
import Papa from 'papaparse';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';

const EnemScoreImport = () => {
    const [createEnemScore] = useCreateEnemScoreMutation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<string[][] | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [progress, setProgress] = useState(0); // Estado para acompanhar o progresso

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: false,
                delimiter: ";",
                complete: (results) => {
                    setParsedData(results.data as string[][]);
                },
            });
        }
    };

    const handleConfirm = async () => {
        if (parsedData) {
            setIsLoading(true);
            setError(null);
            setErrors([]);
            setProgress(0);

            const errorMessages: string[] = [];

            for (let i = 0; i < parsedData.length; i++) {
                const row = parsedData[i];
                const enemScore = {
                    enem: row[0],
                    scores: {
                        name: row[2],
                        cpf: row[1],
                        science_score: row[3],
                        humanities_score: row[4],
                        language_score: row[5],
                        math_score: row[6],
                        writing_score: row[7],
                    },
                    original_scores: row.join(';'),
                };

                try {
                    await createEnemScore(enemScore).unwrap();
                } catch (err) {
                    const message = `Erro ao importar a linha ${i + 1}: ${row[0]}`;
                    errorMessages.push(message);
                }

                setProgress(i + 1); // Atualiza a contagem do progresso

                // Pausa de 100ms entre as requisições
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            if (errorMessages.length > 0) {
                setErrors(errorMessages);
            }

            setIsLoading(false);
            setParsedData(null); // Limpar os dados após o envio
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Paper sx={{ padding: 4, width: '80%', maxWidth: 800 }}>
                <Box mb={2}>
                    <Typography variant="h4" align="center">Create EnemScore</Typography>
                </Box>
                <Box mb={2} display="flex" flexDirection="column" alignItems="center">
                    <input type="file" accept=".txt, .csv" onChange={handleFileUpload} />
                </Box>
                {parsedData && (
                    <Box mb={2}>
                        <Typography variant="h6">Pré-visualização dos Dados</Typography>
                        <Box overflow="auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th>ENEM</th>
                                        <th>Nome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row[0]}</td>
                                            <td>{row[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                        <Box mt={2} display="flex" justifyContent="center" gap={2}>
                            <Button variant="contained" color="primary" onClick={handleConfirm}>
                                Confirmar Importação
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => setParsedData(null)}>
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
            </Paper>
        </Box>
    );
};

export { EnemScoreImport };
