

export interface Results {
  data: BonusOption[];
  links: Links;
  meta: Meta;
}
export interface Result {
  data: BonusOption;
}

export interface BonusOption {
  id?: number;
  name: string;
  description?: string;
  value?: number;
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

export interface BonusOptionParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}