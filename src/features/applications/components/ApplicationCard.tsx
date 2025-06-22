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
    console.log(application);
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
                                    <TableCell>{application?.form_data?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Nome Social</TableCell>
                                    <TableCell>{application?.form_data?.social_name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">CPF</TableCell>
                                    <TableCell>{application?.form_data?.cpf}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Data de Nascimento</TableCell>
                                    <TableCell>{formatDate(application?.form_data?.birthdate)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Sexo</TableCell>
                                    <TableCell>{application?.form_data?.sex}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Email</TableCell>
                                    <TableCell>{application?.form_data?.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Telefone 1</TableCell>
                                    <TableCell>{application?.form_data?.phone1}</TableCell>
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
                            Detalhes da Aplicação
                        </Typography>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th">Edital</TableCell>
                                    <TableCell>{application?.form_data?.edital}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Curso</TableCell>
                                    <TableCell>{application?.form_data?.position}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Localização</TableCell>
                                    <TableCell>{application?.form_data?.location_position}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">ENEM</TableCell>
                                    <TableCell>{application?.form_data?.enem}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Atualizado em</TableCell>
                                    <TableCell>{formatDate(application?.form_data?.updated_at)}</TableCell>
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
                                            A VER DEPOI
                                            {/* {application?.form_data?.vaga?.map((vaga, index) => (
                                                <li key={index}>{vaga}</li>
                                            ))} */}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                                {application?.form_data?.bonus && (
                                    <TableRow>
                                        <TableCell component="th">Bonificação</TableCell>
                                        <TableCell>
                                            <ul>
                                                {application?.form_data?.bonus === undefined || application?.form_data?.bonus?.length === 0
                                                    ? (<> Nenhuma das anteriores</>) : (<></>)
                                                }
                                                {/* {application?.form_data?.bonus?.map((bonus, index) => (
                                                    <li key={index}>{bonus}</li>
                                                ))} */}
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
