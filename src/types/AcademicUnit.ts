

export interface Results {
  data: AcademicUnit[];
  links: Links;
  meta: Meta;
}
export interface Result {
  data: AcademicUnit;
}

export interface AcademicUnit {
  id?: number;
  name: string;
  description: string;
  state: string;
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

export interface AcademicUnitParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}