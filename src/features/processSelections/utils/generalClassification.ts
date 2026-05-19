import { AdmissionCategory } from "../../../types/AdmissionCategory";

export const GENERAL_CLASSIFICATION_ID = 0;

export const GENERAL_CLASSIFICATION: AdmissionCategory = {
  id: GENERAL_CLASSIFICATION_ID,
  name: "GERAL",
  description: "Classificação Geral",
};

export const isGeneralClassification = (category: AdmissionCategory) =>
  category.id === GENERAL_CLASSIFICATION_ID;
