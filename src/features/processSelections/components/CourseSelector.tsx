import React, { useState } from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";
import { CourseCriteriaModal } from "./CourseCriteriaModal";
import { Course, CourseCriteria } from "../../../types/Course";
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { KnowledgeArea } from "../../../types/KnowledgeArea";

type CourseSelectorProps = {
  coursesOptions: Course[];
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  // We'll need the selected admission categories for default vacancy mapping.
  selectedAdmissionCategories: AdmissionCategory[];
  selectedKnowledgeAreas: KnowledgeArea[];
};

// type CourseCriteria = {
//   vacanciesMap: { [key: string]: number };
//   minimumScoresMap: { [key: string]: number };
// };

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  coursesOptions,
  selectedCourses,
  setSelectedCourses,
  selectedAdmissionCategories,
  selectedKnowledgeAreas,
}) => {
  const [selectedOption, setSelectedOption] = useState<Course | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [openVacancyModal, setOpenVacancyModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // Filter out options that are already selected.
  const filteredOptions = coursesOptions.filter(
    (option) => !selectedCourses.some((course) => course.id === option.id)
  );

  // When a course is selected, add it with default vacancy and minimum score mappings.
  const handleSelect = (_: any, newValue: Course | null) => {
    if (newValue) {
      const defaultVacancies: { [key: string]: number } = {};
      const defaultMinimumScores: { [key: string]: number } = {};

      selectedAdmissionCategories.forEach((admissionCategory) => {
        defaultVacancies[admissionCategory.name] = 0;
      });

      selectedKnowledgeAreas.forEach((knowledgeArea) => {
        defaultMinimumScores[knowledgeArea.slug] = 0;
      });

      setSelectedCourses([
        ...selectedCourses,
        {
          ...newValue,
          vacanciesByCategory: defaultVacancies,
          minimumScores: defaultMinimumScores,
        },
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

  const handleSaveCourseCriteria = (courseCriteria: CourseCriteria) => {
    if (currentCourse) {
      setSelectedCourses(
        selectedCourses.map((course) =>
          course.id === currentCourse.id ? {
            ...course,
            vacanciesByCategory: courseCriteria.vacanciesMap,
            minimumScores: courseCriteria.minimumScoresMap
          } : course
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
        getOptionLabel={(option) => `${option.name} - ${option.academic_unit.name}`}
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
        <CourseCriteriaModal
          courseName={currentCourse.name}
          admissionCategories={selectedAdmissionCategories}
          knowledgeAreas={selectedKnowledgeAreas}
          currentVacancies={currentCourse.vacanciesByCategory}
          currentMinimumScores={currentCourse.minimumScores}
          onClose={() => setOpenVacancyModal(false)}
          onSave={handleSaveCourseCriteria}
        />
      )}
    </Box>
  );
};
