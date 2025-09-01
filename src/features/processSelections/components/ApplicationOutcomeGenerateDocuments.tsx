/* --------------------------------------------------------------------------
 * src/features/applicationResults/components/ApplicationOutcomeGenerateDocuments.tsx
 * -------------------------------------------------------------------------- */
import {
  Box,
  Typography,
  Button,
  Link as MuiLink,          // ← já estava importado; mantido
} from "@mui/material";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

import { ApplicationOutcome } from "../../../types/ApplicationOutcome";
import { ProcessSelection } from "../../../types/ProcessSelection";
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { Course } from "../../../types/Course";
import { GenerateOutcomes } from "../GenerateOutcomes";
const maskCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "XXX.$2.$3-XX");
};


/* ---------- Props -------------------------------------------------------- */
type Props = {
  applicationOutcomes: ApplicationOutcome[];
  processSelection: ProcessSelection;
  admissionCategory: AdmissionCategory;
  course: Course;
  vacancies: number;
};


export function ApplicationOutcomeGenerateDocuments({
  applicationOutcomes,
  processSelection,
  admissionCategory,
  course,
  vacancies,
}: Props) {

  const sortByCriteria = (a: ApplicationOutcome, b: ApplicationOutcome): number => {
    /* 1. nota final */
    if (b.final_score !== a.final_score) return b.final_score - a.final_score;

    /* 2. idade – mais velho primeiro */
    const bornA = Date.parse(a.application?.form_data?.birthdate ?? "");
    const bornB = Date.parse(b.application?.form_data?.birthdate ?? "");
    if (!Number.isNaN(bornA) && !Number.isNaN(bornB) && bornA !== bornB) {
      return bornA - bornB;               // quanto menor a data, mais velho
    }

    /* 3. notas por área (ordem fixa) */
    const fields = [
      "writing_score",
      "language_score",
      "math_score",
      "science_score",
      "humanities_score",
    ] as const;

    for (const f of fields) {
      const diff =
        Number(b.application?.enem_score?.scores?.[f] ?? 0) -
        Number(a.application?.enem_score?.scores?.[f] ?? 0);
      if (diff !== 0) return diff;
    }

    /* 4. totalmente empatado */
    return 0;
  };

  /* array já ordenado + flag de classificação */
  const classifiedOutcomes = [...applicationOutcomes]
    .sort(sortByCriteria)
    .map((o, idx) => ({
      ...o,
      classification: idx < vacancies ? "Classificado" : "Classificável",
    }));

  // The order of the input array defines the priority
  const getValidName = (names: Array<string | null | undefined>): string => {
    const invalids = [null, undefined, "", "N/A"];
    return names.find(name => !invalids.includes(name)) || "";
  }

  const generateDocx = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "EDITAL PROGRAD Nº 12/2024, DE 31 DE JULHO DE 2024",
                  bold: true,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "PROCESSO SELETIVO UNILAB – (MODELO SISU)",
                  bold: true,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Curso de Medicina - Baturité",
                  bold: true,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Classificação Geral: AAA`,
                  bold: true,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({
              text: "",
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Classificação")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Nome")],
                    }),
                    new TableCell({
                      children: [new Paragraph("CPF")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Situação")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Nota Final")],
                    }),
                    new TableCell({
                      children: [new Paragraph("Bonificação")],
                    }),
                  ],
                }),
                ...classifiedOutcomes.map((outcome, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph((index + 1).toString())],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            getValidName([
                              outcome.application?.form_data?.social_name,    // priority 1
                              outcome.application?.enem_score?.scores?.name, // priority 2
                              outcome.application?.form_data?.name           // priority 3
                            ])
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            maskCPF(outcome.application?.form_data?.cpf || "")
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [new Paragraph(outcome.classification || "")],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(outcome.final_score.toString()),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            outcome.application?.form_data?.bonus?.value !== undefined && outcome.application?.form_data?.bonus?.value !== null
                              ? outcome.application.form_data.bonus.value.toString()
                              : "Nenhuma bonificação"
                          ),
                        ],
                      }),
                    ],
                  })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "application_outcomes.docx");
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");

    const margin = 42.52;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const availableWidth = pageWidth - 2 * margin;
    const currentDateTime = new Date().toLocaleString("pt-BR");

    doc.setFontSize(10);
    doc.text(
      processSelection.name,
      pageWidth / 2,
      margin,
      { align: "center" }
    );
    doc.text(
      processSelection.description,
      pageWidth / 2,
      margin + 20,
      { align: "center" }
    );
    doc.text(`${course.name} - ${course?.academic_unit.name} (${course?.academic_unit?.state})`, pageWidth / 2, margin + 40, {
      align: "center",
    });

    const wrappedTitle = doc.splitTextToSize(
      `Classificação Geral: ${admissionCategory.description}`,
      availableWidth
    );
    doc.text(wrappedTitle, margin, margin + 70);

    const rows = classifiedOutcomes.map((outcome, index) => [
      index + 1,
      getValidName([
        outcome.application?.form_data?.social_name,    // priority 1
        outcome.application?.enem_score?.scores?.name, // priority 2
        outcome.application?.form_data?.name           // priority 3
      ]),
      maskCPF(outcome.application?.form_data?.cpf || ""),
      outcome.classification || "",
      outcome.final_score || "",
      outcome.application?.form_data?.bonus?.value || "Nenhuma bonificação"
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
      startY: margin + 100,
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
        if (data.row.index < vacancies) {
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
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5">
        Processo: {processSelection.name}
        {course && <> — Curso: {course.name}</>}
        {admissionCategory && <> — Modalidade: {admissionCategory.name} - Nº de Vagas: {vacancies}</>}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", width: "100%" }}>
          <Button variant="contained" color="primary" onClick={generatePDF}>
            Gerar PDF
          </Button>
          <Button variant="contained" color="secondary" onClick={generateDocx}>
            Gerar Word
          </Button>
        </Box>
      </Box>
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
          {classifiedOutcomes.map((outcome, index) => (
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
                  {outcome?.application?.form_data?.name}
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
                {maskCPF(outcome.application?.form_data?.cpf || "")}
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
                {outcome.application?.form_data?.bonus?.value || "Nenhuma bonificação"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
