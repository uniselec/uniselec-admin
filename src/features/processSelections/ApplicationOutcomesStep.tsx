import React from 'react'
import { ApplicationCSVDownload } from '../applications/ApplicationCSVDownload';
import { EnemScoreImport } from '../enemScores/EnemScoreImport';
import { Grid } from '@mui/material';

const ApplicationOutcomesStep = () => {

    return (
        <div>
            <h2>Processamento dos resultados</h2>
            <p>Esta etapa permite importar as notas do ENEM para o sistema.</p>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <ApplicationCSVDownload />
                </Grid>
                <Grid item xs={12} md={6}>
                    <EnemScoreImport />
                </Grid>
            </Grid>
        </div>
    );
}



export { ApplicationOutcomesStep };
