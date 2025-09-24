import { logOut } from '../auth/authSlice';
import { RootState } from './../../app/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';



export const apiSlice = createApi({
    reducerPath: "api", tagTypes: ["Applications",
        "Users",
        "Admins",
        "EnemScores",
        "ApplicationOutcomes",
        "ProcessSelections",
        "Courses",
        "Documents",
        "AcademicUnits",
        "AdmissionCategories", "BonusOptions",
        "KnowledgeAreas",
        "ConvocationLists",
        "ConvocationListSeats",
        "ConvocationListApplications"],
    baseQuery: async (args, api, extraOptions) => {
        const state = api.getState() as RootState;
        const role = state.auth?.userDetails?.role;
        const baseUrl = role
            ? `${import.meta.env.VITE_API_URL}/api/admin/${role}`
            : `${import.meta.env.VITE_API_URL}/api/admin`;

        const customFetchBaseQuery = fetchBaseQuery({
            baseUrl,
            prepareHeaders: (headers) => {
                const token = state.auth.token;
                headers.set("Accept", "application/json");
                if (token) {
                    headers.set("Authorization", `Bearer ${token}`);
                }
                return headers;
            }
        });

        const result = await customFetchBaseQuery(args, api, extraOptions);

        // Se o token não for mais válido (erro 401), faça logout e redirecione para login
        if (result.error && result.error.status === 401) {
            api.dispatch(logOut());
            window.location.href = '/login';
        }

        return result;
    },
    endpoints: (builder) => ({}),
});



