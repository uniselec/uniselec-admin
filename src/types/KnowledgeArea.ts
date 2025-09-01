export interface KnowledgeArea {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Results {
  data: KnowledgeArea[];
  links: Links;
  meta: Meta;
}

export interface Result {
  data: KnowledgeArea;
}

export interface KnowledgeAreaParams {
  page?: number;
  perPage?: number;
  search?: string;
  slug?: string[]; 
  isActive?: boolean;
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