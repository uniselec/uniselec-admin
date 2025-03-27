import { Result, Results, AcademicUnitParams, AcademicUnit } from "../../types/AcademicUnit";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/academic_units";

function parseQueryParams(params: AcademicUnitParams) {
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

function getAcademicUnits({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createAcademicUnitMutation(processSelection: AcademicUnit) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateAcademicUnitMutation(processSelection: AcademicUnit) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteAcademicUnitMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getAcademicUnit({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getAcademicUnits: query<Results, AcademicUnitParams>({
      query: getAcademicUnits,
      providesTags: ["AcademicUnits"],
    }),
    getAcademicUnit: query<Result, { id: string }>({
      query: getAcademicUnit,
      providesTags: ["AcademicUnits"],
    }),
    createAcademicUnit: mutation<Result, AcademicUnit>({
      query: createAcademicUnitMutation,
      invalidatesTags: ["AcademicUnits"],
    }),
    updateAcademicUnit: mutation<Result, AcademicUnit>({
      query: updateAcademicUnitMutation,
      invalidatesTags: ["AcademicUnits"],
    }),
    deleteAcademicUnit: mutation<void, { id: string }>({
      query: deleteAcademicUnitMutation,
      invalidatesTags: ["AcademicUnits"],
    }),
  }),
});



export const {
  useGetAcademicUnitsQuery,
  useCreateAcademicUnitMutation,
  useUpdateAcademicUnitMutation,
  useGetAcademicUnitQuery,
  useDeleteAcademicUnitMutation,
} = processSelectionsApiSlice;