import { Result, Results, ProcessSelectionParams, ProcessSelection } from "../../types/ProcessSelection";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/process_selections";

function parseQueryParams(params: ProcessSelectionParams) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page.toString());
  if (params.perPage) query.append("per_page", params.perPage.toString());
  if (params.search) query.append("search", params.search);
  return query.toString();
}

function getProcessSelections({ page = 1, perPage = 100, search = "" }) {
  const params = { page, perPage, search };
  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createProcessSelectionMutation(processSelection: ProcessSelection) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateProcessSelectionMutation(processSelection: ProcessSelection) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteProcessSelectionMutation({ id }: { id: string }) {
  return { url: `${endpointUrl}/${id}`, method: "DELETE" };
}

function getProcessSelection({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

function attachCoursesMutation({ processSelectionId, courses }: { processSelectionId: string; courses: any[] }) {
  return {
    url: `/process-selection/${processSelectionId}/courses`,
    method: "POST",
    body: { courses },
  };
}

function removeCourseFromProcessSelectionMutation({ process_selection_id, course_id }: { process_selection_id: string; course_id: string }) {
  return {
    url: `/process-selection/course/remove`,
    method: "DELETE",
    body: { process_selection_id, course_id },
  };
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getProcessSelections: query<Results, ProcessSelectionParams>({
      query: getProcessSelections,
      providesTags: ["ProcessSelections"],
    }),
    getProcessSelection: query<Result, { id: string }>({
      query: getProcessSelection,
      providesTags: ["ProcessSelections"],
    }),
    createProcessSelection: mutation<Result, ProcessSelection>({
      query: createProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
    updateProcessSelection: mutation<Result, ProcessSelection>({
      query: updateProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
    deleteProcessSelection: mutation<void, { id: string }>({
      query: deleteProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
    attachCourses: mutation<any, { processSelectionId: string; courses: any[] }>({
      query: attachCoursesMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
    removeCourseFromProcessSelection: mutation<any, { process_selection_id: string; course_id: string }>({
      query: removeCourseFromProcessSelectionMutation,
      invalidatesTags: ["ProcessSelections"],
    }),
  }),
});

export const {
  useGetProcessSelectionsQuery,
  useCreateProcessSelectionMutation,
  useUpdateProcessSelectionMutation,
  useGetProcessSelectionQuery,
  useDeleteProcessSelectionMutation,
  useAttachCoursesMutation,
  useRemoveCourseFromProcessSelectionMutation,
} = processSelectionsApiSlice;
