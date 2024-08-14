import React, { useState } from "react";
import { Box, Typography, Button, Switch, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ProcessedApplicationOutcome extends ApplicationOutcome {
    displayStatus: string;
    displayReason: string;
}

const DeferidosIndeferidosList = () => {
    const [options, setOptions] = useState({
        page: 1,
        search: "",
        perPage: 10,
        rowsPerPage: [10, 20, 30],
    });

    const [showPendingAsApproved, setShowPendingAsApproved] = useState(true);

    const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

    const maskCPF = (cpf: string): string => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**");
    };

    const generatePDF = () => {
        const doc = new jsPDF("p", "pt", "a4");

        // Aumenta a margem para 1,5 cm
        const margin = 42.52; // 1.5 cm em pontos (1 cm = 28.35 pontos)
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(10); // Diminui o tamanho da letra
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
            startY: margin + 80, // Mantém a tabela dentro das margens ajustadas
            styles: {
                overflow: "linebreak",
                cellWidth: "wrap",
                fontSize: 8,
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
            },
            bodyStyles: { valign: "top" },
            columnStyles: {
                0: { cellWidth: 150 }, // Limita a largura da coluna Nome
                1: { cellWidth: 100 }, // Limita a largura da coluna CPF
                2: { cellWidth: 100 }, // Limita a largura da coluna Situação
                3: { cellWidth: 150 }, // Limita a largura da coluna Motivo
            },
            theme: "grid",
            margin: { top: margin, left: margin, right: margin }, // Aplica a margem em todos os lados
            didDrawCell: (data: any) => {
                if (data.cell.section === 'body' && data.column.index === 3) {
                    // Força a quebra de linha se o texto for muito longo
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
        .map((outcome) => ({
            ...outcome,
            displayStatus: outcome.status === "approved" || (outcome.status === "pending" && showPendingAsApproved) ? "Deferido" : "Pendente",
            displayReason: outcome.status === "rejected" || (!showPendingAsApproved && outcome.status === "pending") ? outcome.reason || "-" : "",
        }))
        .sort((a, b) => (a.application?.data?.name || "").localeCompare(b.application?.data?.name || ""));

    return (
        <Box sx={{ mt: 0, mb: 0 }}>
            <Typography variant="h5" sx={{ mt: 4, mb: 4 }}>
                Inscrições Deferidas ou Indeferidas
            </Typography>

            <FormControlLabel
                control={
                    <Switch
                        checked={showPendingAsApproved}
                        onChange={(e) => setShowPendingAsApproved(e.target.checked)}
                        color="primary"
                    />
                }
                label="Mostrar Pendentes como Deferidos"
            />

            <Button variant="contained" color="primary" onClick={generatePDF}>
                Gerar PDF
            </Button>
            <Box
                sx={{
                    overflowX: "auto", // Permite rolagem horizontal, caso a tabela seja muito larga
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
                        tableLayout: "fixed", // Faz com que a tabela respeite a largura
                        wordWrap: "break-word", // Permite a quebra de linha
                        fontSize: "12px", // Diminui o tamanho da letra na tabela HTML
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
        </Box>
    );
};

export { DeferidosIndeferidosList };
