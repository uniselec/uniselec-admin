import { Result, Results, UserParams, User } from "../../types/User";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/users";

function parseQueryParams(params: UserParams) {
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

function getUsers({ page = 1, perPage = 100, search = "" }) {
  const params = { page, perPage, search };
  return `${endpointUrl}?${parseQueryParams(params)}`;
}


function createUserMutation(user: User) {
  return { url: endpointUrl, method: "POST", body: user };
}

function updateUserMutation(user: User) {
  return {
    url: `${endpointUrl}/${user.id}`,
    method: "PUT",
    body: user,
  };
}

function deleteUserMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}

function getUser({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      Results,
      { page: number; perPage: number; filters: Record<string, string>; search?: string }
    >({
      query: ({ page, perPage, filters, search = "" }) => {
        const params = new URLSearchParams({
          page: String(page),
          per_page: String(perPage),
        });
        if (search) params.append("search", search);          // ← NOVO
        Object.entries(filters).forEach(
          ([key, value]) => value && params.append(key, value)
        );
        return `/users?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),
    getUser: builder.query<Result, { id: string | number }>({
      query: getUser,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<Result, User>({
      query: createUserMutation,
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<Result, User>({
      query: updateUserMutation,
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<void, { id: string }>({
      query: deleteUserMutation,
      invalidatesTags: ["Users"],
    }),
    printDeclaration: builder.query<Blob, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/${userId}/declaration`,
        responseHandler: (response: Response) => response.blob(),
      }),
      providesTags: ["Users"],
    }),
    exportUsersCsv: builder.mutation<Blob, { filters?: Record<string, string> }>({
      query: ({ filters = {} }) => {
        const qs = new URLSearchParams(filters).toString();
        return {
          url: `/users/export${qs ? `?${qs}` : ""}`,
          method: "GET",
          // força o fetchBaseQuery a devolver o corpo como Blob
          responseHandler: (response: Response) => response.blob(),
          // CSV explícito — mas o baseQuery já coloca o Authorization
          headers: { Accept: "text/csv" },
        };
      },
    }),
    downloadUserDocument: builder.mutation<Blob, { userId: string; path: string }>({
      query: ({ userId, path }) => ({
        url: `/users/${userId}/documents/download?path=${encodeURIComponent(path)}`,
        method: 'GET',
        responseHandler: (response: Response) => response.blob(),
        headers: { Accept: 'application/pdf' },
      }),
    }),
    resendPasswordLink: builder.mutation<void, { email: string }>({
      query: (body) => ({
        url: "/resend-password-link-user",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useResendPasswordLinkMutation,
  useLazyPrintDeclarationQuery,
  useExportUsersCsvMutation,
  useDownloadUserDocumentMutation
} = usersApiSlice;
