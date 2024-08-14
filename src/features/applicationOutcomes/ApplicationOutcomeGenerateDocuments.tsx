import React, { useState } from "react";
import { Box, Typography, Button, Switch, FormControlLabel } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { ApplicationOutcome as OriginalApplicationOutcome } from "../../types/ApplicationOutcome";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Estender o tipo para incluir a classificação
interface ApplicationOutcome extends OriginalApplicationOutcome {
  classification?: string;
}

const vagaOptions = {
  "LB - PPI": 5,
  "LB - Q": 1,
  "LB - PCD": 1,
  "LB - EP": 1,
  "LI - PPI": 5,
  "LI - Q": 0,
  "LI - PCD": 1,
  "LI - EP": 1,
  "AC: Ampla Concorrência": 8,
} as const;

type CategoryKey = keyof typeof vagaOptions;

const categories = [
  { id: 1, label: "LB - PPI", value: "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 2, label: "LB - Q", value: "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 3, label: "LB - PCD", value: "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 4, label: "LB - EP", value: "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 5, label: "LI - PPI", value: "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 6, label: "LI - Q", value: "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 7, label: "LI - PCD", value: "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 8, label: "LI - EP", value: "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { id: 9, label: "AC: Ampla Concorrência", value: "AC: Ampla Concorrência" },
];

export const ApplicationOutcomeGenerateDocuments = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const selectedCategory = categories.find(category => category.id === parseInt(categoryId ?? "0"))?.value || null;

  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });

  const [showPending, setShowPending] = useState(true); // Estado para o switch

  const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPending(event.target.checked);
  };

  const outcomesByCategory = data?.data
    ?.filter((outcome: ApplicationOutcome) =>
      selectedCategory &&
      (selectedCategory === "AC: Ampla Concorrência"
        ? outcome.status === "approved" || (showPending && outcome.status === "pending")
        : outcome.application?.data?.vaga.includes(selectedCategory) &&
        (outcome.status === "approved" || (showPending && outcome.status === "pending"))))
    .sort((a: ApplicationOutcome, b: ApplicationOutcome) => b.final_score - a.final_score)
    .map((outcome: ApplicationOutcome, index: number) => ({
      ...outcome,
      classification:
        selectedCategory && index < vagaOptions[selectedCategory as CategoryKey]
          ? "Classificado"
          : "Classificável",
    }));

  const maskCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "XXX.$2.$3-XX");
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const title1 = "EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024";
    const title2 = "PROCESSO SELETIVO UNILAB – (MODELO SISU)";
    const title3 = "Curso de Medicina - Baturité";
    const title4 = `Classificação Geral: ${selectedCategory}`;

    doc.text(title1, pageWidth / 2, 40, { align: "center" });
    doc.text(title2, pageWidth / 2, 60, { align: "center" });
    doc.text(title3, pageWidth / 2, 80, { align: "center" });
    doc.text(title4, pageWidth / 2, 100, { align: "center" });

    doc.autoTable({
      startY: 120,
      html: "#outcomes-table",
      styles: { overflow: "linebreak", cellWidth: "wrap", halign: "center" },
      bodyStyles: { valign: "top" },
      columnStyles: { text: { cellWidth: "auto" } },
      margin: { top: 10, left: 20, right: 20, bottom: 10 },
      theme: "grid",
    });

    doc.save("application_outcomes.pdf");
  };

  if (error) {
    return <Typography>Error fetching applicationOutcomes</Typography>;
  }

  return (
    <Box sx={{ mt: 0, mb: 0 }}>
      {selectedCategory && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Resultados para: {selectedCategory}
          </Typography>

          {/* Switch para exibir com ou sem pendentes */}
          <FormControlLabel
            control={
              <Switch
                checked={showPending}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label="Exibir Pendentes"
            sx={{ marginBottom: 2 }}
          />

          <Button variant="contained" color="primary" onClick={generatePDF}>
            Gerar PDF
          </Button>

          <table id="outcomes-table" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px", color: "black" }}>
            <thead>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Classificação</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Nome</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>CPF</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Situação</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Nota Final</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Bonificação</th>
              </tr>
            </thead>
            <tbody>
              {outcomesByCategory?.map((outcome: ApplicationOutcome, index: number) => (
                <tr key={outcome.id} style={{ border: "1px solid black", color: "black" }}>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{index + 1}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.application?.data?.name}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{maskCPF(outcome.application?.data?.cpf || "")}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.classification}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.final_score}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>
                    {outcome.application?.data?.bonus?.map((bonus: string) => bonus.split(":")[0])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Box>
  );
};
