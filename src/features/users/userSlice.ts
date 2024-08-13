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

function getUsers({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  // return `${endpointUrl}?${parseQueryParams(params)}`; //Quero buscar tudo e filtrar no cliente
  return `${endpointUrl}?per_page=4000`;
}



function getUser({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getUsers: query<Results, UserParams>({
      query: getUsers,
      providesTags: ["Users"],
    }),
    getUser: query<Result, { id: string }>({
      query: getUser,
      providesTags: ["Users"],
    })
  }),
});


export const {
  useGetUsersQuery,
  useGetUserQuery,
} = usersApiSlice;