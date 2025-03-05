import { Result, Results, CourseParams, Course } from "../../types/Course";
import { apiSlice } from "../api/apiSlice";

const endpointUrl = "/courses";

function parseQueryParams(params: CourseParams) {
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

function getCourses({ page = 1, perPage = 10, search = "" }) {
  const params = { page, perPage, search };

  return `${endpointUrl}?${parseQueryParams(params)}`;
}

function createCourseMutation(processSelection: Course) {
  return { url: endpointUrl, method: "POST", body: processSelection };
}

function updateCourseMutation(processSelection: Course) {
  return {
    url: `${endpointUrl}/${processSelection.id}`,
    method: "PUT",
    body: processSelection,
  };
}

function deleteCourseMutation({ id }: { id: string }) {
  return {
    url: `${endpointUrl}/${id}`,
    method: "DELETE",
  };
}


function getCourse({ id }: { id: string }) {
  return `${endpointUrl}/${id}`;
}

export const processSelectionsApiSlice = apiSlice.injectEndpoints({
  endpoints: ({ query, mutation }) => ({
    getCourses: query<Results, CourseParams>({
      query: getCourses,
      providesTags: ["Courses"],
    }),
    getCourse: query<Result, { id: string }>({
      query: getCourse,
      providesTags: ["Courses"],
    }),
    createCourse: mutation<Result, Course>({
      query: createCourseMutation,
      invalidatesTags: ["Courses"],
    }),
    updateCourse: mutation<Result, Course>({
      query: updateCourseMutation,
      invalidatesTags: ["Courses"],
    }),
    deleteCourse: mutation<void, { id: string }>({
      query: deleteCourseMutation,
      invalidatesTags: ["Courses"],
    }),
  }),
});



export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useGetCourseQuery,
  useDeleteCourseMutation,
} = processSelectionsApiSlice;