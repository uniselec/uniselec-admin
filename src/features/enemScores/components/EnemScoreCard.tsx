import React from 'react';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { EnemScore } from '../../../types/EnemScore';

type Props = {
    enemScore: EnemScore;
    isLoading?: boolean;
};

const EnemScoreCard = ({
    enemScore,
    isLoading = false,
}: Props) => {
    if (enemScore === undefined) {
        return <div>Loading...</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Função de formatação de data que aceita string ou Date
    const formatDate = (dateValue: string | Date | undefined) => {
        if (!dateValue) return '';
        if (dateValue instanceof Date) {
            const year = dateValue.getFullYear();
            const month = String(dateValue.getMonth() + 1).padStart(2, '0');
            const day = String(dateValue.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }
        const [year, month, day] = dateValue.split("-");
        return `${day}/${month}/${year}`;
    };
    console.log(enemScore);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} xl={4} lg={4} md={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Informações Pessoais
                        </Typography>

                    </CardContent>
                </Card>
            </Grid>
        </Grid >
    );
};

export { EnemScoreCard };
