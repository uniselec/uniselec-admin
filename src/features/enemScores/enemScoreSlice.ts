// features/enemScores/enemScoresApiSlice.ts
import {
  Result,
  Results,
  EnemScoreParams,
  EnemScore,
  ImportSummary as Summary,      // ↳ tipo da resposta do import
} from "../../types/EnemScore";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/enem_scores";

/* ---------------------------------------------------------- */
/* Helpers                                                    */
/* ---------------------------------------------------------- */

function parseQueryParams(params: EnemScoreParams) {
  const query = new URLSearchParams();

  if (params.page)     query.append("page", params.page.toString());
  if (params.perPage)  query.append("per_page", params.perPage.toString());
  if (params.search)   query.append("search", params.search);

  return query.toString();
}

function getEnemScores(params: EnemScoreParams = {}) {
  return `${endpointUrl}?${parseQueryParams({ page: 1, perPage: 10, ...params })}`;
}

function createEnemScoreMutation(body: EnemScore) {
  return { url: endpointUrl, method: "POST", body };
}

function updateEnemScoreMutation(body: EnemScore) {
  return { url: `${endpointUrl}/${body.id}`, method: "PUT", body };
}

function deleteEnemScoreMutation({ id }: { id: string }) {
  return { url: `${endpointUrl}/${id}`, method: "DELETE" };
}

function getEnemScore({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

/* ----------------------- import --------------------------- */

type ImportPayload = {
  file: File;
  processSelectionId: number;
};

function importEnemScoresMutation(payload: ImportPayload) {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("process_selection_id", String(payload.processSelectionId));

  return { url: `${endpointUrl}/import`, method: "POST", body: form };
}
/* ---------------------------------------------------------- */
/* Slice                                                      */
/* ---------------------------------------------------------- */

export const enemScoresApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    /* CRUD */
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

    importEnemScores: mutation<Summary, ImportPayload>({
      query: importEnemScoresMutation,
      invalidatesTags: ["EnemScores"], // força lista a recarregar se precisar
    }),
  }),
});

/* ---------------------------------------------------------- */
/* Hooks                                                      */
/* ---------------------------------------------------------- */

export const {
  useGetEnemScoresQuery,
  useGetEnemScoreQuery,
  useCreateEnemScoreMutation,
  useUpdateEnemScoreMutation,
  useDeleteEnemScoreMutation,
  useImportEnemScoresMutation,
} = enemScoresApiSlice;
