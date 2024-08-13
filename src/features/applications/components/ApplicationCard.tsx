import React from 'react';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { Application } from '../../../types/Application';

type Props = {
    application: Application;
    isLoading?: boolean;
};

const ApplicationCard = ({
    application,
    isLoading = false,
}: Props) => {
    if (application === undefined) {
        return <div>Loading...</div>;
    }
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Função de formatação de data sem criar um objeto Date
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split("-");
        return `${day}/${month}/${year}`;
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} xl={4} lg={4} md={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Informações Pessoais
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th">Nome</TableCell>
                                    <TableCell>{application?.data?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Nome Social</TableCell>
                                    <TableCell>{application?.data?.social_name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">CPF</TableCell>
                                    <TableCell>{application?.data?.cpf}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Data de Nascimento</TableCell>
                                    <TableCell>{formatDate(application?.data?.birtdate)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Sexo</TableCell>
                                    <TableCell>{application?.data?.sex}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Email</TableCell>
                                    <TableCell>{application?.data?.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Telefone 1</TableCell>
                                    <TableCell>{application?.data?.phone1}</TableCell>
                                </TableRow>
                                {application?.data?.phone2 && (
                                    <TableRow>
                                        <TableCell component="th">Telefone 2</TableCell>
                                        <TableCell>{application?.data?.phone2}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} xl={4} lg={4} md={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Detalhes da Aplicação
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th">Edital</TableCell>
                                    <TableCell>{application?.data?.edital}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Curso</TableCell>
                                    <TableCell>{application?.data?.position}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Localização</TableCell>
                                    <TableCell>{application?.data?.location_position}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">ENEM</TableCell>
                                    <TableCell>{application?.data?.enem}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Atualizado em</TableCell>
                                    <TableCell>{formatDate(application?.data?.updated_at)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} xl={4} lg={4} md={4}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Vagas e Bonificação
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th">Vagas</TableCell>
                                    <TableCell>
                                        <ul>
                                            <li>AC: Ampla Concorrência</li>
                                        </ul>
                                        <ul>
                                            {application?.data?.vaga?.map((vaga, index) => (
                                                <li key={index}>{vaga}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                                {application?.data?.bonus && (
                                    <TableRow>
                                        <TableCell component="th">Bonificação</TableCell>
                                        <TableCell>
                                            <ul>
                                                {application?.data?.bonus === undefined || application?.data?.bonus?.length === 0
                                                    ? (<> Nenhuma das anteriores</>) : (<></>)
                                                }
                                                {application?.data?.bonus?.map((bonus, index) => (
                                                    <li key={index}>{bonus}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export { ApplicationCard };
