import React, { useEffect, useRef, useState } from 'react'
import { json, useParams } from "react-router-dom";
import { ApplicationCSVDownload } from '../applications/ApplicationCSVDownload';
import { EnemScoreImport } from '../enemScores/EnemScoreImport';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { GenerateOutcomes } from './GenerateOutcomes';
import GenerateLists from './GenerateLists';
import { GenerateLists2 } from './GenerateLists2';
import { useGetProcessSelectionQuery, useLazyExportEnemOutcomesCsvQuery, useLazyExportEnemScoresCsvQuery } from './processSelectionSlice';
import { useGetEnemScoresSummaryQuery } from '../enemScores/enemScoreSlice';
import { useGetApplicationOutcomesQuery } from '../applicationOutcomes/applicationOutcomeSlice';

const ApplicationOutcomesStep = () => {

    const { id: processSelectionId } = useParams<{ id: string }>();
    const [options, setOptions] = useState({
        page: 1,
        perPage: 25,
        search: "",
        filters: { process_selection_id: processSelectionId! } as Record<string, string>,
    });

    const { data: outcomesData, isFetching: isFetchingOutcomeData } = useGetApplicationOutcomesQuery(options);

    const {
        data: enemScoresSummary,
        isLoading: isLoadingSummary,
        isFetching: isFetchingSummary,
        isError: isErrorSummary
    } = useGetEnemScoresSummaryQuery({ processSelectionId: Number(processSelectionId) });

    // consulta a seleção
    const { data: processSelection } = useGetProcessSelectionQuery({ id: processSelectionId! });

    // para exportar notas
    const [triggerExportNotes, { data: notesBlob, isFetching: fetchingNotes }] =
        useLazyExportEnemScoresCsvQuery();
    const lastNotesRef = useRef<Blob | null>(null);

    // para exportar resultados (outcomes)
    const [triggerExportOutcomes, { data: outcomesBlob, isFetching: fetchingOutcomes }] =
        useLazyExportEnemOutcomesCsvQuery();
    const lastOutcomesRef = useRef<Blob | null>(null);

    // efeito para download das notas
    useEffect(() => {
        if (!notesBlob || !processSelectionId) return;
        if (notesBlob === lastNotesRef.current) return;
        lastNotesRef.current = notesBlob;

        const url = window.URL.createObjectURL(notesBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inscricoes-notas-${processSelectionId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }, [notesBlob, processSelectionId]);

    // efeito para download dos resultados
    useEffect(() => {
        if (!outcomesBlob || !processSelectionId) return;
        if (outcomesBlob === lastOutcomesRef.current) return;
        lastOutcomesRef.current = outcomesBlob;

        const url = window.URL.createObjectURL(outcomesBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inscricoes-resultados-${processSelectionId}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }, [outcomesBlob, processSelectionId]);

    const handleExportNotes = () => {
        if (!processSelectionId) return;
        triggerExportNotes({ processSelectionId, enemYear: undefined });
    };

    const handleExportOutcomes = () => {
        if (!processSelectionId) return;
        triggerExportOutcomes({ processSelectionId, enemYear: undefined });
    };

    return (
        <div>
            <Card>
                <CardContent>
                    <h2>Processamento dos Resultados</h2>
                    <p>Aqui é possível gerar o processamento dos resultados e classificação.</p>
                    <Typography>
                        Data do último processamento: {processSelection?.data?.last_applications_processed_at ? new Date(processSelection.data.last_applications_processed_at).toLocaleString() : "-"}
                    </Typography>

                    <Box
                        mt={2}
                        display="flex"
                        gap={2}
                        flexWrap="wrap"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleExportNotes}
                            disabled={enemScoresSummary?.total_with_score === 0}
                        >
                            {fetchingNotes ? 'Gerando CSV...' : 'CSV com Notas'}
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleExportOutcomes}
                            disabled={(enemScoresSummary && enemScoresSummary.total_with_score === 0) ||  outcomesData?.meta?.total === 0}
                        >
                            {fetchingOutcomes ? 'Gerando CSV...' : 'CSV com Resultados'}
                        </Button>
                    </Box>
                    {enemScoresSummary && enemScoresSummary.total_with_score === 0 && (

                        <Typography variant="h5" gutterBottom>
                            <>Volte à etapa anterior para adicionar as notas.</>
                        </Typography>

                    )}
                </CardContent>
            </Card>

            {enemScoresSummary && enemScoresSummary.total_with_score > 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>

                    <Grid item xs={12} md={12}>
                        <GenerateOutcomes />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <GenerateLists />
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <GenerateLists2 />
                    </Grid>
                </Grid>
            )}

        </div>
    );
}



export { ApplicationOutcomesStep };
