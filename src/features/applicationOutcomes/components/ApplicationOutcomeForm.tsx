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
import { ApplicationFragment } from "../../../types/Application";

type Props = {
  applicationOutcome: ApplicationOutcome;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSolutionsInconsistencies: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resolvedInconsistencies: ApplicationFragment;
  applicationRequestIsLoading?: boolean,
};

export function ApplicationOutcomeForm({
  applicationOutcome,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  handleStatusChange,
  handleSolutionsInconsistencies,
  resolvedInconsistencies,
  applicationRequestIsLoading = false,
}: Props) {
  const translate = useTranslate('status');

  const formatDateToBR = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const fieldsMap = [
    { key: "name", label: "Nome" },
    { key: "cpf", label: "CPF" },
    { key: "birthdate", label: <>Data de<br />Nascimento</> },
  ] as const;

  const inconsistencyMap = {
    name: "Inconsistência no Nome",
    cpf: "Inconsistência no CPF",
    birthdate: "Inconsistência na Data de Nascimento",
  } as const;

  const getInconsistencies = (): string[] => {
    const inconsistencies =
      applicationOutcome.reason
        ?.split(";")
        .map(inconsistency => inconsistency.trim())
        .filter(Boolean) ?? [];
    return Object.values(inconsistencyMap).filter(inconsistency => inconsistencies.includes(inconsistency));
  };

  const hasInconsistency = (fieldKey: keyof typeof inconsistencyMap): boolean => {
    const inconsistencies = getInconsistencies();
    return inconsistencies.includes(inconsistencyMap[fieldKey]);
  };

  const getFieldStyle = (fieldKey: "name" | "cpf" | "birthdate"): React.CSSProperties => {
    return hasInconsistency(fieldKey) ? { color: "red" } : {};
  };

  const getBoxStyle = (): React.CSSProperties => ({
    border: "1px solid #ccc",
    borderRadius: 1,
    padding: 2,
    marginTop: 2,
    // backgroundColor: "#fafafa",
  });

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
            <Typography variant="h6">Informações do Enem (Inep)</Typography>
            <Box sx={getBoxStyle()}>
              <Typography sx={{ color: !applicationOutcome.application?.name_source && hasInconsistency('name') ? 'red' : 'inherit' }}>
                Nome: {applicationOutcome.application?.enem_score?.scores?.name}
              </Typography>
              <Typography sx={{ color: !applicationOutcome.application?.cpf_source && hasInconsistency('cpf') ? 'red' : 'inherit' }}>
                CPF: {applicationOutcome.application?.enem_score?.scores?.cpf}
              </Typography>
              <Typography sx={{ color: !applicationOutcome.application?.birthdate_source && hasInconsistency('birthdate') ? 'red' : 'inherit' }}>
                Data de Nascimento: {applicationOutcome.application?.enem_score?.scores?.birthdate}
              </Typography>
              <Typography>ID: {applicationOutcome.id}</Typography>
              <Typography>Score Médio: {applicationOutcome.average_score}</Typography>
              <Typography>Score Final: {applicationOutcome.final_score}</Typography>
              <Typography>Ranking: {applicationOutcome.ranking || "N/A"}</Typography>
            </Box>
            <hr></hr>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Definição do Status da Inscrição</Typography>
            
            <Box sx={getBoxStyle()}>

              {getInconsistencies().length > 0 && <Box mb={4}>
                <Typography variant="h6">Resolva as inconsistências indicando a fonte da informação</Typography>

                <Typography sx={{ marginTop: 1 }}>
                  Detectada(s):{" "}
                  {getInconsistencies().map((inconsistency, index) => {
                    const sourceKey = (Object.keys(inconsistencyMap) as Array<keyof typeof inconsistencyMap>)
                      .find(key => inconsistencyMap[key] === inconsistency);
                    const source = sourceKey ? `${sourceKey}_source` as keyof ApplicationFragment : undefined;
                    const shouldStrike = source
                      ? !['', null, undefined].includes(resolvedInconsistencies[source] as any)
                      : false;
                    return (
                      <>
                        <Box
                          key={index}
                          component="span"
                          sx={{
                            textDecoration: shouldStrike ? "line-through" : "none",
                            mx: 0.5,
                          }}
                        >
                          {inconsistency}
                        </Box>
                        <span>{index < getInconsistencies().length - 1 && " | "}</span>
                      </>
                    );
                  })}
                </Typography>

                {fieldsMap.filter(({ key, label }) => hasInconsistency(key)).map(({ key, label }) => (
                  <Box key={key} sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                    <Box mr={2} sx={{ minWidth: 90 }}>
                      <Typography>{label}:</Typography>
                    </Box>
                    <FormControl>
                      <RadioGroup
                        row
                        name={`${key}_source`}
                        onChange={handleSolutionsInconsistencies}
                        value={resolvedInconsistencies[`${key}_source`] || ""}
                      >
                        <FormControlLabel value="enem" control={<Radio />} label="Enem" />
                        <FormControlLabel value="application" control={<Radio />} label="Inscrição" />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
              </Box>}

              <Box>
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
              </Box>

              {applicationOutcome.status === "rejected" && (
                <Box sx={{ marginTop: 4 }}>
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
                </Box>
              )}
              
              <Box display="flex" gap={2} sx={{ marginTop: 4 }}>
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
                  disabled={isdisabled || isLoading || applicationRequestIsLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </Box>
            </Box>

          </Grid>

          {/* RadioGroup para definir deferido, indeferido ou pendente */}
          {/* <Grid item xs={12}>
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
          </Grid> */}

          {/* Campo para Motivo de Indeferimento */}
          {/* {applicationOutcome.status === "rejected" && (
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
          )} */}

          {/* Botões de ação */}
          {/* <Grid item xs={12}>
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
                disabled={isdisabled || isLoading || applicationRequestIsLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </Grid> */}
        </Grid>
      </form>
    </Box>
  );
}
