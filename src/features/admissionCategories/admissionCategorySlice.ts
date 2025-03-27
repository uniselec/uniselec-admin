import { Result, Results, AdmissionCategoryParams, AdmissionCategory } from "../../types/AdmissionCategory";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/admission_categories";

function parseQueryParams(params: AdmissionCategoryParams) {
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

function getAdmissionCategories({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createAdmissionCategoryMutation(processSelection: AdmissionCategory) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateAdmissionCategoryMutation(processSelection: AdmissionCategory) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteAdmissionCategoryMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getAdmissionCategory({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAdmissionCategories: query<Results, AdmissionCategoryParams>({
      query: getAdmissionCategories,
      providesTags: ["AdmissionCategories"],
    }),
    getAdmissionCategory: query<Result, { id: string }>({
      query: getAdmissionCategory,
      providesTags: ["AdmissionCategories"],
    }),
    createAdmissionCategory: mutation<Result, AdmissionCategory>({
      query: createAdmissionCategoryMutation,
      invalidatesTags: ["AdmissionCategories"],
    }),
    updateAdmissionCategory: mutation<Result, AdmissionCategory>({
      query: updateAdmissionCategoryMutation,
      invalidatesTags: ["AdmissionCategories"],
    }),
    deleteAdmissionCategory: mutation<void, { id: string }>({
      query: deleteAdmissionCategoryMutation,
      invalidatesTags: ["AdmissionCategories"],
    }),
  }),
});



export const {
  useGetAdmissionCategoriesQuery,
  useCreateAdmissionCategoryMutation,
  useUpdateAdmissionCategoryMutation,
  useGetAdmissionCategoryQuery,
  useDeleteAdmissionCategoryMutation,
} = processSelectionsApiSlice;