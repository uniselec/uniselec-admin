import React, { useState } from "react";
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useGetApplicationOutcomesQuery } from "../applicationOutcomes/applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import useTranslate from '../polyglot/useTranslate';
import { useGetProcessSelectionQuery } from "./processSelectionSlice";



interface ProcessedApplicationOutcome extends ApplicationOutcome {
    displayStatus: string;
    displayReason: string;
}

const toUpperCase = (text: string): string => text.toUpperCase();

const DeferidosIndeferidosList = () => {

    const { id: processSelectionId } = useParams<{ id: string }>();

    if (!processSelectionId) {
        return <Typography variant="h6" color="error">Selecione um Processo Seletivo</Typography>;
    }
    const { data: processSelection, isFetching: isFetchingProcess, refetch } = useGetProcessSelectionQuery({ id: processSelectionId! });

    const translate = useTranslate('status');
    const [options, setOptions] = useState({
        page: 1,
        perPage: 25,
        search: "",
        filters: { process_selection_id: processSelectionId! } as Record<string, string>,
    });

    const [filterStatus, setFilterStatus] = useState<string>('all');

    const { data: outcomesData, isFetching, error } = useGetApplicationOutcomesQuery(options);
    if (isFetchingProcess) {
        return <Typography>Loading...</Typography>;
    }

    const maskCPF = (cpf: string): string => {
        const cleanCPF = cpf.replace(/\D/g, '');
        return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**");
    };

    const generatePDF = () => {
        /* -------------------------------- layout --------------------------------- */
        const marginCm = 2;                       // 2 cm
        const pt = 28.35;                   // 1 cm = 28.35 pt
        const topMargin = marginCm * pt;
        const bottomMargin = marginCm * pt;

        /* ------------------------- criação do documento -------------------------- */
        const doc = new jsPDF('p', 'pt', 'a4');
        import('jspdf-autotable');                // garante que o plugin foi carregado

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date().toLocaleString('pt-BR');
        /* ------------------------------------------------------------------------ */

        /* -------- cabeçalho (exemplo) -------- */
        doc.setFontSize(10);
        doc.text(processSelection?.data?.name ?? '', pageWidth / 2, topMargin, { align: "center" });
        doc.text(processSelection?.data?.description ?? '', pageWidth / 2, topMargin + 20, { align: "center" });
        doc.text("Resultado Geral", pageWidth / 2, topMargin + 40, { align: "center" });
        doc.text("Inscrições Deferidas ou Indeferidas", pageWidth / 2, topMargin + 60, { align: "center" });

        /* ---------------------- conteúdo da tabela ----------------------- */
        const rows = deferidosIndeferidos.map(o => [
            o.status === 'approved'
                ? toUpperCase(o.application?.enem_score?.scores?.name || '')
                : toUpperCase(o.application?.form_data?.name || ''),
            maskCPF(o.application?.form_data?.cpf || ''),
            o.displayStatus,
            o.displayReason,
        ]);

        (doc as any).autoTable({
            head: [['Nome', 'CPF', 'Situação', 'Motivo']],
            body: rows,
            startY: topMargin + 80,
            margin: { top: topMargin, left: topMargin, right: topMargin, bottom: bottomMargin },
            styles: { fontSize: 8, overflow: 'linebreak' },
            theme: 'grid',
            didDrawPage: () => {
                doc.setFontSize(8);
                doc.text(`Data/hora: ${now}`, topMargin, pageHeight - bottomMargin + 16);
                doc.text(
                    `Página ${(doc.internal as any).getNumberOfPages()}`,
                    pageWidth - topMargin,
                    pageHeight - bottomMargin + 16,
                    { align: 'right' },
                );
            },
        });

        doc.save('inscricoes_deferidas_indeferidas.pdf');
    };


    if (isFetching) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error fetching applicationOutcomes</Typography>;
    }

    const deferidosIndeferidos: ProcessedApplicationOutcome[] = (outcomesData?.data || [])
        .filter((outcome: ApplicationOutcome) => {
            if (filterStatus === 'all') return true;
            if (filterStatus === 'without_duplicates') return outcome.reason !== "Inscrição duplicada";
            return outcome.status === filterStatus;
        })
        .map((outcome: ApplicationOutcome) => ({
            ...outcome,
            displayStatus: translate(outcome.status),
            displayReason: outcome.status === "rejected" || outcome.status === "pending" ? outcome.reason || "-" : "",
        }))
        .sort((a: ProcessedApplicationOutcome, b: ProcessedApplicationOutcome) => (a.application?.form_data?.name || "").localeCompare(b.application?.form_data?.name || ""));

    const totalApproved = deferidosIndeferidos.filter(outcome => outcome.status === "approved").length;
    const totalRejected = deferidosIndeferidos.filter(outcome => outcome.status === "rejected").length;
    const totalPending = deferidosIndeferidos.filter(outcome => outcome.status === "pending").length;
    const total = deferidosIndeferidos.length;

    return (
        <Box sx={{ mt: 0, mb: 0 }}>
            <Typography variant="h5" sx={{ mt: 4, mb: 4 }}>
                Inscrições Deferidas ou Indeferidas
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box sx={{ flexBasis: { xs: '100%', md: '50%' } }}>
                    <FormControl fullWidth>
                        <InputLabel id="status-filter-label">Filtrar por Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            id="status-filter"
                            value={filterStatus}
                            label="Filtrar por Status"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">Todos</MenuItem>
                            <MenuItem value="without_duplicates">Todos exceto duplicados</MenuItem>
                            <MenuItem value="approved">Deferidos</MenuItem>
                            <MenuItem value="pending">Pendentes</MenuItem>
                            <MenuItem value="rejected">Indeferidos</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ flexBasis: { xs: '100%', md: '50%' }, textAlign: { xs: 'center', md: 'right' } }}>
                    <Button variant="contained" color="primary" onClick={generatePDF} fullWidth={false}>
                        Gerar PDF
                    </Button>
                </Box>
            </Box>

            <Box
                sx={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
            >
                <Card>
                    <CardContent>
                        <table
                            id="outcomes-table"
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                marginTop: "20px",
                                color: "black",
                                tableLayout: "fixed",
                                wordWrap: "break-word",
                                fontSize: "12px",
                            }}
                        >
                            <thead>
                                <tr style={{ border: "1px solid black" }}>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Nome</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>CPF</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Situação</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Motivo</th>
                                </tr>
                            </thead>
                            <tbody>

                                {deferidosIndeferidos?.map((outcome) => (
                                    <tr key={outcome.id} style={{ border: "1px solid black", color: "black" }}>
                                        <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                            <Link to={`/application-outcomes/edit/${outcome.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                                {(outcome?.status === 'approved' ? toUpperCase(outcome?.application?.enem_score?.scores?.name || "") : toUpperCase(outcome?.application?.form_data?.name || ""))}
                                            </Link>
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                            {maskCPF(outcome.application?.form_data?.cpf || "")}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                            {translate(outcome?.status)}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                            {outcome.displayReason}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </Box>

            {/* Cards com o resumo de resultados */}
            <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Total Deferidos
                            </Typography>
                            <Typography variant="h4">{totalApproved}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="error">
                                Total Indeferidos
                            </Typography>
                            <Typography variant="h4">{totalRejected}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="warning">
                                Total Pendentes
                            </Typography>
                            <Typography variant="h4">{totalPending}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Total Geral
                            </Typography>
                            <Typography variant="h4">{total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export { DeferidosIndeferidosList };
