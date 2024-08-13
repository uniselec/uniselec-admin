import React from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { ApplicationCSVDownload } from './ApplicationCSVDownload';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
}

const DashboardApplications: React.FC = () => {
    const barData: ChartData = {
        labels: ['Modalidade A', 'Modalidade B', 'Modalidade C'],
        datasets: [
            {
                label: 'Número de Inscritos',
                data: [150, 200, 100],
                backgroundColor: ['rgba(75, 192, 192, 0.6)'],
            },
        ],
    };

    const pieData: ChartData = {
        labels: ['Modalidade A', 'Modalidade B', 'Modalidade C'],
        datasets: [
            {
                label: 'Distribuição de Inscritos',
                data: [150, 200, 100],
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
            },
        ],
    };

    return (
        <>
            <Card elevation={3}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>

                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Passo 1
                                    </Typography>
                                    <Box display="flex" flexDirection="column">
                                        <Link to="/export-csv" style={{ marginBottom: 8 }}>
                                            Exportar Inscrições
                                        </Link>

                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Passo 2
                                    </Typography>
                                    <Box display="flex" flexDirection="column">
                                        <Link to="/import-enem-score" style={{ marginBottom: 8 }}>
                                            Importar Notas
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>

                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Passo 3
                                    </Typography>
                                    <Box display="flex" flexDirection="column">
                                        <Link to="/generate-results" style={{ marginBottom: 8 }}>
                                            Processar resultados
                                        </Link>

                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Passo 4
                                    </Typography>
                                    <Box display="flex" flexDirection="column">
                                        <Link to="/list-generate" style={{ marginBottom: 8 }}>
                                            Gerar Listas
                                        </Link>

                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Auditar Processo
                                    </Typography>

                                    <Box display="flex" flexDirection="column">
                                        <Link to="/list-generate" style={{ marginBottom: 8 }}>
                                            Gerar Listas
                                        </Link>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};

export { DashboardApplications };
