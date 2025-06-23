import React from 'react';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { ApplicationOutcome } from '../../../types/ApplicationOutcome';

type Props = {
    applicationOutcome: ApplicationOutcome;
    isLoading?: boolean;
};

const ApplicationOutcomeCard = ({
    applicationOutcome,
    isLoading = false,
}: Props) => {
    if (applicationOutcome === undefined) {
        return <div>Loading...</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }


    console.log(applicationOutcome);
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} xl={4} lg={4} md={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Informações Do Resultado
                        </Typography>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export { ApplicationOutcomeCard };
