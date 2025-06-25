import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetApplicationOutcomesQuery } from '../applicationOutcomes/applicationOutcomeSlice';
import { CategoryCards } from '../applicationOutcomes/components/CategoryCards';
import { useGetProcessSelectionQuery } from './processSelectionSlice';

const GenerateLists = () => {
    const { id: processSelectionId } = useParams<{ id: string }>();
    if (!processSelectionId) {
        return <Typography variant="h6" color="error">Selecione um Processo Seletivo</Typography>;
    }
    const [options, setOptions] = useState({
        page: 1,
        perPage: 25,
        search: "",
        filters: { process_selection_id: processSelectionId! } as Record<string, string>,
    });
    const { data: processSelection, isFetching, refetch } = useGetProcessSelectionQuery({ id: processSelectionId! });
    const { data: outcomesData, isFetching: isFetchingOutcomeData } = useGetApplicationOutcomesQuery(options);
    const hasApplicationOutcomes = outcomesData?.data && outcomesData.data.length > 0;
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    2. Resolver Pendencias e Gerar Listas
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
                        component={Link}
                        to={`/deferidos-indeferidos/${processSelectionId}`}
                        variant="outlined"
                        color="secondary"
                        sx={{ fontSize: '12px' }}
                        disabled={outcomesData?.meta?.total === 0}
                    >
                        {outcomesData?.meta?.total ? `${outcomesData.meta.total} Resultados` : "0 Resultados"}
                    </Button>
                    <Button
                        component={Link}
                        to={`/applications-results?process_selection_id=${processSelectionId}`}
                        variant="outlined"
                        color="secondary"
                        sx={{ fontSize: '12px' }}
                        disabled={outcomesData?.meta?.total === 0}
                    >
                        Listas
                    </Button>

                </Box>
            </CardContent>
        </Card>
    )
}

export default GenerateLists
