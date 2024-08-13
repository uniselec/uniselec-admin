import { Box, Paper, Typography, Button } from '@mui/material';
import React from 'react';
import { useGenerateApplicationOutcomeMutation } from "./applicationOutcomeSlice";
import { useSnackbar } from "notistack";

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
                    >
                        {isLoading ? "Processando..." : "Gerar Resultados"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export { GenerateApplicationOutcomes };
