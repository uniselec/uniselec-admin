

export interface Results {
    data:  Admin[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  Admin;
}

export interface Admin {
    id:              number;
    name:            string;
    email:           string;
    login:           string;
    created_at: null | string;
    updated_at: null | string;
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

export interface AdminParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}