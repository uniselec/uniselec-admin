import { Result, Results, KnowledgeAreaParams, KnowledgeArea } from "../../types/KnowledgeArea";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/knowledge_areas";

function parseQueryParams(params: KnowledgeAreaParams) {
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

function getKnowledgeAreas({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function getKnowledgeArea({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

function createKnowledgeAreaMutation(processSelection: KnowledgeArea) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateKnowledgeAreaMutation(processSelection: KnowledgeArea) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteKnowledgeAreaMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getKnowledgeAreas: query<Results, KnowledgeAreaParams>({
      query: getKnowledgeAreas,
      providesTags: ["KnowledgeAreas"],
    }),
    getKnowledgeArea: query<Result, { id: string }>({
      query: getKnowledgeArea,
      providesTags: ["KnowledgeAreas"],
    }),
    createKnowledgeArea: mutation<Result, KnowledgeArea>({
      query: createKnowledgeAreaMutation,
      invalidatesTags: ["KnowledgeAreas"],
    }),
    updateKnowledgeArea: mutation<Result, KnowledgeArea>({
      query: updateKnowledgeAreaMutation,
      invalidatesTags: ["KnowledgeAreas"],
    }),
    deleteKnowledgeArea: mutation<void, { id: string }>({
      query: deleteKnowledgeAreaMutation,
      invalidatesTags: ["KnowledgeAreas"],
    }),
  }),
});


export const {
  useGetKnowledgeAreasQuery,
  useGetKnowledgeAreaQuery,
  useCreateKnowledgeAreaMutation,
  useUpdateKnowledgeAreaMutation,
  useDeleteKnowledgeAreaMutation,
} = processSelectionsApiSlice;