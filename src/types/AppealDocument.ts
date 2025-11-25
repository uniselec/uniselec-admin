export interface AppealDocument {
  id?: string;
  appeal_id?: number | string;
  path: string;
  original_name: string;
  created_at?: null | string;
}

export interface Result {
  data: AppealDocument;
}
