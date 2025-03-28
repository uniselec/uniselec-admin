import { AcademicUnit } from "./AcademicUnit";


export interface Results {
    data:  Course[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  Course;
}

export interface Course {
  id?: number;
  name: string;
  modality: string;
  vacancies?: number;
  academic_unit: AcademicUnit;
  vacanciesByCategory?: { [categoryName: string]: number };
  created_at?: null | string;
  updated_at?: null | string;
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

export interface CourseParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}