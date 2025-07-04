import React from 'react'
import { ApplicationCSVDownload } from '../applications/ApplicationCSVDownload';
import { EnemScoreImport } from '../enemScores/EnemScoreImport';
import { Card, CardContent, Grid } from '@mui/material';
import { GenerateOutcomes } from './GenerateOutcomes';
import GenerateLists from './GenerateLists';

const ApplicationOutcomesStep = () => {

    return (
        <div>
            <Card>
                <CardContent>
                    <h2>Processamento dos Resultados</h2>
                    <p>
                        Aqui é possível gerar o processamento dos resultados e classificação.
                    </p>

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
