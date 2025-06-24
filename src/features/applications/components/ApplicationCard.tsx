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
    const formData = application.form_data ?? ({} as any);
    const positionCourse = formData.position ?? null;           // Course | null
    const selectedCategories = formData.admission_categories ?? [];
    const selectedBonus = formData.bonus ?? null;
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
                                    <TableCell>{application?.form_data?.position?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Localização</TableCell>
                                    <TableCell>{application?.form_data?.position?.academic_unit?.name}</TableCell>
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
                        <TableRow>
                            <TableCell>Modalidades</TableCell>
                            <TableCell>
                                {selectedCategories.length ? (
                                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                                        {selectedCategories.map((cat: any) => (
                                            <li key={cat.id}>{cat.name}</li>
                                        ))}
                                    </ul>
                                ) : '—'}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Bonificação</TableCell>
                            <TableCell>
                                {selectedBonus ? (
                                    <>
                                        <strong>{selectedBonus.name}</strong>
                                        {selectedBonus.description && <><br />{selectedBonus.description}</>}
                                        {selectedBonus.value && <><br />Valor: {selectedBonus.value}%</>}
                                    </>
                                ) : 'Nenhuma'}
                            </TableCell>
                        </TableRow>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export { ApplicationCard };
