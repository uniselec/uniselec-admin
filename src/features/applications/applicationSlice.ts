import { Result, Results, ApplicationParams, Application } from "../../types/Application";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/applications";

function parseQueryParams(params: ApplicationParams) {
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
  if (params.process_selection_id) {
    query.append("process_selection_id", params.process_selection_id.toString());
  }
  return query.toString();
}


function getApplications(params: ApplicationParams = {}) {
  return `${endpointUrl}?${parseQueryParams({ page: 1, perPage: 10, ...params })}`;
}

function createApplicationMutation(processSelection: Application) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateApplicationMutation(processSelection: Application) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteApplicationMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getApplication({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getApplications: query<Results, ApplicationParams>({
      query: getApplications,
      providesTags: ["Applications"],
    }),
    getApplication: query<Result, { id: string }>({
      query: getApplication,
      providesTags: ["Applications"],
    }),
    createApplication: mutation<Result, Application>({
      query: createApplicationMutation,
      invalidatesTags: ["Applications"],
    }),
    updateApplication: mutation<Result, Application>({
      query: updateApplicationMutation,
      invalidatesTags: ["Applications"],
    }),
    deleteApplication: mutation<void, { id: string }>({
      query: deleteApplicationMutation,
      invalidatesTags: ["Applications"],
    }),
  }),
});



export const {
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useGetApplicationQuery,
  useDeleteApplicationMutation,
} = processSelectionsApiSlice;