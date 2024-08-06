

export interface Results {
  data: User[];
  links: Links;
  meta: Meta;
}
export interface Result {
  data: User;
}

export interface User {
  id?: number;
  name?: string;
  email?: string;
  cpf?: string;
  password?: string;
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

export interface UserParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}