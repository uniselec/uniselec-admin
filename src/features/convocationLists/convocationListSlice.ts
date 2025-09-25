// features/courses/courseSlice.ts
import { Result, Results, ConvocationListParams, ConvocationList } from "../../types/ConvocationList";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/convocation_lists";

function parseQueryParams(params: ConvocationListParams) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.perPage) query.append("per_page", params.perPage.toString());
  if (params.search) query.append("search", params.search);
  return query.toString();
}

function getConvocationLists({ page = 1, perPage = 10, search = "" }) {
  return `${endpointUrl}?${parseQueryParams({ page, perPage, search })}`;
}

function createConvocationListMutation(course: ConvocationList) {
  return { url: endpointUrl, method: "POST", body: course };
}

function updateConvocationListMutation(course: ConvocationList) {
  return { url: `${endpointUrl}/${course.id}`, method: "PUT", body: course };
}

function deleteConvocationListMutation({ id }: { id: string }) {
  return { url: `${endpointUrl}/${id}`, method: "DELETE" };
}

function getConvocationList({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

function postNoBody(path: string) {
  return ({ id }: { id: string }) => ({
    url: `${endpointUrl}/${id}/${path}`,
    method: "POST",
  });
}
function generateSeatsMutation({ id, seats }: { id: string; seats: any[] }) {
  return {
    url: `${endpointUrl}/${id}/generate-seats`,
    method: "POST",
    body: { seats },
  };
}


export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    generateSeats: mutation<
      { message: string; created: number },
      { id: string; seats: any[] }
    >({
      query: generateSeatsMutation,
      invalidatesTags: ["ConvocationLists", "ConvocationListSeats"],
    }),
    generateApplications: mutation<{ message: string }, { id: string }>({
      query: postNoBody("generate-applications"),
      invalidatesTags: ["ConvocationLists", "ConvocationListApplications"],
    }),
    allocateSeats: mutation<{ message: string }, { id: string }>({
      query: postNoBody("allocate-seats"),
      invalidatesTags: ["ConvocationLists", "ConvocationListSeats"],
    }),
    publishConvocationList: mutation<{ data: ConvocationList }, { id: string }>({
      query: ({ id }) => ({
        url: `${endpointUrl}/${id}`,
        method: "PATCH",
        body: {
          status: "published",
          published_at: new Date().toISOString(),
        },
      }),
      invalidatesTags: ["ConvocationLists"],
    }),
    getConvocationLists: query<Results, ConvocationListParams>({
      query: getConvocationLists,
      providesTags: ["ConvocationLists"],
    }),
    getConvocationList: query<Result, { id: string }>({
      query: getConvocationList,
      providesTags: ["ConvocationLists"],
    }),
    createConvocationList: mutation<Result, ConvocationList>({
      query: createConvocationListMutation,
      invalidatesTags: ["ConvocationLists"],
    }),
    updateConvocationList: mutation<Result, ConvocationList>({
      query: updateConvocationListMutation,
      invalidatesTags: ["ConvocationLists"],
    }),
    deleteConvocationList: mutation<void, { id: string }>({
      query: deleteConvocationListMutation,
      invalidatesTags: ["ConvocationLists"],
    }),
  }),
});

export const {
  useGetConvocationListsQuery,
  useCreateConvocationListMutation,
  useUpdateConvocationListMutation,
  useGetConvocationListQuery,
  useDeleteConvocationListMutation,
  useGenerateSeatsMutation,
  useGenerateApplicationsMutation,
  useAllocateSeatsMutation,
  usePublishConvocationListMutation,
} = processSelectionsApiSlice;
