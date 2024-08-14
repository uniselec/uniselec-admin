import { Result, Results, ApplicationOutcomeParams, ApplicationOutcome } from "../../types/ApplicationOutcome";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/application-outcomes";

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

  if (params.isActive) {
    query.append("is_active", params.isActive.toString());
  }

  return query.toString();
}

function getApplicationOutcomes({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search, isActive: true };

  // return `${endpointUrl}?${parseQueryParams(params)}`;
  return `${endpointUrl}?per_page=4000`;
}


function generateApplicationOutcomeMutation() {
  return { url: `process-outcomes`, method: "POST" };
}
function generateApplicationOutcomeWitoutPendingMutation() {
  return { url: `process-outcomes-without-pending`, method: "POST" };
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
    getApplicationOutcomes: query<Results, ApplicationOutcomeParams>({
      query: getApplicationOutcomes,
      providesTags: ["ApplicationOutcomes"],
    }),
    getApplicationOutcome: query<Result, { id: string }>({
      query: getApplicationOutcome,
      providesTags: ["ApplicationOutcomes"],
    }),
    generateApplicationOutcome: mutation<Result, void>({
      query: generateApplicationOutcomeMutation,
      invalidatesTags: ["ApplicationOutcomes"],
    }),
    generateApplicationOutcomeWithoutPending: mutation<Result, void>({
      query: generateApplicationOutcomeWitoutPendingMutation,
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