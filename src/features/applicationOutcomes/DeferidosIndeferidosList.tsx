import React, { useState } from "react";
import { Box, Typography, Button, Switch, FormControlLabel, Card, CardContent, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import useTranslate from '../polyglot/useTranslate';

interface ProcessedApplicationOutcome extends ApplicationOutcome {
    displayStatus: string;
    displayReason: string;
}

const DeferidosIndeferidosList = () => {
    const translate = useTranslate('status');
    const [options, setOptions] = useState({
        page: 1,
        search: "",
        perPage: 10,
        rowsPerPage: [10, 20, 30],
    });

    const [showOnlyPending, setShowOnlyPending] = useState(false);

    const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

    const maskCPF = (cpf: string): string => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**");
    };

    const generatePDF = () => {
        const doc = new jsPDF("p", "pt", "a4");

        const margin = 42.52; // 1.5 cm em pontos (1 cm = 28.35 pontos)
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(10);
        doc.text("EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024", pageWidth / 2, margin, { align: "center" });
        doc.text("PROCESSO SELETIVO UNILAB – (MODELO SISU) - INGRESSO NO PERÍODO LETIVO 2024.1", pageWidth / 2, margin + 20, { align: "center" });
        doc.text("Medicina - Baturité", pageWidth / 2, margin + 40, { align: "center" });
        doc.text("Inscrições Deferidas ou Indeferidas", pageWidth / 2, margin + 60, { align: "center" });

        const rows = deferidosIndeferidos?.map((outcome) => [
            outcome.application?.data?.name || "",
            maskCPF(outcome.application?.data?.cpf || ""),
            outcome.displayStatus,
            outcome.displayReason
        ]);

        doc.autoTable({
            head: [["Nome", "CPF", "Situação", "Motivo"]],
            body: rows || [],
            startY: margin + 80,
            styles: {
                overflow: "linebreak",
                cellWidth: "wrap",
                fontSize: 8,
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
            },
            bodyStyles: { valign: "top" },
            columnStyles: {
                0: { cellWidth: 150 },
                1: { cellWidth: 100 },
                2: { cellWidth: 100 },
                3: { cellWidth: 150 },
            },
            theme: "grid",
            margin: { top: margin, left: margin, right: margin },
            didDrawCell: (data: any) => {
                if (data.cell.section === 'body' && data.column.index === 3) {
                    data.cell.text = data.cell.text.map((text: string) => doc.splitTextToSize(text, 200));
                }
            }
        });

        doc.save("inscricoes_deferidas_indeferidas.pdf");
    };

    if (isFetching) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error fetching applicationOutcomes</Typography>;
    }

    const deferidosIndeferidos: ProcessedApplicationOutcome[] = [...(data?.data || [])]
        .filter((outcome) => !showOnlyPending || outcome.status === "pending")
        .map((outcome) => ({
            ...outcome,
            displayStatus: outcome.status === "approved" ? "Deferido" : outcome.status === "rejected" ? "Indeferido" : "Pendente",
            displayReason: outcome.status === "rejected" || outcome.status === "pending"  ? outcome.reason || "-" : "",
        }))
        .sort((a, b) => (a.application?.data?.name || "").localeCompare(b.application?.data?.name || ""));

    const totalApproved = deferidosIndeferidos.filter(outcome => outcome.status === "approved").length;
    const totalRejected = deferidosIndeferidos.filter(outcome => outcome.status === "rejected").length;
    const totalPending = deferidosIndeferidos.filter(outcome => outcome.status === "pending").length;
    const total = deferidosIndeferidos.length;

    return (
        <Box sx={{ mt: 0, mb: 0 }}>
            <Typography variant="h5" sx={{ mt: 4, mb: 4 }}>
                Inscrições Deferidas ou Indeferidas
            </Typography>

            <FormControlLabel
                control={
                    <Switch
                        checked={showOnlyPending}
                        onChange={(e) => setShowOnlyPending(e.target.checked)}
                        color="primary"
                    />
                }
                label="Mostrar apenas pendentes"
            />

            <Button variant="contained" color="primary" onClick={generatePDF}>
                Gerar PDF
            </Button>
            <Box
                sx={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
            >
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
                                        {outcome.application?.data?.name}
                                    </Link>
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                    {maskCPF(outcome.application?.data?.cpf || "")}
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                    {outcome.displayStatus}
                                </td>
                                <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                    {outcome.displayReason}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
