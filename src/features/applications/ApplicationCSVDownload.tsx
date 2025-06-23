import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useGetApplicationsQuery } from './applicationSlice';
import { saveAs } from 'file-saver';




const paginateApplications = (applications: any[], pageSize: number) => {
    const pages = [];
    for (let i = 0; i < applications.length; i += pageSize) {
        pages.push(applications.slice(i, i + pageSize));
    }
    return pages;
};

const handleDownloadCSV = (applications: any[]) => {
    const fileNamePrefix = `inscricoes_enem_`;
    const pages = paginateApplications(applications, 1000);
    const totalPages = pages.length;
    pages.forEach((page, index) => {
        const csvContent = page.map(app => app.form_data.enem).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileNamePrefix}_parte_${index + 1}_de_${totalPages}.txt`);
    });
};



export const ApplicationCSVDownload = () => {
    const [page, setPage] = useState(1);
    const [allApplications, setAllApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data, isFetching, error } = useGetApplicationsQuery({ page, perPage: 1000 });

    useEffect(() => {
        if (data && !isFetching) {
            setAllApplications(prevState => [...prevState, ...data.data]);
            if (data.meta.current_page < data.meta.last_page && page < 4) {
                setPage(prevPage => prevPage + 1);
            } else {
                setIsLoading(false);
            }
        }
    }, [data, isFetching]);


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography>Error fetching applications</Typography>;
    }



    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Download arquivo CSV para o INEP
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownloadCSV(allApplications)}
                >
                    Clique Para Baixar CSV
                </Button>

                <Typography>
                    Total de Inscrições:  {data?.meta?.total}
                </Typography>
            </CardContent>
        </Card>
    );
};
