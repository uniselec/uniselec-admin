import { Alert, Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material"; // Importação necessária
import { useParams } from "react-router-dom";
import { useGetAdminQuery, useUpdateAdminMutation } from "./adminSlice";
import { Admin } from "../../types/Admin";
import { AdminForm } from "./components/AdminForm";
import useTranslate from "../polyglot/useTranslate";

export const AdminEdit = () => {
  const id = useParams().id as string;
  const { data: admin, isFetching } = useGetAdminQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);
  const [updateAdmin, status] = useUpdateAdminMutation();

  const [adminState, setAdminState] = useState<Admin>({} as Admin);

  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await updateAdmin(adminState);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAdminState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setAdminState((prevState) => ({ ...prevState, role: e.target.value }));
  };

  // Novo handle para mudar invoice_type
  const handleInvoiceTypeChange = (_: any, newValue: string | null) => {
    setAdminState((prevState) => ({
      ...prevState,
      invoice_type: newValue || "email", // Define um valor padrão
    }));
  };

  useEffect(() => {
    if (admin) {
      setAdminState({
        id: admin.data.id || "",
        name: admin.data.name || "",
        email: admin.data.email || "",
      });
    }
  }, [admin]);





  const addImageUrlLogoBw = (url: string) => {
    setAdminState((prevState) => ({ ...prevState, logo_bw: [{ url, title: "" }] }));
  };



  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Administrador atualizado com sucesso!", { variant: "success" });
      setIsdisabled(false);
    }
    if (status.error) {
      enqueueSnackbar("Erro ao tentar atualizar administrador!", { variant: "error" });
    }
  }, [enqueueSnackbar, status.error, status.isSuccess]);
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
            <Typography variant="h4">Editar Administrador</Typography>
          </Box>
        </Box>
        <AdminForm
          isLoading={status.isLoading}
          admin={adminState}
          isdisabled={isFetching || isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
