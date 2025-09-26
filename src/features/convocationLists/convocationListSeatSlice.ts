import { apiSlice } from "../api/apiSlice";
import { ConvocationListSeat, ConvocationListSeatParams, Result, Results } from "../../types/ConvocationListSeat";

const endpointUrl = "/convocation_list_seats";

function parseQueryParams(params: ConvocationListSeatParams) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.perPage) query.append("per_page", params.perPage.toString());
  if (params.search) query.append("search", params.search);
  return query.toString();
}

function getConvocationListSeats({ page = 1, perPage = 10, search = "" }) {
  return `${endpointUrl}?${parseQueryParams({ page, perPage, search })}`;
}

function createConvocationListSeatMutation(course: ConvocationListSeat) {
  return { url: endpointUrl, method: "POST", body: course };
}

function updateConvocationListSeatMutation(course: ConvocationListSeat) {
  return { url: `${endpointUrl}/${course.id}`, method: "PUT", body: course };
}

function deleteConvocationListSeatMutation({ id }: { id: string }) {
  return { url: `${endpointUrl}/${id}`, method: "DELETE" };
}

function getConvocationListSeat({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getConvocationListSeats: query<Results, { page: number; perPage: number; filters: Record<string, string> }>({
      query: ({ page, perPage, filters }) => {
        const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        return `${endpointUrl}?${params.toString()}`;
      },
      providesTags: ["ConvocationListSeats"],
    }),
    getConvocationListSeat: query<Result, { id: string }>({
      query: getConvocationListSeat,
      providesTags: ["ConvocationListSeats"],
    }),
    createConvocationListSeat: mutation<Result, ConvocationListSeat>({
      query: createConvocationListSeatMutation,
      invalidatesTags: ["ConvocationListSeats"],
    }),
    updateConvocationListSeat: mutation<Result, ConvocationListSeat>({
      query: updateConvocationListSeatMutation,
      invalidatesTags: ["ConvocationListSeats"],
    }),
    deleteConvocationListSeat: mutation<void, { id: string }>({
      query: deleteConvocationListSeatMutation,
      invalidatesTags: ["ConvocationListSeats"],
    }),
  }),
});

export const {
  useGetConvocationListSeatsQuery,
  useCreateConvocationListSeatMutation,
  useUpdateConvocationListSeatMutation,
  useGetConvocationListSeatQuery,
  useDeleteConvocationListSeatMutation,
} = processSelectionsApiSlice;
