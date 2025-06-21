import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { useResendPasswordLinkMutation } from "../userSlice";

const ResendPasswordLinkButton = ({ email }: { email: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [resendPasswordLink, { isLoading }] = useResendPasswordLinkMutation();

  const handleResendLink = async () => {
    try {
      await resendPasswordLink({ email }).unwrap();
      enqueueSnackbar("Link de redefinição de senha enviado com sucesso.", { variant: "success" });
    } catch {
      enqueueSnackbar("Erro ao enviar link de redefinição de senha.", { variant: "error" });
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleResendLink}
      disabled={isLoading}
    >
      Reenviar Link
    </Button>
  );
};

export default ResendPasswordLinkButton;
