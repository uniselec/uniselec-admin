import { Result, Results, EnemScoreParams, EnemScore } from "../../types/EnemScore";
import { apiSlice } from "../api/apiSlice";
const endpointUrl = "/enem-scores";

function parseQueryParams(params: EnemScoreParams) {
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

  if (params.isActive) {
    query.append("is_active", params.isActive.toString());
  }

  return query.toString();
}

function getEnemScores({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search, isActive: true };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function deleteEnemScoreMutation(category: EnemScore) {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "DELETE",
  };
}

function createEnemScoreMutation(category: EnemScore) {
  return { url: endpointUrl, method: "POST", body: category };
}

function updateEnemScoreMutation(category: EnemScore) {
  return {
    url: `${endpointUrl}/${category.id}`,
    method: "PUT",
    body: category,
  };
}

function getEnemScore({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const enemScoresApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getEnemScores: query<Results, EnemScoreParams>({
      query: getEnemScores,
      providesTags: ["EnemScores"],
    }),
    getEnemScore: query<Result, { id: string }>({
      query: getEnemScore,
      providesTags: ["EnemScores"],
    }),
    createEnemScore: mutation<Result, EnemScore>({
      query: createEnemScoreMutation,
      invalidatesTags: ["EnemScores"],
    }),
    updateEnemScore: mutation<Result, EnemScore>({
      query: updateEnemScoreMutation,
      invalidatesTags: ["EnemScores"],
    }),
  }),
});


export const {
  useGetEnemScoresQuery,
  useCreateEnemScoreMutation,
  useUpdateEnemScoreMutation,
  useGetEnemScoreQuery,
} = enemScoresApiSlice;