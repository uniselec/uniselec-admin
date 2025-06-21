import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
  Typography,
  Autocomplete,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";

import { Link } from "react-router-dom";
import { Admin } from "../../../types/Admin";
import { useAppSelector } from "../../../app/hooks";
import { selectAuthUser } from "../../auth/authSlice";
import { useResendPasswordLinkAdminMutation } from "../adminSlice";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


type Props = {
  admin: Admin;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

};

export function AdminForm({
  admin,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange
}: Props) {
  const userAuth = useAppSelector(selectAuthUser);
  const [resendPasswordLink, { isLoading: isResending }] = useResendPasswordLinkAdminMutation();

  // Opções de faturação
  const invoiceTypeOptions = ["instant", "email"];

  // Traduções para exibição no Autocomplete
  const invoiceTypeLabels: Record<string, string> = {
    instant: "Com Faturação na Hora",
    email: "Por E-mail",
  };



  const handleResendPasswordLink = async () => {
    try {
      await resendPasswordLink({ email: admin.email }).unwrap();
      alert("Link de redefinição de senha enviado com sucesso!");
    } catch {
      alert("Falha ao enviar o link de redefinição de senha.");
    }
  };

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Name"
                value={admin.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "name" }}
              />
            </FormControl>
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="email"
                type="email"
                label="Email"
                value={admin.email || ""}
                disabled={isdisabled}
                onChange={handleChange}
                inputProps={{ "data-testid": "email" }}
              />
            </FormControl>
          </Grid>





          {/* Actions */}
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/admins">
                Voltar
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isdisabled || isLoading}
              >
                {isLoading ? "Loading..." : "Guardar"}
              </Button>

              {/* Resend Password Link */}
              <Button
                variant="outlined"
                color="primary"
                disabled={isResending || !admin.email || isdisabled}
                onClick={handleResendPasswordLink}
              >
                {isResending ? "Enviando..." : "Reenviar Link de Senha"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
