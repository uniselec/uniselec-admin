import { apiSlice } from "./apiSlice";

const apiUrl = import.meta.env.VITE_API_URL;

export type ApiHealthcheckResponse = {
  status: string;
  timestamp: string;
  database: string;
};

export const healthCheckSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApiHealthcheck: builder.query<ApiHealthcheckResponse, void>({
      query: () => ({
        url: `${apiUrl}/api/healthcheck`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetApiHealthcheckQuery } = healthCheckSlice;
