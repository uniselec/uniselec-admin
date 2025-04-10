import { Result, Results, BonusOptionParams, BonusOption } from "../../types/BonusOption";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/bonus_options";

function parseQueryParams(params: BonusOptionParams) {
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

function getBonusOptions({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createBonusOptionMutation(processSelection: BonusOption) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateBonusOptionMutation(processSelection: BonusOption) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteBonusOptionMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getBonusOption({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getBonusOptions: query<Results, BonusOptionParams>({
      query: getBonusOptions,
      providesTags: ["BonusOptions"],
    }),
    getBonusOption: query<Result, { id: string }>({
      query: getBonusOption,
      providesTags: ["BonusOptions"],
    }),
    createBonusOption: mutation<Result, BonusOption>({
      query: createBonusOptionMutation,
      invalidatesTags: ["BonusOptions"],
    }),
    updateBonusOption: mutation<Result, BonusOption>({
      query: updateBonusOptionMutation,
      invalidatesTags: ["BonusOptions"],
    }),
    deleteBonusOption: mutation<void, { id: string }>({
      query: deleteBonusOptionMutation,
      invalidatesTags: ["BonusOptions"],
    }),
  }),
});



export const {
  useGetBonusOptionsQuery,
  useCreateBonusOptionMutation,
  useUpdateBonusOptionMutation,
  useGetBonusOptionQuery,
  useDeleteBonusOptionMutation,
} = processSelectionsApiSlice;