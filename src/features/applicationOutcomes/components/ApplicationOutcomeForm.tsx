import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ApplicationOutcome } from "../../../types/ApplicationOutcome";
import useTranslate from '../../polyglot/useTranslate';
import { ApplicationCard } from "../../applications/components/ApplicationCard";
import { EnemScoreCard } from "../../enemScores/components/EnemScoreCard";

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
  const translate = useTranslate('status');

  const formatDateToBR = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const getFieldStyle = (fieldKey: "name" | "cpf" | "birthdate"): React.CSSProperties => {
    const inconsistencyMap: Record<typeof fieldKey, string> = {
      name: "Inconsistência no Nome",
      cpf: "Inconsistência no CPF",
      birthdate: "Inconsistência na Data de Nascimento",
    };
    const inconsistencies: string[] = applicationOutcome.reason
      ?.split(";")
      .map((inconsistency) => inconsistency.trim()) ?? [];

    const label: string = inconsistencyMap[fieldKey];
    return inconsistencies.includes(label) ? { color: "red" } : {};
  }

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* Exibição das informações da Application associada */}
          {applicationOutcome.application && (
            <Grid item xs={12}>
              <Typography variant="h6">Informações da Inscrição</Typography>
              <ApplicationCard isLoading={false} application={applicationOutcome.application} />
              <hr></hr>
            </Grid>
          )}

          {/* Exibição das informações do EnemScore */}
          {/* {applicationOutcome.application?.enem_score && (
            <Grid item xs={12}>
              <EnemScoreCard enemScore={applicationOutcome.application?.enem_score} isLoading={false} />
            </Grid>
          )} */}

          {/* Exibição das informações do ApplicationOutcome */}
          <Grid item xs={12}>
            <Typography variant="h6">Informações do Inep</Typography>
            <Typography style={ getFieldStyle('name') }>
              Nome: {applicationOutcome.application?.enem_score?.scores?.name}
            </Typography>
            <Typography style={ getFieldStyle('cpf') }>
              CPF: {applicationOutcome.application?.enem_score?.scores?.cpf}
            </Typography>
            <Typography style={ getFieldStyle('birthdate') }>
              Data de Nascimento: {applicationOutcome.application?.enem_score?.scores?.birthdate}
            </Typography>
            <Typography>ID: {applicationOutcome.id}</Typography>
            <Typography>Score Médio: {applicationOutcome.average_score}</Typography>
            <Typography>Score Final: {applicationOutcome.final_score}</Typography>
            <Typography>Ranking: {applicationOutcome.ranking || "N/A"}</Typography>
          </Grid>

          {/* RadioGroup para definir deferido, indeferido ou pendente */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="h6">Status</Typography>
              <RadioGroup
                name="status"
                value={applicationOutcome.status || ""}
                onChange={handleStatusChange}
                row
              >
                <FormControlLabel
                  value="approved"
                  control={<Radio />}
                  label={translate("approved")}
                  disabled={isdisabled}
                />
                <FormControlLabel
                  value="rejected"
                  control={<Radio />}
                  label={translate("rejected")}
                  disabled={isdisabled}
                />
                <FormControlLabel
                  value="pending"
                  control={<Radio />}
                  label={translate("pending")}
                  disabled={isdisabled}
                />
              </RadioGroup>
            </FormControl>
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
              <Button
                variant="contained"
                onClick={() => window.history.back()}
              >
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
