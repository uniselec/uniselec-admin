import { Result, Results, ProcessSelectionParams, ProcessSelection } from "../../types/ProcessSelection";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/process_selections";

function parseQueryParams(params: ProcessSelectionParams) {
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

function getProcessSelections({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createProcessSelectionMutation(processSelection: ProcessSelection) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateProcessSelectionMutation(processSelection: ProcessSelection) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteProcessSelectionMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getProcessSelection({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getProcessSelections: query<Results, ProcessSelectionParams>({
      query: getProcessSelections,
      providesTags: ["ProcessSelections"],
    }),
    getProcessSelection: query<Result, { id: string }>({
      query: getProcessSelection,
      providesTags: ["ProcessSelections"],
    }),
    createProcessSelection: mutation<Result, ProcessSelection>({
      query: createProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
    updateProcessSelection: mutation<Result, ProcessSelection>({
      query: updateProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
    deleteProcessSelection: mutation<void, { id: string }>({
      query: deleteProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),

  }),
});



export const {
  useGetProcessSelectionsQuery,
  useCreateProcessSelectionMutation,
  useUpdateProcessSelectionMutation,
  useGetProcessSelectionQuery,
  useDeleteProcessSelectionMutation,
} = processSelectionsApiSlice;