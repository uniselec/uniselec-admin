import { Box, Button, Grid, Typography, TextField, Avatar } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";

type Props = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isdisabled?: boolean;
  isLoading?: boolean;
};

export const ResetPasswordForm = ({
  handleSubmit,
  handleChange,
  isdisabled = false,
  isLoading = false,
}: Props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState({ valid: true, text: "" });
  const [errorConfirmPassword, setErrorConfirmPassword] = useState({ valid: true, text: "" });

  const validatePassword = () => {
    if (!password || password.length < 8) {
      setErrorPassword({ valid: false, text: "A senha deve ter no mínimo 8 caracteres." });
      return false;
    }
    setErrorPassword({ valid: true, text: "" });

    if (password !== confirmPassword) {
      setErrorConfirmPassword({ valid: false, text: "As senhas não coincidem." });
      return false;
    }
    setErrorConfirmPassword({ valid: true, text: "" });
    return true;
  };

  return (
    <Box
      sx={{
        marginTop: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Redefinição de Senha
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const isPasswordValid = validatePassword();
          if (isPasswordValid) {
            handleSubmit(e);
          }
        }}
      >
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Nova Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={(e) => {
                  handleChange(e);
                  setPassword(e.target.value);
                }}
                onBlur={validatePassword}
                error={!errorPassword.valid}
                helperText={errorPassword.text}
                disabled={isdisabled}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password_confirmation"
                label="Confirmar Senha"
                type="password"
                id="confirmPassword"
                autoComplete="confirm-password"
                onChange={(e) => {
                  handleChange(e);
                  setConfirmPassword(e.target.value);
                }}
                onBlur={validatePassword}
                error={!errorConfirmPassword.valid}
                helperText={errorConfirmPassword.text}
                disabled={isdisabled}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading || isdisabled}
            >
              Redefinir Senha
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};
