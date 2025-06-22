import { EnemScore } from "./EnemScore";
import { User } from "./User";


export interface Results {
    data: Application[];
    links: Links;
    meta: Meta;
}
export interface Result {
    data: Application;
}

export interface Application {
    id: number;
    user_id: number;
    form_data: FormData;
    enem_score?: EnemScore;
    verification_expected: string;
    verification_code: string;
    valid_verification_code: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface FormData {
    edital: string;
    position: string;
    location_position: string;
    name: string;
    email: string;
    cpf: string;
    social_name: string;
    phone1: string;
    address: string;
    city: string;
    sex: string;
    uf: string;
    enem: string;
    birthdate: Date;
    bonus: string;
    modalidade: string[];
    enem_year: number;
    updated_at: string;
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
}