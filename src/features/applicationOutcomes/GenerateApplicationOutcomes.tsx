import { Box, Paper, Typography, Button } from '@mui/material';
import React from 'react';
import { useGenerateApplicationOutcomeMutation, useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { useSnackbar } from "notistack";
import { Link } from 'react-router-dom';
import { CategoryCards } from './CategoryCards';

const GenerateApplicationOutcomes = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [generateApplications, { isLoading }] = useGenerateApplicationOutcomeMutation();
    const { data: outcomesData } = useGetApplicationOutcomesQuery({});

    const hasApplicationOutcomes = outcomesData?.data && outcomesData.data.length > 0;

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
                        padding: '1.5cm', // Adiciona margem de 1.5 cm ao redor
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontSize: '24px' }}>
                        Processar Resultados
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ fontSize: '14px' }}>
                        Apenas Clique no Botão e Aguarde a Mensagem de Sucesso!
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2, // Espaçamento entre os botões
                            flexWrap: 'wrap',
                            justifyContent: 'center', // Centraliza os botões
                            mt: 2, // Margem superior para afastar dos textos
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            sx={{ fontSize: '12px' }} // Ajusta o tamanho da fonte dos botões
                        >
                            {isLoading ? "Processando..." : "Gerar Resultados"}
                        </Button>

                        {hasApplicationOutcomes && (
                            <>
                                <Button
                                    component={Link}
                                    to="/deferidos-indeferidos"
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ fontSize: '12px' }} // Ajusta o tamanho da fonte dos botões
                                >
                                    Lista de Deferidos e Indeferidos
                                </Button>
                                <Button
                                    component={Link}
                                    to="/application-outcomes"
                                    variant="outlined"
                                    color="error"
                                    sx={{ fontSize: '12px' }} // Ajusta o tamanho da fonte dos botões
                                >
                                    Pendências
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
                {hasApplicationOutcomes && <CategoryCards />}
            </Paper>
        </Box>
    );
}

export { GenerateApplicationOutcomes };
