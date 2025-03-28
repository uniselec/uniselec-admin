

export interface Results {
  data: AdmissionCategory[];
  links: Links;
  meta: Meta;
}
export interface Result {
  data: AdmissionCategory;
}

export interface AdmissionCategory {
  id: number; // Alterado de "id?: number" para "id: number"
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
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

export interface AdmissionCategoryParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}