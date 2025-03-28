import React, { useState } from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";
import { CourseVacancyModal } from "./CourseVacancyModal";
import { Course } from "../../../types/Course";

type CourseSelectorProps = {
  coursesOptions: Course[];
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  // We'll need the selected admission categories for default vacancy mapping.
  selectedAdmissionCategories: { id: number; name: string }[];
};

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  coursesOptions,
  selectedCourses,
  setSelectedCourses,
  selectedAdmissionCategories,
}) => {
  const [selectedOption, setSelectedOption] = useState<Course | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [openVacancyModal, setOpenVacancyModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // Filter out options that are already selected.
  const filteredOptions = coursesOptions.filter(
    (option) => !selectedCourses.some((course) => course.id === option.id)
  );

  // When a course is selected, add it with a default vacancy mapping.
  const handleSelect = (_: any, newValue: Course | null) => {
    if (newValue) {
      const defaultVacancies: { [key: string]: number } = {};
      selectedAdmissionCategories.forEach((cat) => {
        defaultVacancies[cat.name] = 1;
      });
      setSelectedCourses([
        ...selectedCourses,
        { ...newValue, vacanciesByCategory: defaultVacancies },
      ]);
      setSelectedOption(null);
      setInputValue("");
    }
  };

  const handleRemove = (courseId: number) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  const handleOpenModal = (course: Course) => {
    setCurrentCourse(course);
    setOpenVacancyModal(true);
  };

  const handleSaveVacancies = (vacanciesMapping: { [key: string]: number }) => {
    if (currentCourse) {
      setSelectedCourses(
        selectedCourses.map((course) =>
          course.id === currentCourse.id ? { ...course, vacanciesByCategory: vacanciesMapping } : course
        )
      );
    }
    setOpenVacancyModal(false);
    setCurrentCourse(null);
  };

  return (
    <Box>
      <Autocomplete
        value={selectedOption}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={handleSelect}
        options={filteredOptions}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} label="Adicionar Curso" variant="outlined" />
        )}
        onBlur={() => setSelectedOption(null)}
      />

      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {selectedCourses.map((course) => (
          <Chip
            key={course.id}
            label={`${course.name} (${course.vacanciesByCategory ? Object.entries(course.vacanciesByCategory)
              .map(([cat, vac]) => `${cat}: ${vac}`)
              .join(", ") : ""})`}
            onDelete={() => handleRemove(course.id!)}
            onClick={() => handleOpenModal(course)}
          />
        ))}
      </Box>

      {openVacancyModal && currentCourse && (
        <CourseVacancyModal
          courseName={currentCourse.name}
          admissionCategories={selectedAdmissionCategories}
          currentVacancies={currentCourse.vacanciesByCategory}
          onClose={() => setOpenVacancyModal(false)}
          onSave={handleSaveVacancies}
        />
      )}
    </Box>
  );
};
