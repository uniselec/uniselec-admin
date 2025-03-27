import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAcademicUnitQuery, useUpdateAcademicUnitMutation } from "./academicUnitSlice";
import { AcademicUnit } from "../../types/AcademicUnit";
import { AcademicUnitForm } from "./components/AcademicUnitForm";

export const AcademicUnitEdit = () => {
  const id = useParams().id as string;
  const { data: academicUnitData, isFetching } = useGetAcademicUnitQuery({ id });
  const [isDisabled, setIsDisabled] = useState(false);
  const [updateAcademicUnit, status] = useUpdateAcademicUnitMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [academicUnitState, setAcademicUnitState] = useState<AcademicUnit>({} as AcademicUnit);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updateAcademicUnit(academicUnitState).unwrap();
      enqueueSnackbar("Curso atualizado com sucesso", { variant: "success" });
      setIsDisabled(false);
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao atualizar o curso";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAcademicUnitState({ ...academicUnitState, [name]: value });
  };

  useEffect(() => {
    if (academicUnitData) {
      setAcademicUnitState(academicUnitData.data);
    }
  }, [academicUnitData]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Typography variant="h4">Editar Curso</Typography>
        </Box>
        <AcademicUnitForm
          isLoading={status.isLoading}
          academicUnit={academicUnitState}
          isdisabled={isFetching || isDisabled}
          setAcademicUnit={setAcademicUnitState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
