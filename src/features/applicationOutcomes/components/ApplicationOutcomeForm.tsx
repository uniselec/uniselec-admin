import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ApplicationOutcome } from "../../../types/ApplicationOutcome";

type Props = {
  applicationOutcome: ApplicationOutcome;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ApplicationOutcomeForm({
  applicationOutcome,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  handleStatusChange,
}: Props) {

  const formatDateToBR = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* Exibição das informações da Application associada */}
          {applicationOutcome.application && (
            <Grid item xs={12}>
              <Typography variant="h6">Informações da Inscrição</Typography>
              <Typography>Nome: {applicationOutcome.application.data.name}</Typography>
              <Typography>CPF: {applicationOutcome.application.data.cpf}</Typography>
              <Typography>Email: {applicationOutcome.application.data.email}</Typography>
              <Typography>Curso: {applicationOutcome.application.data.position}</Typography>
              <Typography>Local do Curso: {applicationOutcome.application.data.location_position}</Typography>
              <Typography>Data de Nascimento: {formatDateToBR(applicationOutcome.application.data.birtdate)}</Typography>
            </Grid>
          )}

          {/* Exibição das informações do EnemScore */}
          {applicationOutcome.application?.enem_score && (
            <Grid item xs={12}>
              <Typography variant="h6">Informações do INEP </Typography>

              <Typography>ENEM: {applicationOutcome.application.enem_score.enem}</Typography>
              <Typography>Nome: {applicationOutcome.application.enem_score.scores?.name}</Typography>
              <Typography>Nota Ciências da Natureza: {applicationOutcome.application.enem_score.scores?.science_score}</Typography>
              <Typography>Nota Ciências Humanas: {applicationOutcome.application.enem_score.scores?.humanities_score}</Typography>
              <Typography>Nota Linguagens: {applicationOutcome.application.enem_score.scores?.language_score}</Typography>
              <Typography>Nota Matemática: {applicationOutcome.application.enem_score.scores?.math_score}</Typography>
              <Typography>Nota Redação: {applicationOutcome.application.enem_score.scores?.writing_score}</Typography>
              <Typography>Dado Original: {applicationOutcome.application.enem_score.original_scores}</Typography>
            </Grid>
          )}

          {/* Exibição das informações do ApplicationOutcome */}
          <Grid item xs={12}>
            <Typography variant="h6">Informações do Resultado</Typography>
            <Typography>ID: {applicationOutcome.id}</Typography>
            <Typography>Score Médio: {applicationOutcome.average_score}</Typography>
            <Typography>Score Final: {applicationOutcome.final_score}</Typography>
            <Typography>Ranking: {applicationOutcome.ranking || "N/A"}</Typography>
          </Grid>

          {/* Switch para definir deferido ou indeferido */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={applicationOutcome.status === "approved"}
                  onChange={handleStatusChange}
                  disabled={isdisabled}
                />
              }
              label="Deferido"
            />
          </Grid>

          {/* Campo para Motivo de Indeferimento */}
          {applicationOutcome.status === "rejected" && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  name="reason"
                  label="Motivo de Indeferimento"
                  value={applicationOutcome.reason || ""}
                  disabled={isdisabled}
                  onChange={handleChange}
                  inputProps={{ "data-testid": "reason" }}
                />
              </FormControl>
            </Grid>
          )}

          {/* Botões de ação */}
          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link} to="/application-outcomes">
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isdisabled || isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
