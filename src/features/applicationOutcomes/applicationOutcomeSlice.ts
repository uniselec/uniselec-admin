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

function createApplicationOutcomeMutation(processSelection: ApplicationOutcome) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateApplicationOutcomeMutation(processSelection: ApplicationOutcome) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteApplicationOutcomeMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getApplicationOutcome({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getApplicationOutcomes: query<Results, ApplicationOutcomeParams>({
      query: getApplicationOutcomes,
      providesTags: ["ApplicationOutcomes"],
    }),
    getApplicationOutcome: query<Result, { id: string }>({
      query: getApplicationOutcome,
      providesTags: ["ApplicationOutcomes"],
    }),
    createApplicationOutcome: mutation<Result, ApplicationOutcome>({
      query: createApplicationOutcomeMutation,
      invalidatesTags: ["ApplicationOutcomes"],
    }),
    updateApplicationOutcome: mutation<Result, ApplicationOutcome>({
      query: updateApplicationOutcomeMutation,
      invalidatesTags: ["ApplicationOutcomes"],
    }),
    deleteApplicationOutcome: mutation<void, { id: string }>({
      query: deleteApplicationOutcomeMutation,
      invalidatesTags: ["ApplicationOutcomes"],
    }),
  }),
});



export const {
  useGetApplicationOutcomesQuery,
  useCreateApplicationOutcomeMutation,
  useUpdateApplicationOutcomeMutation,
  useGetApplicationOutcomeQuery
} = processSelectionsApiSlice;