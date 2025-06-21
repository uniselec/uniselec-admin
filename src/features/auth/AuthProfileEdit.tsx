import React, { useState } from "react";
import { Box, Button, FormControl, Grid, TextField, Typography, Paper } from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../auth/authSlice";
import { useSnackbar } from "notistack";
import { Admin } from "../../types/Admin";
import { useUpdateProfileMutation } from "../auth/authApiSlice";
import { User } from "../../types/User";

type AdminWithPasswordConf = Partial<Admin> & {
  password?: string;
  password_confirmation?: string;
};

export function AuthProfileEdit() {
  const authUser = useAppSelector(selectAuthUser) as AdminWithPasswordConf;
  const { enqueueSnackbar } = useSnackbar();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  if (!authUser || !authUser.id) {
    return (
      <Box p={2}>
        <Typography variant="h6" color="error">
          You are not authenticated.
        </Typography>
      </Box>
    );
  }

  const [adminState, setAdminState] = useState<AdminWithPasswordConf>({
    ...authUser,
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Usando o prev state para não perder campos obrigatórios
    setAdminState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProfile(adminState).unwrap();
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar("Error updating profile.", { variant: "error" });
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          p={5}
        >
          <Box p={2} mb={1}>
            <Typography component="h1" variant="h5">Perfil do Utilizador</Typography>
          </Box>
        </Box>

        <Box p={3} mb={3}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  {adminState.name}
                  {/* Se quiser deixar editável, descomente a linha abaixo */}
                  {/*
                  <TextField
                    required
                    name="name"
                    label="Nome"
                    value={adminState.name || ""}
                    onChange={handleChange}
                  /> */}
                </FormControl>
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  {adminState.email}
                  {/* Se quiser deixar editável, descomente a linha abaixo */}
                  {/* <TextField
                    required
                    name="email"
                    type="email"
                    label="Email"
                    value={adminState.email || ""}
                    onChange={handleChange}
                  /> */}
                </FormControl>
              </Grid>




              {/* Password */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={adminState.password || ""}
                    onChange={handleChange}
                    placeholder="Leave blank to keep the same password"
                  />
                </FormControl>
              </Grid>

              {/* Password Confirmation */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    value={adminState.password_confirmation || ""}
                    onChange={handleChange}
                    placeholder="Confirm the new password"
                  />
                </FormControl>
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button variant="contained" component="a" href="/profile">
                    Voltar
                  </Button>
                  <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Aguarde..." : "Guardar"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}
