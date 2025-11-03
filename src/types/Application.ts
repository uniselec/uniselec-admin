import { AdmissionCategory } from "./AdmissionCategory";
import { ApplicationOutcome } from "./ApplicationOutcome";
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

export interface ResolveInconsistenciesResponse {
    application: Application[];
    applicationOutcome: ApplicationOutcome
    links: Links;
    meta: Meta;
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

export interface ResolvedInconsistencies {
    selected_name?: string | null;
    selected_birthdate?: string | null;
    selected_cpf?: string | null;
}

export interface ApplicationFragment {
    id?: number | string | undefined;
    name_source?: string | null;
    birthdate_source?: string | null;
    cpf_source?: string | null;
}

export interface Application {
    id?: string;
    process_selection_id: string;
    form_data: ApplicationFormData;
    enem_score?: EnemScore;
    verification_expected: string;
    verification_code: string;
    name_source: string | null | undefined;
    birthdate_source: string | null | undefined;
    cpf_source: string | null | undefined;
    resolved_inconsistencies: ResolvedInconsistencies;
    valid_verification_code: boolean;
    application_outcome?: ApplicationOutcome;
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
