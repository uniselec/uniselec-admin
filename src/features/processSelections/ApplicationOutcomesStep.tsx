import React from 'react'
import { ApplicationCSVDownload } from '../applications/ApplicationCSVDownload';
import { EnemScoreImport } from '../enemScores/EnemScoreImport';
import { Grid } from '@mui/material';
import { GenerateOutcomes } from './GenerateOutcomes';

const ApplicationOutcomesStep = () => {

    return (
        <div>
            <h2>Processamento dos Resultados</h2>
                 <p>
                   Aqui é possível gerar o processamento dos resultados e classificação.
                 </p>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <GenerateOutcomes />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EnemScoreImport />
                </Grid>
            </Grid>
        </div>
    );
}



export { ApplicationOutcomesStep };
