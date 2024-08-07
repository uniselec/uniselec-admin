import React from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

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
        <Container>
            <Typography variant="h4" gutterBottom>
                Dashboard de Resultados
            </Typography>
            <Card elevation={3}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3}>
                                <Typography variant="h6" gutterBottom>
                                    Downloads de Inscrições Por Modalidade
                                </Typography>
                                <Box display="flex" flexDirection="column">
                                    <Link to="/download/modalidade-a" style={{ marginBottom: 8 }}>
                                        Modalidade A
                                    </Link>
                                    <Link to="/download/modalidade-b" style={{ marginBottom: 8 }}>
                                        Modalidade B
                                    </Link>
                                    <Link to="/download/modalidade-c">
                                        Modalidade C
                                    </Link>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3}>
                                <Typography variant="h6" gutterBottom>
                                    Download da Lista Preliminar de Deferidos e Indeferidos
                                </Typography>
                                <Box display="flex" flexDirection="column">
                                    <Link to="/download/deferidos" style={{ marginBottom: 8 }}>
                                        Lista de Deferidos
                                    </Link>
                                    <Link to="/download/indeferidos">
                                        Lista de Indeferidos
                                    </Link>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {/* <Card elevation={3} sx={{ marginBottom: 3 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Inscritos por Modalidade
                                </Typography>
                                <Bar data={barData} />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={3}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Distribuição de Inscritos
                                </Typography>
                                <Pie data={pieData} />
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card> */}
        </Container>
    );
};

export { DashboardApplications };
