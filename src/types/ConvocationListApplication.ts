import { AcademicUnit } from "./AcademicUnit";
import { AdmissionCategory } from "./AdmissionCategory";
import { Application } from "./Application";
import { ApplicationOutcome } from "./ApplicationOutcome";
import { ConvocationListSeat } from "./ConvocationListSeat";
import { Course } from "./Course";


export interface Results {
    data:  ConvocationListApplication[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  ConvocationListApplication;
}

export interface ConvocationListApplication {
  id?: number;

  convocation_list_id: number;

  /* inscrição & relacionamento ------------------------------------ */
  application_id: number;
  application: Application;
  course_id: number;
  course: Course;

  admission_category_id: number;
  category: AdmissionCategory;

  /* vaga eventualmente vinculada */
  seat_id?: number | null;
  seat?: ConvocationListSeat | null;

  /* dados de geração / status ------------------------------------ */
  ranking_at_generation: number;
  status: "eligible" | "convoked" | "skipped";

  /* timestamps ---------------------------------------------------- */
  created_at?: string | null;
  updated_at?: string | null;
}
export interface Links {
  prev: string;
  last: string;
  next: string;
  first: string;
}

export interface Meta {
  to: number;
  from: number;
  path: string;
  total: number;
  per_page: number;
  last_page: number;
  current_page: number;
}

export interface ConvocationListApplicationParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}
