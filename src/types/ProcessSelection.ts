import { AdmissionCategory } from "./AdmissionCategory";
import { BonusOption } from "./BonusOption";
import { Course } from "./Course";
import { Document } from "./Document";
import { KnowledgeArea } from "./KnowledgeArea";


export interface Results {
    data:  ProcessSelection[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  ProcessSelection;
}

export interface ProcessSelection {
    id?:            number;
    name:           string;
    description:    string;
    status:         string;
    start_date:     string;
    end_date:       string;
    type:           string;
    courses: Course[];
    documents?: Document[];
    bonus_options?: BonusOption[];
    last_applications_processed_at?: null | string;
    allowed_enem_years?: number[];
    admission_categories?: AdmissionCategory[];
    knowledge_areas?: KnowledgeArea[];
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

export interface ProcessSelectionParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}