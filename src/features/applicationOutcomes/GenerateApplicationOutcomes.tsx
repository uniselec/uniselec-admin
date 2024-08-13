import { Box, Paper, Typography, Button } from '@mui/material';
import React from 'react';
import { useGenerateApplicationOutcomeMutation } from "./applicationOutcomeSlice";
import { useSnackbar } from "notistack";
import { Link } from 'react-router-dom';

const GenerateApplicationOutcomes = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [generateApplications, { isLoading }] = useGenerateApplicationOutcomeMutation();

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            await generateApplications().unwrap();
            enqueueSnackbar("Resultados processados com sucesso!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Erro ao processar os resultados!", { variant: "error" });
        }
    }

    return (
        <Box>
            <Paper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    p={5}
                >
                    <Typography variant="h4" gutterBottom>
                        Processar Resultados
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Apenas Clique no Botão e Aguarde a Mensagem de Sucesso!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        sx={{ mb: 2 }}
                    >
                        {isLoading ? "Processando..." : "Gerar Resultados"}
                    </Button>
                    <Button
                        component={Link}
                        to="/listas-resultado"
                        variant="outlined"
                        color="primary"
                        sx={{ mb: 1 }}
                    >
                        Listas Resultado
                    </Button>
                    <Button
                        component={Link}
                        to="/deferidos-indeferidos"
                        variant="outlined"
                        color="secondary"
                        sx={{ mb: 1 }}
                    >
                        Lista de Deferidos e Indeferidos
                    </Button>
                    <Button
                        component={Link}
                        to="/application-outcomes"
                        variant="outlined"
                        color="error"
                    >
                        Pendências
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export { GenerateApplicationOutcomes };
