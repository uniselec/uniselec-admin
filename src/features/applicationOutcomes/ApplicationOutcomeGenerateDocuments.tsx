import React, { useState } from "react";
import { Box, Typography, Card, CardContent, Grid, Button } from "@mui/material";
import { useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome"; // Caminho corrigido para o tipo ApplicationOutcome
import { jsPDF } from "jspdf";
import "jspdf-autotable";



const categories = [
  { label: "LB - PPI", value: "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LB - Q", value: "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LB - PCD", value: "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LB - EP", value: "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - PPI", value: "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - Q", value: "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - PCD", value: "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "LI - EP", value: "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012)." },
  { label: "AC: Ampla Concorrência", value: "AC: Ampla Concorrência" }, // Adicionando a categoria AC
];

export const ApplicationOutcomeGenerateDocuments = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });

  const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const outcomesByCategory = data?.data?.filter(
    (outcome: ApplicationOutcome) =>
      selectedCategory &&
      (selectedCategory === "AC: Ampla Concorrência"
        ? outcome.status === "approved" // Apenas aprovados e exclui indeferidos no AC
        : outcome.application?.data?.vaga.includes(selectedCategory) &&
          outcome.status === "approved")
  );

  const maskCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "XXX.$2.$3-XX");
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    // Configurações para centralizar o texto
    const pageWidth = doc.internal.pageSize.getWidth();
    const title1 = "EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024";
    const title2 = "PROCESSO SELETIVO UNILAB – (MODELO SISU)";
    const title3 = "Curso de Medicina - Baturité";
    const title4 = `Classificação Geral: ${selectedCategory}`;

    // Centralizando o texto
    doc.text(title1, pageWidth / 2, 40, { align: "center" });
    doc.text(title2, pageWidth / 2, 60, { align: "center" });
    doc.text(title3, pageWidth / 2, 80, { align: "center" });
    doc.text(title4, pageWidth / 2, 100, { align: "center" });

    // Gerar a tabela
    doc.autoTable({
        startY: 120,
        html: "#outcomes-table",
        styles: { overflow: "linebreak", cellWidth: "wrap" },
        bodyStyles: { valign: "top" },
        columnStyles: { text: { cellWidth: "auto" } },
        theme: "grid",
    });

    doc.save("application_outcomes.pdf");
};

  if (error) {
    return <Typography>Error fetching applicationOutcomes</Typography>;
  }

  return (
    <Box sx={{ mt: 0, mb: 0 }}>
      <h3 className="pb-4 mb-2 fst-italic border-bottom">Usuários</h3>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.value}>
            <Card onClick={() => handleCategorySelect(category.value)} style={{ cursor: "pointer" }}>
              <CardContent>
                <Typography variant="h6">{category.label}</Typography>
                <Typography variant="body2">
                  {data?.data?.filter(
                    (outcome: ApplicationOutcome) =>
                      outcome.application?.data?.vaga.includes(category.value) &&
                      outcome.status === "approved"
                  ).length || 0} candidatos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedCategory && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Resultados para: {selectedCategory}
          </Typography>
          <Button variant="contained" color="primary" onClick={generatePDF}>
            Gerar PDF
          </Button>
          <table id="outcomes-table" style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px", color: "black" }}>
            <thead>
              <tr style={{ border: "1px solid black" }}>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Nome</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>CPF</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Situação</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Nota Final</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Bonificação</th>
                <th style={{ border: "1px solid black", padding: "8px", color: "black" }}>Classificação Geral</th>
              </tr>
            </thead>
            <tbody>
              {outcomesByCategory?.map((outcome: ApplicationOutcome) => (
                <tr key={outcome.id} style={{ border: "1px solid black", color: "black" }}>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.application?.data?.name}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{maskCPF(outcome.application?.data?.cpf || "")}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.classification_status === "classifiable" ? "Classificável" : ""}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.final_score}</td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>
                    {outcome.application?.data?.bonus?.map((bonus: string) => bonus.split(":")[0])}
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px", color: "black" }}>{outcome.ranking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Box>
  );
};
