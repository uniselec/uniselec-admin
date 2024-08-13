import { Application } from "./Application";
import { User } from "./User";

export interface Results {
    data: ApplicationOutcome[];
    links: Links;
    meta: Meta;
}

export interface Result {
    data: ApplicationOutcome;
}

export interface ApplicationOutcome {
    id: string;
    application_id: number;
    application?: Application;
    status: string;
    classification_status: string;
    average_score: number;
    final_score: number;
    ranking: number;
    reason: string;
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

export interface ApplicationOutcomeParams {
    page?: number;
    perPage?: number;
    search?: string;
    isActive?: boolean;
}
