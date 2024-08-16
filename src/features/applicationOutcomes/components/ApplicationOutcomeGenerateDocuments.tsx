import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Link } from "react-router-dom";
import { ApplicationOutcome } from "../../../types/ApplicationOutcome";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const vagaOptions = {
  "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 5,
  "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 1,
  "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 1,
  "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 1,
  "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 5,
  "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 0,
  "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 1,
  "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).": 1,
  "AC: Ampla Concorrência": 8,
} as const;

type CategoryKey = keyof typeof vagaOptions;

const categories = [
  {
    id: 1,
    label: "LB - PPI",
    value:
      "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 2,
    label: "LB - Q",
    value:
      "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 3,
    label: "LB - PCD",
    value:
      "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 4,
    label: "LB - EP",
    value:
      "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 5,
    label: "LI - PPI",
    value:
      "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 6,
    label: "LI - Q",
    value:
      "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 7,
    label: "LI - PCD",
    value:
      "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  {
    id: 8,
    label: "LI - EP",
    value:
      "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).",
  },
  { id: 9, label: "AC: Ampla Concorrência", value: "AC: Ampla Concorrência" },
];

type Props = {
  applicationOutcomes: ApplicationOutcome[];
  categoryId: string;
};

export function ApplicationOutcomeGenerateDocuments({
  applicationOutcomes,
  categoryId,
}: Props) {
  const selectedCategory =
    categories.find((category) => category.id === parseInt(categoryId ?? "0"))
      ?.value || "AC: Ampla Concorrência";

  const filteredOutcomes = applicationOutcomes.filter((outcome: ApplicationOutcome) => {
    const vaga = outcome.application?.data?.vaga;
    return (
      outcome.status === "approved" &&
      (selectedCategory === "AC: Ampla Concorrência" ||
        (vaga && vaga.includes(selectedCategory)) ||
        (!vaga && selectedCategory === "AC: Ampla Concorrência"))
    );
  });

  const outcomeScores = filteredOutcomes.map(outcome => outcome.final_score);
  const duplicateScores = outcomeScores.reduce((acc: Record<number, number>, score) => {
    if (acc[score]) {
      acc[score]++;
    } else {
      acc[score] = 1;
    }
    return acc;
  }, {});

  const duplicateEntries = Object.entries(duplicateScores)
    .filter(([_, count]) => count > 1);

  const outcomesByCategory = filteredOutcomes
    .sort((a: ApplicationOutcome, b: ApplicationOutcome) => {
      if (b.final_score !== a.final_score) {
        return b.final_score - a.final_score;
      }

      const ageA = new Date(a.application?.data?.birtdate || "").getTime();
      const ageB = new Date(b.application?.data?.birtdate || "").getTime();
      if (ageB !== ageA) {
        return ageA - ageB;
      }

      const writingScoreA = Number(a.application?.enem_score?.scores?.writing_score || 0);
      const writingScoreB = Number(b.application?.enem_score?.scores?.writing_score || 0);
      if (writingScoreB !== writingScoreA) {
        return writingScoreB - writingScoreA;
      }

      const languageScoreA = Number(a.application?.enem_score?.scores?.language_score || 0);
      const languageScoreB = Number(b.application?.enem_score?.scores?.language_score || 0);
      if (languageScoreB !== languageScoreA) {
        return languageScoreB - languageScoreA;
      }

      const mathScoreA = Number(a.application?.enem_score?.scores?.math_score || 0);
      const mathScoreB = Number(b.application?.enem_score?.scores?.math_score || 0);
      if (mathScoreB !== mathScoreA) {
        return mathScoreB - mathScoreA;
      }

      const scienceScoreA = Number(a.application?.enem_score?.scores?.science_score || 0);
      const scienceScoreB = Number(b.application?.enem_score?.scores?.science_score || 0);
      if (scienceScoreB !== scienceScoreA) {
        return scienceScoreB - scienceScoreA;
      }

      const humanitiesScoreA = Number(a.application?.enem_score?.scores?.humanities_score || 0);
      const humanitiesScoreB = Number(b.application?.enem_score?.scores?.humanities_score || 0);
      return humanitiesScoreB - humanitiesScoreA;
    })
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

  const getFormattedBonus = (bonuses?: string[]) => {
    if (
      !bonuses ||
      bonuses.includes("Nenhuma das anteriores") ||
      bonuses.length === 0
    ) {
      return "-";
    }
    return bonuses.map((bonus: string) => bonus.split(":")[0]).join(", ");
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    const margin = 42.52;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const availableWidth = pageWidth - 2 * margin;
    const currentDateTime = new Date().toLocaleString("pt-BR");

    doc.setFontSize(10);

    // Centraliza o texto
    const title1 = "EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024";
    const title2 = "PROCESSO SELETIVO UNILAB – (MODELO SISU)";
    const title3 = "Curso de Medicina - Baturité";
    const title4 = `Classificação Geral: ${selectedCategory}`;

    // Dividir o texto que pode ultrapassar a largura da página
    const title4Lines = doc.splitTextToSize(title4, availableWidth);

    doc.text(title1, pageWidth / 2, margin, { align: "center" });
    doc.text(title2, pageWidth / 2, margin + 20, { align: "center" });
    doc.text(title3, pageWidth / 2, margin + 40, { align: "center" });

    // Adiciona o texto quebrado em múltiplas linhas
    doc.text(title4Lines, pageWidth / 2, margin + 60, { align: "center" });

    const rows = outcomesByCategory.map((outcome, index) => [
      index + 1,
      outcome.application?.enem_score?.scores?.name || "",
      maskCPF(outcome.application?.data?.cpf || ""),
      outcome.classification || "",
      outcome.final_score || "",
      getFormattedBonus(outcome.application?.data?.bonus),
    ]);

    doc.autoTable({
      head: [
        [
          "Classificação",
          "Nome",
          "CPF",
          "Situação",
          "Nota Final",
          "Bonificação",
        ],
      ],
      body: rows,
      startY: margin + 100 + title4Lines.length * 10, // Ajusta a posição inicial para a tabela
      styles: {
        overflow: "linebreak",
        cellWidth: "wrap",
        fontSize: 8,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      bodyStyles: {
        valign: "top",
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 160 },
        2: { cellWidth: 100 },
        3: { cellWidth: 60 },
        4: { cellWidth: 60 },
        5: { cellWidth: 60 },
      },
      theme: "grid",
      margin: { top: margin, left: margin, right: margin, bottom: margin },
      didParseCell: (data: {
        row: { index: number };
        cell: { styles: { fontStyle: string } };
      }) => {
        if (data.row.index < vagaOptions[selectedCategory as CategoryKey]) {
          data.cell.styles.fontStyle = "bold";
        }
      },
      didDrawPage: (pageData: any) => {
        doc.setFontSize(8);
        doc.text(
          `Data e hora de geração: ${currentDateTime}`,
          margin,
          pageHeight - 30,
          {
            align: "left",
          }
        );
        doc.text(
          `Página ${pageData.pageNumber}`,
          pageWidth - margin,
          pageHeight - 30,
          {
            align: "right",
          }
        );
      },
    });

    doc.save("application_outcomes.pdf");
  };

  return (
    <Box sx={{ mt: 0, mb: 0 }}>
      {selectedCategory && (
        <>
          <Typography variant="h6" sx={{ mt: 4, fontSize: "14px" }}>
            Resultados para: {selectedCategory}
          </Typography>

          <Button variant="contained" color="primary" onClick={generatePDF}>
            Gerar PDF
          </Button>

          {/* <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontSize: "14px" }}>
                Notas Repetidas
              </Typography>
              {duplicateEntries.length > 0 ? (
                <>
                  <Typography>
                    Foram encontradas {duplicateEntries.length} notas repetidas.
                  </Typography>
                  <ul>
                    {duplicateEntries.map(([score, count], index) => (
                      <li key={index}>
                        Nota: {score}, Repetições: {count}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Typography>Não há notas repetidas.</Typography>
              )}
            </CardContent>
          </Card> */}

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
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  Classificação
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  Nome
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  CPF
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  Situação
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  Nota Final
                </th>
                <th
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  Bonificação
                </th>
              </tr>
            </thead>
            <tbody>
              {outcomesByCategory.map((outcome, index) => (
                <tr
                  key={outcome.id}
                  style={{
                    border: "1px solid black",
                    color: "black",
                    fontWeight:
                      outcome.classification === "Classificado"
                        ? "bold"
                        : "normal",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      color: "black",
                      whiteSpace: "normal",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      color: "black",
                      whiteSpace: "normal",
                    }}
                  >
                    <Link
                      to={`/application-outcomes/edit/${outcome.id}`}
                      style={{ textDecoration: "none", color: "blue" }}
                    >
                      {outcome?.application?.enem_score?.scores?.name}
                    </Link>
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      color: "black",
                      whiteSpace: "normal",
                    }}
                  >
                    {maskCPF(outcome.application?.data?.cpf || "")}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      color: "black",
                      whiteSpace: "normal",
                    }}
                  >
                    {outcome.classification}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      color: "black",
                      whiteSpace: "normal",
                    }}
                  >
                    {outcome.final_score}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      color: "black",
                      whiteSpace: "normal",
                    }}
                  >
                    {getFormattedBonus(outcome.application?.data?.bonus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Box>
  );
}
