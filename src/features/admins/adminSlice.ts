import { Result, Results, AdminParams, Admin } from "../../types/Admin";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/admins";

function parseQueryParams(params: AdminParams) {
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

function getAdmins({ page = 1, perPage = 100, search = "" }) {
  const params = { page, perPage, search };
  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createAdminMutation(admin: Admin) {
  return { url: endpointUrl, method: "POST", body: admin };
}

function updateAdminMutation(admin: Admin) {
  return {
    url: `${endpointUrl}/${admin.id}`,
    method: "PUT",
    body: admin,
  };
}

function deleteAdminMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

function getAdmin({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const adminsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAdmins: query<Results, AdminParams>({
      query: getAdmins,
      providesTags: ["Admins"],
    }),
    getAdmin: query<Result, { id: string }>({
      query: getAdmin,
      providesTags: ["Admins"],
    }),
    createAdmin: mutation<Result, Admin>({
      query: createAdminMutation,
      invalidatesTags: ["Admins"],
    }),
    updateAdmin: mutation<Result, Admin>({
      query: updateAdminMutation,
      invalidatesTags: ["Admins"],
    }),
    deleteAdmin: mutation<void, { id: string }>({
      query: deleteAdminMutation,
      invalidatesTags: ["Admins"],
    }),
    resendPasswordLinkAdmin: mutation<void, { email: string }>({
      query: (body) => ({
        url: "/resend-password-link",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetAdminQuery,
  useResendPasswordLinkAdminMutation
} = adminsApiSlice;
