import { Box, Paper, Typography, Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { ResetPassword } from "../../types/ResetPassword";
import { useResetPasswordMutation } from "./authApiSlice";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const PasswordReset = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [resetPassword, status] = useResetPasswordMutation();
  const navigate = useNavigate();
  const [isdisabled, setIsdisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State para mensagens de alerta
  const token = useParams().token as string;
  const email = useParams().email as string;

  const [resetPasswordState, setResetPasswordState] = useState<ResetPassword>({
    token,
    email,
  } as ResetPassword);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAlertMessage(null); // Limpa mensagens anteriores
    const response = await resetPassword(resetPasswordState);

    if ("data" in response) {
      setAlertMessage("Password reset successfully.");
    } else if ("error" in response) {
      if ("data" in response.error && (response.error as any).data?.message) {
        setAlertMessage((response.error as any).data.message);
      } else {
        setAlertMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setResetPasswordState({ ...resetPasswordState, [name]: value });
  };

  useEffect(() => {
    if (status.isSuccess) {
      enqueueSnackbar("Password reset successfully!", { variant: "success" });
      setIsdisabled(true);
      navigate("/");
    }
    if (status.isError) {
      enqueueSnackbar("Failed to reset password.", { variant: "error" });
    }
  }, [enqueueSnackbar, status.isError, status.isSuccess, navigate]);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          {alertMessage && (
            <Alert severity={status.isError ? "error" : "success"} sx={{ mb: 2 }}>
              {alertMessage}
            </Alert>
          )}

        </Box>
        <ResetPasswordForm
          isLoading={status.isLoading || false}
          isdisabled={isdisabled}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Paper>
    </Box>
  );
};
