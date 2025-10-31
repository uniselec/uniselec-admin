import { AdmissionCategory } from "./AdmissionCategory";
import { Application } from "./Application";
import { Course } from "./Course";



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
  convocation_list_id: number;
  seat_code: string;

  course_id: number;
  course: Course;

  /* categorias de origem / atual */
  origin_admission_category_id: number;
  current_admission_category_id: number;
  origin_category: AdmissionCategory;     // eager-loaded no controller
  current_category: AdmissionCategory;    // idem

  /* vínculo com inscrição – pode ser nulo */
  application_id?: number | null;
  application?: Application | null;

  status: "open" | "reserved" | "filled";
  can_redistribute?: boolean;
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

export interface ConvocationListSeatParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: boolean;
}

