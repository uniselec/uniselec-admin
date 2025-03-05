import { RootState } from './../../app/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL + '/api/admin';

const fetchWithTimeout = async (url: RequestInfo, options: RequestInit = {}) => {
    const timeout = 480000; // Define o tempo limite como 480000ms (8 minutos)

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        return response;
    } finally {
        clearTimeout(id);
    }
};

export const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Applications", "Users", "Admins", "EnemScores", "ApplicationOutcomes", "ProcessSelections"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
        fetchFn: fetchWithTimeout, // Substitui a função fetch padrão com controle de timeout
    }),
    endpoints: (builder) => ({}),
});
