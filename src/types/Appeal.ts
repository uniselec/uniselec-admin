import { AppealDocument } from "./AppealDocument";

export interface Appeal {
  id?: string;
  application_id: number | string;
  justification: string;
  decision?: null | string;
  status?: string;
  reviewed_by?: null | string;
  documents?: null | AppealDocument[];
  created_at?: null | string;
  updated_at?: null | string;
}

export interface Result {
  data: Appeal;
}