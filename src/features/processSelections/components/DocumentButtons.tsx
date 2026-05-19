import { Box, Button } from "@mui/material";
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
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { Course } from "../../../types/Course";
import { ProcessSelection } from "../../../types/ProcessSelection";
import { classifyOutcomes, maskCPF, getValidName } from "../utils/outcomeUtils";

export type CategoryData = {
  category: AdmissionCategory;
  outcomes: ApplicationOutcome[];
  vacancies: number;
};

type Props = {
  categoryDataList: CategoryData[];
  processSelection: ProcessSelection;
  course: Course;
  disabled?: boolean;
};

export function DocumentButtons({
  categoryDataList,
  processSelection,
  course,
  disabled,
}: Props) {
  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const margin = 42.52;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const availableWidth = pageWidth - 2 * margin;
    const currentDateTime = new Date().toLocaleString("pt-BR");

    doc.setFontSize(10);
    doc.text(processSelection.name, pageWidth / 2, margin, { align: "center" });
    doc.text(processSelection.description, pageWidth / 2, margin + 20, { align: "center" });
    doc.text(
      `${course.name} - ${course.academic_unit.name} (${course.academic_unit?.state})`,
      pageWidth / 2,
      margin + 40,
      { align: "center" },
    );

    let currentY = margin + 70;

    categoryDataList.forEach(({ category, outcomes, vacancies }) => {
      const classified = classifyOutcomes(outcomes, vacancies);
      const rows = classified.map((outcome, index) => [
        index + 1,
        getValidName([
          outcome.application?.form_data?.social_name,
          outcome.application?.enem_score?.scores?.name,
          outcome.application?.form_data?.name,
        ]),
        maskCPF(outcome.application?.form_data?.cpf || ""),
        outcome.classification || "",
        outcome.final_score || "",
        outcome.application?.form_data?.bonus?.value || "Nenhuma bonificação",
      ]);

      const wrappedTitle = doc.splitTextToSize(
        `${category.description ?? category.name}`,
        availableWidth,
      );
      doc.setFontSize(10);
      doc.text(wrappedTitle, margin, currentY);

      (doc as any).autoTable({
        head: [["Classificação", "Nome", "CPF", "Situação", "Nota Final", "Bonificação"]],
        body: rows,
        startY: currentY + wrappedTitle.length * 14 + 10,
        styles: {
          overflow: "linebreak",
          cellWidth: "wrap",
          fontSize: 8,
          lineColor: [0, 0, 0],
          textColor: [0, 0, 0],
        },
        bodyStyles: { valign: "top" },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 160 },
          2: { cellWidth: 100 },
          3: { cellWidth: 60 },
          4: { cellWidth: 60 },
          5: { cellWidth: 60 },
        },
        theme: "grid",
        margin: { top: margin + 60, left: margin, right: margin, bottom: margin },
        didParseCell: (data: {
          row: { index: number };
          cell: { styles: { fontStyle: string } };
        }) => {
          if (data.row.index < vacancies) data.cell.styles.fontStyle = "bold";
        },
        didDrawPage: (pageData: any) => {
          doc.setFontSize(8);
          doc.text(
            `Data e hora de geração: ${currentDateTime}`,
            margin,
            pageHeight - 30,
            { align: "left" },
          );
          doc.text(
            `Página ${pageData.pageNumber}`,
            pageWidth - margin,
            pageHeight - 30,
            { align: "right" },
          );
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 40;
    });

    doc.save("resultados.pdf");
  };

  const generateDocx = async () => {
    const children: (Paragraph | Table)[] = [
      new Paragraph({
        children: [new TextRun({ text: processSelection.name, bold: true })],
        alignment: "center",
      }),
      new Paragraph({
        children: [new TextRun({ text: processSelection.description, bold: true })],
        alignment: "center",
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${course.name} - ${course.academic_unit.name}`,
            bold: true,
          }),
        ],
        alignment: "center",
      }),
    ];

    categoryDataList.forEach(({ category, outcomes, vacancies }) => {
      const classified = classifyOutcomes(outcomes, vacancies);

      children.push(
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: `${category.description ?? category.name}`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({ text: "" }),
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Classificação")] }),
                new TableCell({ children: [new Paragraph("Nome")] }),
                new TableCell({ children: [new Paragraph("CPF")] }),
                new TableCell({ children: [new Paragraph("Situação")] }),
                new TableCell({ children: [new Paragraph("Nota Final")] }),
                new TableCell({ children: [new Paragraph("Bonificação")] }),
              ],
            }),
            ...classified.map(
              (outcome, index) =>
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph((index + 1).toString())],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(
                          getValidName([
                            outcome.application?.form_data?.social_name,
                            outcome.application?.enem_score?.scores?.name,
                            outcome.application?.form_data?.name,
                          ]),
                        ),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(
                          maskCPF(outcome.application?.form_data?.cpf || ""),
                        ),
                      ],
                    }),
                    new TableCell({
                      children: [new Paragraph(outcome.classification || "")],
                    }),
                    new TableCell({
                      children: [new Paragraph(outcome.final_score.toString())],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph(
                          outcome.application?.form_data?.bonus?.value != null
                            ? outcome.application.form_data.bonus.value.toString()
                            : "Nenhuma bonificação",
                        ),
                      ],
                    }),
                  ],
                }),
            ),
          ],
        }),
      );
    });

    const docFile = new Document({ sections: [{ properties: {}, children }] });
    const blob = await Packer.toBlob(docFile);
    saveAs(blob, "resultados.docx");
  };

  return (
    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        disabled={disabled}
      >
        Gerar PDF
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={generateDocx}
        disabled={disabled}
      >
        Gerar Word
      </Button>
    </Box>
  );
}
