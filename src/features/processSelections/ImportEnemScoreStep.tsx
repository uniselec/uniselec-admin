import React from 'react'
import { ApplicationCSVDownload } from '../applications/ApplicationCSVDownload';
import { EnemScoreImport } from '../enemScores/EnemScoreImport';
import { Card, CardContent, Grid } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";


const ImportEnemScoreStep = () => {
    const { id: processSelectionId } = useParams<{ id: string }>();
    return (
        <div>
            <Card>
                <CardContent>
                    <h2>Importar Notas do ENEM</h2>
                    <p>Esta etapa permite importar as notas do ENEM para o sistema.</p>
                </CardContent>
            </Card>

            <Grid container spacing={2} sx={{ mt: 1 }}>
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



export { ImportEnemScoreStep };
