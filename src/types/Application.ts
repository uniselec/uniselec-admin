import { AdmissionCategory } from "./AdmissionCategory";
import { BonusOption } from "./BonusOption";
import { Course } from "./Course";
import { EnemScore } from "./EnemScore";

export interface Results {
    data: Application[];
    links: Links;
    meta: Meta;
}

export interface Result {
    data: Application;
}

export interface ApplicationFormData {
    edital: string;
    position: Course;
    name?: string;
    social_name?: string;
    email?: string;
    cpf: string;
    birthdate?: string;
    enem_year?: number;
    sex: string;
    phone1: string;
    address: string;
    uf: string;
    city: string;
    enem: string;
    admission_categories: AdmissionCategory[];
    bonus: BonusOption;
    termsAgreement: boolean;
    updated_at?: string;
}

export interface Application {
    id?: string;
    process_selection_id: string;
    form_data: ApplicationFormData;
    enem_score?: EnemScore;
    verification_expected: string;
    verification_code: string;
    valid_verification_code: boolean;
    created_at: string | null;
    updated_at: string | null;
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

export interface ApplicationParams {
    page?: number;
    perPage?: number;
    search?: string;
    isActive?: boolean;
    process_selection_id?: string;
}
