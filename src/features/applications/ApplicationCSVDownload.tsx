import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useGetApplicationsQuery } from './applicationSlice';
import { saveAs } from 'file-saver';
import { useParams } from "react-router-dom";



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
    const { id: processSelectionId } = useParams<{ id: string }>();
    const [page, setPage] = useState(1);
    const [allApplications, setAllApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { data, isFetching, error } = useGetApplicationsQuery({
        page,
        perPage: 1000,
        process_selection_id: processSelectionId,
    });
    useEffect(() => {
        setPage(1);
        setAllApplications([]);
        setIsLoading(true);
    }, [processSelectionId]);

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
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    1. Faça o download do CSV das inscrições do ENEM
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownloadCSV(allApplications)}
                >
                    Clique Para Baixar CSV
                </Button>
                <p>Os arquivos serão divididos em partes com no máximo mil inscrições por arquivo. Use essas notas no sistema do INEP para obter as notas do ENEM de cada candidato.</p>
                <p>Total de Inscrições:  {data?.meta?.total}</p>
            </CardContent>
        </Card>
    );
};
