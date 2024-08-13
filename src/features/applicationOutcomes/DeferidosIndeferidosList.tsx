import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DeferidosIndeferidosList = () => {
    const [options, setOptions] = useState({
        page: 1,
        search: "",
        perPage: 10,
        rowsPerPage: [10, 20, 30],
    });

    const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

    const maskCPF = (cpf: string) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**");
    };

    const generatePDF = () => {
        const doc = new jsPDF("p", "pt", "a4");

        doc.setFontSize(12);
        doc.text("EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });
        doc.text("PROCESSO SELETIVO UNILAB – (MODELO SISU) - INGRESSO NO PERÍODO LETIVO 2024.1", doc.internal.pageSize.getWidth() / 2, 60, { align: "center" });
        doc.text("Medicina - Baturité", doc.internal.pageSize.getWidth() / 2, 80, { align: "center" });
        doc.text("Inscrições Deferidas ou Indeferidas", doc.internal.pageSize.getWidth() / 2, 100, { align: "center" });

        const rows = deferidosIndeferidos?.map((outcome) => [
            outcome.application?.data?.name || "",
            maskCPF(outcome.application?.data?.cpf || ""),
            outcome.status === "approved" ? "Deferido" : "Indeferido",
            outcome.status === "rejected" ? outcome.reason || "-" : ""
        ]);

        doc.autoTable({
            head: [["Nome", "CPF", "Situação", "Motivo"]],
            body: rows || [],
            startY: 120,
            styles: { overflow: "linebreak", cellWidth: "wrap" },
            bodyStyles: { valign: "top" },
            columnStyles: { text: { cellWidth: "auto" } },
            theme: "grid",
        });

        doc.save("inscricoes_deferidas_indeferidas.pdf");
    };

    if (isFetching) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error fetching applicationOutcomes</Typography>;
    }

    // Cria uma cópia do array antes de ordenar
    const deferidosIndeferidos = [...(data?.data || [])].sort((a: ApplicationOutcome, b: ApplicationOutcome) => {
        if (a.status === "approved" && b.status !== "approved") return -1;
        if (a.status !== "approved" && b.status === "approved") return 1;
        return 0;
    });

    return (
        <Box sx={{ mt: 0, mb: 0 }}>
            <Typography variant="h5" sx={{ mt: 4, mb: 4 }}>
                Inscrições Deferidas ou Indeferidas
            </Typography>
            <Button variant="contained" color="primary" onClick={generatePDF}>
                Gerar PDF
            </Button>
            <table
                id="outcomes-table"
                style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    marginTop: "20px",
                    color: "black",
                }}
            >
                <thead>
                    <tr style={{ border: "1px solid black" }}>
                        <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Nome</th>
                        <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>CPF</th>
                        <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Situação</th>
                        <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    {deferidosIndeferidos?.map((outcome: ApplicationOutcome) => (
                        <tr key={outcome.id} style={{ border: "1px solid black", color: "black" }}>
                            <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>
                                {outcome.application?.data?.name}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>
                                {maskCPF(outcome.application?.data?.cpf || "")}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>
                                {outcome.status === "approved" ? "Deferido" : "Indeferido"}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>
                                {outcome.status === "rejected" ? outcome.reason || "-" : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
};

export { DeferidosIndeferidosList };
