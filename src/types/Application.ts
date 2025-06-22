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
    id: string;
    user?: User;

    enem_score?: EnemScore;
    verification_expected: string;
    verification_code: string;
    valid_verification_code: boolean;
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

export interface ApplicationParams {
    page?: number;
    perPage?: number;
    search?: string;
    isActive?: boolean;
}