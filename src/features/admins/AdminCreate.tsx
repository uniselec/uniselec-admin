import { Box, Paper, Typography, Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material"; // Importação necessária
import { Admin } from "../../types/Admin";
import { useCreateAdminMutation } from "./adminSlice";
import { AdminForm } from "./components/AdminForm";
import useTranslate from "../polyglot/useTranslate";

export const AdminCreate = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [createAdmin, status] = useCreateAdminMutation();
  const [isdisabled, setIsdisabled] = useState(false);

  const [adminState, setAdminState] = useState<Admin>({
    name: "",
    email: "",
  } as Admin);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await createAdmin(adminState);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAdminState({ ...adminState, [name]: value });
  };




  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Administrador criado com sucesso!", { variant: "success" });
      setIsdisabled(true);
    }
    if (status.error) {
      enqueueSnackbar("Erro ao tentar criar administrador", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);




  // Extraindo a mensagem de erro, se houver
  const errorMessage =
    status.error && (status.error as any).data?.message
      ? (status.error as any).data.message
      : null;
  const translate = useTranslate("auth");
  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {translate(errorMessage.replace(/\.$/, ""))}
        </Alert>
      )}
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Novo Administrador</Typography>
          </Box>
        </Box>
        <AdminForm
          isLoading={status.isLoading}
          isdisabled={isdisabled}
          admin={adminState}
          handleSubmit={handleSubmit}
          handleChange={handleChange}

        />
      </Paper>
    </Box>
  );
};
