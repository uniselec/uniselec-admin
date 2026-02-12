import { Result, Appeal } from "../../types/Appeal";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/appeals";

function getAppeal({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

function createAppealMutation(appeal: Appeal) {
  return { url: endpointUrl, method: "POST", body: appeal }
}

function updateAppealMutation(appeal: Appeal) {
  return {
    url: `${endpointUrl}/${appeal.id}`,
    method: "PUT",
    body: appeal
  }
}

function deleteAppealMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

export const appealApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAppeal: query<Result, { id: string }>({
      query: getAppeal,
      providesTags: ["Appeals"],
    }),
    createAppeal: mutation<Result, Appeal>({
      query: createAppealMutation,
      invalidatesTags: ["Appeals", "Applications"],
    }),
    updateAppeal: mutation<Result, Appeal>({
      query: updateAppealMutation,
      invalidatesTags: ["Appeals", "Applications"],
    }),
    deleteAppeal: mutation<void, { id: string }>({
      query: deleteAppealMutation, 
      invalidatesTags: ["Appeals", "Applications"],
    }),
  }),
});

export const {
  useGetAppealQuery,
  useCreateAppealMutation,
  useUpdateAppealMutation,
  useDeleteAppealMutation,
} = appealApiSlice;