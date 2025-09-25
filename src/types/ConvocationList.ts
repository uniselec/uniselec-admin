import { AcademicUnit } from "./AcademicUnit";


export interface Results {
    data:  ConvocationList[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  ConvocationList;
}
export interface RemapRules {
  [categoryId: number]: number[];
}

export interface ConvocationList {
  id?: number;
  name: string;
  process_selection_id: number | string;
  status?: "draft" | "published";
  published_at?: string | null;
  generated_by?: number | null;

  /**
   * Regras de remanejamento.
   * Formato:
   * {
   *   "chains": {
   *     "AC": ["LB-PPI", "LB-Q", …],
   *     "LB-PPI": ["AC", "LB-Q", …],
   *     …
   *   }
   * }
   */
  remap_rules?: RemapRules | null;

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

export interface ConvocationListParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}
