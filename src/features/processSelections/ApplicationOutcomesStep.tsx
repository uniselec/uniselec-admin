import React from 'react'
import { useParams } from "react-router-dom";
import { ApplicationCSVDownload } from '../applications/ApplicationCSVDownload';
import { EnemScoreImport } from '../enemScores/EnemScoreImport';
import { Card, CardContent, Grid, Typography } from '@mui/material';
import { GenerateOutcomes } from './GenerateOutcomes';
import GenerateLists from './GenerateLists';
import { useGetProcessSelectionQuery } from './processSelectionSlice';

const ApplicationOutcomesStep = () => {

    const { id: processSelectionId } = useParams<{ id: string }>();
    const { data: processSelection, isLoading } = useGetProcessSelectionQuery({ id: processSelectionId! });

    return (
        <div>
            <Card>
                <CardContent>
                    <h2>Processamento dos Resultados</h2>
                    <p>Aqui é possível gerar o processamento dos resultados e classificação.</p>
                    <Typography>Data do último processamento: {processSelection?.data?.last_applications_processed_at}</Typography>
                </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                    <GenerateOutcomes />
                </Grid>
                <Grid item xs={12} md={6}>
                    <GenerateLists />
                </Grid>
            </Grid>
        </div>
    );
}



export { ApplicationOutcomesStep };
