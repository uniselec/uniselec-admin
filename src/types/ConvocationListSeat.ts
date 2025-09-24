


export interface Results {
    data:  ConvocationListSeat[];
    links: Links;
    meta:  Meta;
}
export interface Result {
    data:  ConvocationListSeat;
}

export interface ConvocationListSeat {
  id?: number;
  name: string;

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

export interface ConvocationListSeatParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}

