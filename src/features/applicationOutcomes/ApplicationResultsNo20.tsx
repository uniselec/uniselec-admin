import React, { useState } from 'react'
import { useParams, Link } from "react-router-dom";
import { useGetApplicationOutcomesQuery } from './applicationOutcomeSlice';
import { Box, Paper, Typography } from '@mui/material';
import { ApplicationOutcomeGenerateDocumentsNo20 } from './components/ApplicationOutcomeGenerateDocumentsNo20';

const ApplicationResultsNo20 = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [options, setOptions] = useState({
        page: 1,
        search: "",
        perPage: 10,
        rowsPerPage: [10, 20, 30],
    });
    const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

    if (error) {
        return <Typography>Error fetching applicationOutcomes</Typography>;
    }
    if (isFetching || data?.data === undefined || categoryId === undefined) {
        return <Typography>Aguarde os dados serem carregados...</Typography>;
    }


    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Paper>
                <Box p={2}>
                    <Box mb={2}>
                        <Typography variant="h4">Resultados</Typography>
                    </Box>
                </Box>
                <ApplicationOutcomeGenerateDocumentsNo20 applicationOutcomes={data?.data} categoryId={categoryId}/>
            </Paper>
        </Box>
    )
}

export { ApplicationResultsNo20 };
