// features/courses/courseSlice.ts
import { Result, Results, ConvocationListApplicationParams, ConvocationListApplication } from "../../types/ConvocationListApplication";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/convocation_list_applications";

function parseQueryParams(params: ConvocationListApplicationParams) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.perPage) query.append("per_page", params.perPage.toString());
  if (params.search) query.append("search", params.search);
  return query.toString();
}

function getConvocationListApplications({ page = 1, perPage = 10, search = "" }) {
  return `${endpointUrl}?${parseQueryParams({ page, perPage, search })}`;
}

function createConvocationListApplicationMutation(course: ConvocationListApplication) {
  return { url: endpointUrl, method: "POST", body: course };
}

function updateConvocationListApplicationMutation(course: ConvocationListApplication) {
  return { url: `${endpointUrl}/${course.id}`, method: "PUT", body: course };
}

function deleteConvocationListApplicationMutation({ id }: { id: string }) {
  return { url: `${endpointUrl}/${id}`, method: "DELETE" };
}

function getConvocationListApplication({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getConvocationListApplications: query<Results, { page: number; perPage: number; filters: Record<string, string> }>({
      query: ({ page, perPage, filters }) => {
        const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        return `${endpointUrl}?${params.toString()}`;
      },
      providesTags: ["ConvocationListApplications"],
    }),
    getConvocationListApplication: query<Result, { id: string }>({
      query: getConvocationListApplication,
      providesTags: ["ConvocationListApplications"],
    }),
    createConvocationListApplication: mutation<Result, ConvocationListApplication>({
      query: createConvocationListApplicationMutation,
      invalidatesTags: ["ConvocationListApplications"],
    }),
    updateConvocationListApplication: mutation<Result, ConvocationListApplication>({
      query: updateConvocationListApplicationMutation,
      invalidatesTags: ["ConvocationListApplications"],
    }),
    deleteConvocationListApplication: mutation<void, { id: string }>({
      query: deleteConvocationListApplicationMutation,
      invalidatesTags: ["ConvocationListApplications"],
    }),
  }),
});

export const {
  useGetConvocationListApplicationsQuery,
  useCreateConvocationListApplicationMutation,
  useUpdateConvocationListApplicationMutation,
  useGetConvocationListApplicationQuery,
  useDeleteConvocationListApplicationMutation,
} = processSelectionsApiSlice;
