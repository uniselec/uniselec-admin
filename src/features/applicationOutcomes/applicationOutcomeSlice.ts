import { Result, Results, ApplicationOutcomeParams, ApplicationOutcome } from "../../types/ApplicationOutcome";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/application_outcomes";

function parseQueryParams(params: ApplicationOutcomeParams) {
  const query = new URLSearchParams();

  if (params.page) {
    query.append("page", params.page.toString());
  }

  if (params.perPage) {
    query.append("per_page", params.perPage.toString());
  }

  if (params.search) {
    query.append("search", params.search);
  }

  return query.toString();
}

function getApplicationOutcomes({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function generateOutcome({ selectionId }: { selectionId: string }) {
  return {
    url: `/process_selections/${selectionId}/outcomes`,
    method: "POST",
  };
}

function generateOutcomeNoPending({ selectionId }: { selectionId: string }) {
  return {
    url: `/process_selections/${selectionId}/outcomes_without_pending`, // ou outcomes-no-pending
    method: "POST",
  };
}

function updateApplicationOutcomeMutation(application: ApplicationOutcome) {
  return {
    url: `${endpointUrl}/${application.id}`,
    method: "PATCH",
    body: application,
  };
}

function getApplicationOutcome({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const applicationOutcomesApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getApplicationOutcomes: query<Results, { page: number; perPage: number; filters: Record<string, string> }>({
      query: ({ page, perPage, filters }) => {
        const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        return `${endpointUrl}?${params.toString()}`;
      },
      providesTags: ["ApplicationOutcomes"],
    }),
    getApplicationOutcome: query<Result, { id: string }>({
      query: getApplicationOutcome,
      providesTags: ["ApplicationOutcomes"],
    }),
    generateApplicationOutcome: mutation<
      Result,
      { selectionId: string }
    >({
      query: generateOutcome,
      invalidatesTags: ["ApplicationOutcomes"],
    }),

    /* gerar resultados – SEM pendentes */
    generateApplicationOutcomeWithoutPending: mutation<
      Result,
      { selectionId: string }
    >({
      query: generateOutcomeNoPending,
      invalidatesTags: ["ApplicationOutcomes"],
    }),
    updateApplicationOutcome: mutation<Result, ApplicationOutcome>({
      query: updateApplicationOutcomeMutation,
      invalidatesTags: ["ApplicationOutcomes"],
    }),
  }),
});


export const {
  useGetApplicationOutcomesQuery,
  useGenerateApplicationOutcomeWithoutPendingMutation,
  useGenerateApplicationOutcomeMutation,
  useUpdateApplicationOutcomeMutation,
  useGetApplicationOutcomeQuery,
} = applicationOutcomesApiSlice;