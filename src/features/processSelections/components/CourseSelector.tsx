import React, { useState } from "react";
import { Box, TextField, Chip, Autocomplete } from "@mui/material";
import { VacancyModal } from "./VacancyModal";
import { Course } from "../../../types/Course";

type CourseSelectorProps = {
  coursesOptions: Course[];
  selectedCourses: Course[]; // cada item incluirá, por exemplo, { id, name, ..., vacancies }
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
};

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  coursesOptions,
  selectedCourses,
  setSelectedCourses,
}) => {
  const [selectedOption, setSelectedOption] = useState<Course | null>(null);
  const [inputValue, setInputValue] = useState<string>(""); // controla o valor do input
  const [openVacancyModal, setOpenVacancyModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // Filtra as opções, removendo os cursos já selecionados
  const filteredOptions = coursesOptions.filter(
    (option) => !selectedCourses.some((course) => course.id === option.id)
  );

  // Ao selecionar um curso, adiciona-o à lista e limpa o campo de entrada
  const handleSelect = (_: any, newValue: Course | null) => {
    if (newValue) {
      setSelectedCourses([...selectedCourses, { ...newValue, vacancies: 1 }]);
      setSelectedOption(null);
      setInputValue(""); // Limpa o input
    }
  };

  // Remove um curso da lista
  const handleRemove = (courseId: number) => {
    setSelectedCourses(selectedCourses.filter((c) => c.id !== courseId));
  };

  // Abre o modal para alterar vagas
  const handleOpenModal = (course: Course) => {
    setCurrentCourse(course);
    setOpenVacancyModal(true);
  };

  // Salva a nova quantidade de vagas
  const handleSaveVacancies = (vacancies: number) => {
    if (currentCourse) {
      setSelectedCourses(
        selectedCourses.map((course) =>
          course.id === currentCourse.id ? { ...course, vacancies } : course
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
      />

      <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
        {selectedCourses.map((course) => (
          <Chip
            key={course.id}
            label={`${course.name} (Vagas: ${course.vacancies})`}
            onDelete={() => handleRemove(course.id!)}
            onClick={() => handleOpenModal(course)}
          />
        ))}
      </Box>

      {openVacancyModal && currentCourse && (
        <VacancyModal
          courseName={currentCourse.name}
          currentVacancies={currentCourse.vacancies || 1}
          onClose={() => setOpenVacancyModal(false)}
          onSave={handleSaveVacancies}
        />
      )}
    </Box>
  );
};
