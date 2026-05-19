import { ApplicationOutcome } from "../../../types/ApplicationOutcome";

export type ClassifiedOutcome = ApplicationOutcome & { classification: string };

export const maskCPF = (cpf: string): string =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "XXX.$2.$3-XX");

export const getValidName = (names: Array<string | null | undefined>): string => {
  const invalids = [null, undefined, "", "N/A"];
  return names.find(name => !invalids.includes(name)) ?? "";
};

const getBirthTimestamp = (outcome: ApplicationOutcome): number | null => {
  const source = outcome.application?.birthdate_source;
  if (source === "enem") {
    const brDate = outcome.application?.enem_score?.scores?.birthdate;
    if (!brDate) return null;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(brDate);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    const date = new Date(+yyyy, +mm - 1, +dd);
    const ts = date.getTime();
    return Number.isNaN(ts) ? null : ts;
  }
  const isoDate = outcome.application?.form_data?.birthdate;
  if (!isoDate) return null;
  const ts = new Date(isoDate).getTime();
  return Number.isNaN(ts) ? null : ts;
};

export const sortByCriteria = (outcomeA: ApplicationOutcome, outcomeB: ApplicationOutcome): number => {
  if (outcomeB.final_score !== outcomeA.final_score) return outcomeB.final_score - outcomeA.final_score;
  const bornA = getBirthTimestamp(outcomeA);
  const bornB = getBirthTimestamp(outcomeB);
  if (bornA !== null && bornB !== null && bornA !== bornB) return bornA - bornB;
  const fields = [
    "writing_score",
    "language_score",
    "math_score",
    "science_score",
    "humanities_score",
  ] as const;
  for (const field of fields) {
    const diff =
      Number(outcomeB.application?.enem_score?.scores?.[field] ?? 0) -
      Number(outcomeA.application?.enem_score?.scores?.[field] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

export const classifyOutcomes = (
  outcomes: ApplicationOutcome[],
  vacancies: number,
): ClassifiedOutcome[] =>
  [...outcomes]
    .sort(sortByCriteria)
    .map((outcome, idx) => ({
      ...outcome,
      classification: idx < vacancies ? "Classificado" : "Classificável",
    }));
