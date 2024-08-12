import { RootState } from './../../app/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseUrl = import.meta.env.VITE_API_URL+'/api/backoffice';

export const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Applications", "Users", "Admins", "EnemScores", "ApplicationOutcomes"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({}),
});