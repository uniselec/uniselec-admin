import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import React from 'react';
import { useGenerateApplicationOutcomeMutation, useGenerateApplicationOutcomeWithoutPendingMutation, useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { useGetEnemScoresQuery } from "../enemScores/enemScoreSlice";
import { useSnackbar } from "notistack";
import { Link } from 'react-router-dom';
import { CategoryCards } from './CategoryCards';

const GenerateApplicationOutcomes = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [generateApplications, { isLoading }] = useGenerateApplicationOutcomeMutation();

    const { data: outcomesData, isFetching: isFetchingOutcomeData } = useGetApplicationOutcomesQuery({});
    const { data: enemScoresData, isFetching: isFetchingEnemScore } = useGetEnemScoresQuery({});

    const hasApplicationOutcomes = outcomesData?.data && outcomesData.data.length > 0;
    const hasEnemScores = enemScoresData?.data && enemScoresData.data.length > 0;

    async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            await generateApplications().unwrap();
            enqueueSnackbar("Resultados processados com sucesso!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Erro ao processar os resultados!", { variant: "error" });
        }
    }


    if (isFetchingOutcomeData || isFetchingEnemScore) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Paper sx={{ padding: 4, textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                        Carregando...
                    </Typography>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Paper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1.5cm',
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontSize: '24px' }}>
                        Processar Resultados
                    </Typography>
                    {!hasEnemScores ? (
                        <Typography variant="body1" sx={{ fontSize: '14px', textAlign: 'center' }}>
                            Primeiro deve Inserir as Notas do ENEM.
                            <Button
                                component={Link}
                                to="/import-enem-score"
                                variant="text"
                                color="primary"
                                sx={{ fontSize: '14px', textDecoration: 'underline' }}
                            >
                                Importar Notas do ENEM
                            </Button>
                        </Typography>
                    ) : (
                        <>
                            <Typography variant="body1" gutterBottom sx={{ fontSize: '14px' }}>
                                Apenas Clique no Botão e Aguarde a Mensagem de Sucesso!
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    mt: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={true}
                                    sx={{ fontSize: '12px' }}
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
                                            sx={{ fontSize: '12px' }}
                                        >
                                            Ver Resultado
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </>
                    )}
                </Box>
                {/* {hasApplicationOutcomes && <CategoryCards />} */}
            </Paper>
        </Box>
    );
}

export { GenerateApplicationOutcomes };
