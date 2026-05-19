import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { ApplicationOutcome } from "../../../types/ApplicationOutcome";
import { ProcessSelection } from "../../../types/ProcessSelection";
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { Course } from "../../../types/Course";
import { classifyOutcomes, maskCPF } from "../utils/outcomeUtils";
import { GENERAL_CLASSIFICATION_ID } from "../utils/generalClassification";

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
  const classifiedOutcomes = classifyOutcomes(applicationOutcomes, vacancies);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mt: 5 }}>
        {admissionCategory.id === GENERAL_CLASSIFICATION_ID
          ? admissionCategory.description
          : `Modalidade: ${admissionCategory.name} - ${vacancies} ${vacancies === 1 ? "vaga" : "vagas"}`}
      </Typography>
      <table
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
            {["Classificação", "Nome", "CPF", "Situação", "Nota Final", "Bonificação"].map(
              header => (
                <th
                  key={header}
                  style={{
                    border: "1px solid black",
                    padding: "8px",
                    color: "black",
                    whiteSpace: "normal",
                  }}
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {classifiedOutcomes.map((outcome, index) => (
            <tr
              key={outcome.id}
              style={{
                border: "1px solid black",
                color: "black",
                fontWeight: outcome.classification === "Classificado" ? "bold" : "normal",
              }}
            >
              <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                <Link
                  to={`/application-outcomes/edit/${outcome.id}`}
                  style={{ textDecoration: "none", color: "blue" }}
                >
                  {outcome?.application?.form_data?.name}
                </Link>
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {maskCPF(outcome.application?.form_data?.cpf || "")}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {outcome.classification}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {outcome.final_score}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {outcome.application?.form_data?.bonus?.value || "Nenhuma bonificação"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
