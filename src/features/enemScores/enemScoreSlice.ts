import { Result, Results, EnemScoreParams, EnemScore } from "../../types/EnemScore";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/enem_scores";

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

  return query.toString();
}

function getEnemScores({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createEnemScoreMutation(processSelection: EnemScore) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateEnemScoreMutation(processSelection: EnemScore) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteEnemScoreMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getEnemScore({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
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
    deleteEnemScore: mutation<void, { id: string }>({
      query: deleteEnemScoreMutation,
      invalidatesTags: ["EnemScores"],
    }),
  }),
});



export const {
  useGetEnemScoresQuery,
  useCreateEnemScoreMutation,
  useUpdateEnemScoreMutation,
  useGetEnemScoreQuery,
  useDeleteEnemScoreMutation,
} = processSelectionsApiSlice;