import { useEffect } from "react";
import { Typography } from "@mui/material";

import { useGetApplicationOutcomesQuery } from
  "../../applicationOutcomes/applicationOutcomeSlice";
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { Course } from "../../../types/Course";
import { ProcessSelection } from "../../../types/ProcessSelection";
import { ApplicationOutcomeGenerateDocuments } from "./ApplicationOutcomeGenerateDocuments";
import { CategoryData } from "./DocumentButtons";
import { isGeneralClassification } from "../utils/generalClassification";

type Props = {
  processSelection: ProcessSelection;
  admissionCategory: AdmissionCategory;
  course: Course;
  processSelectionId: string;
  onData?: (categoryId: number, data: CategoryData) => void;
};

export function CategoryBlock({
  processSelection,
  admissionCategory,
  course,
  processSelectionId,
  onData,
}: Props) {
  const isGeneral = isGeneralClassification(admissionCategory);
  const vacancies = isGeneral
    ? (course.vacancies ?? 0)
    : (course.vacanciesByCategory?.[admissionCategory.name] ?? 0);

  const baseFilters: Record<string, string> = {
    process_selection_id: processSelectionId,
    course_id: String(course.id),
    status: "approved",
  };
  if (!isGeneral) {
    baseFilters.admission_category_id = String(admissionCategory.id);
  }

  const { data, isFetching, error } = useGetApplicationOutcomesQuery({
    page: 1,
    perPage: 6000,
    filters: baseFilters,
  });

  const isOpenCompetition = admissionCategory.name === "AC";

  const outcomes = (() => {
    const raw = data?.data ?? [];
    if (!isOpenCompetition) return raw;
    return raw.filter(outcome => {
      const chosen = outcome.application?.form_data?.admission_categories ?? [];
      return chosen.length === 1 && chosen[0].id === admissionCategory.id;
    });
  })();

  useEffect(() => {
    if (data?.data && onData) {
      onData(admissionCategory.id!, {
        category: admissionCategory,
        outcomes,
        vacancies,
      });
    }
  }, [data]);

  const label = admissionCategory.description ?? admissionCategory.name;

  if (isFetching) return <Typography>Carregando {label}…</Typography>;
  if (error) return <Typography color="error">Erro ao carregar {label}.</Typography>;

  return (
    <ApplicationOutcomeGenerateDocuments
      applicationOutcomes={outcomes}
      processSelection={processSelection}
      admissionCategory={admissionCategory}
      course={course}
      vacancies={vacancies}
    />
  );
}
