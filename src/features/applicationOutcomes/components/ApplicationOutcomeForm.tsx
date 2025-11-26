import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Tab,
  Tabs,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ApplicationOutcome } from "../../../types/ApplicationOutcome";
import useTranslate from '../../polyglot/useTranslate';
import { ApplicationCard } from "../../applications/components/ApplicationCard";
import { EnemScoreCard } from "../../enemScores/components/EnemScoreCard";
import { ApplicationFragment } from "../../../types/Application";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, InputAdornment } from "@mui/material";
import { Appeal } from "../../../types/Appeal";
import { AppealDocument } from "../../../types/AppealDocument";
import { useUpdateAppealMutation, useGetAppealQuery } from '../../appeals/appealsSlice';
import { selectAuthUser } from '../../auth/authSlice';
import { useAppSelector } from '../../../app/hooks';
import { useSnackbar } from "notistack";
import { useGetProcessSelectionQuery } from "../../processSelections/processSelectionSlice";
import { RootState } from "../../../app/store";

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

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
  const userAuth = useAppSelector(selectAuthUser);
  const token = useAppSelector((s: RootState) => s.auth.token);
  const role = useAppSelector((s: RootState) => s.auth?.userDetails?.role);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam === "appeal") {
      setValue(1);
    }
  }, [tabParam]);

  const processSelectionId = applicationOutcome.application?.process_selection_id;

  const { data: processSelection } = useGetProcessSelectionQuery(
    { id: processSelectionId as string },
    { skip: !processSelectionId }
  );

  const isWithinAppealPeriod = () => {

    if (!processSelection) return false;

    const appealStartDate = processSelection?.data?.appeal_start_date;
    const appealEndDate = processSelection?.data?.appeal_end_date;

    if (!appealStartDate || !appealEndDate) return false;

    const start = new Date(appealStartDate);
    const end = new Date(appealEndDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

    const now = new Date();

    return now >= start;
  };

  const isAppealPeriodOver = () => {

    if (!processSelection) return false;

    const appealStartDate = processSelection?.data?.appeal_start_date;
    const appealEndDate = processSelection?.data?.appeal_end_date;

    if (!appealStartDate || !appealEndDate) return false;

    const end = new Date(appealEndDate);
    if (isNaN(end.getTime())) return false;

    const now = new Date();

    return now > end;
  };

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

  const getBoxStyle = (extraStyles: React.CSSProperties = {}): React.CSSProperties => ({
    border: "1px solid #ccc",
    borderRadius: 1,
    padding: 2,
    marginTop: 2,
    // backgroundColor: "#fafafa",
    ...extraStyles,     
  });

  const [value, setValue] = useState(0);

  const tabHandleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const spaces = "\u00A0".repeat(8); // 6 espaços

  const handleDownload = async (appealId: string | number, documentId: string | number) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const baseUrl = role ? `${apiUrl}/api/admin/${role}` : `${apiUrl}/api/admin`;
    const path = `/appeals/${appealId}/appeal_documents/${documentId}/download`;
    const url = baseUrl + path;

    try {

      const response = await axios.get(url, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
          Authorization: `Bearer ${token}`,
        },
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const tempUrl = window.URL.createObjectURL(pdfBlob);
      const tempLink = document.createElement("a");
      tempLink.href = tempUrl;
      tempLink.setAttribute(
        "download",
        appeal.documents?.[0]?.original_name || "recurso.pdf"
      );

      document.body.appendChild(tempLink);
      tempLink.click();

      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(tempUrl);
    } catch (error: any) {
      enqueueSnackbar("Erro ao baixar o arquivo PDF", { variant: "error" });
      console.error("Error downloading PDF:", error);
    }
  };

  const handleAppealDecision = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setAppeal({ ...appeal, [name]: value });
  };

  const handleAppealStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAppeal({ ...appeal, status: value });
  };

  const [updateAppeal, statusAppealUpdateRequest] = useUpdateAppealMutation();
  const [appeal, setAppeal] = useState<Appeal>({
    application_id: "",
    justification: "",
    decision: "",
    status: "",
    documents: []
  });

  useEffect(() => {
    if (applicationOutcome.application?.appeal) {
      setAppeal(applicationOutcome.application?.appeal);
    }
  }, [applicationOutcome]);

  const { enqueueSnackbar } = useSnackbar();

  async function appealHandleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      ...appeal,
      reviewed_by: userAuth?.name,
    };
    try { 
      const response = await updateAppeal(payload).unwrap();
      setAppeal(response.data);
      enqueueSnackbar("Decisão salva com sucesso", { variant: "success" });
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Erro ao salvar a decisão";
      enqueueSnackbar(errorMessage, { variant: "error" });
      console.error("Error saving the decision: ", error);
    }
  }

  return (
    <Box p={2}>
      <Grid container spacing={3}>

        {/* Exibição das informações da Application associada */}
        {applicationOutcome.application && (
          <Grid item xs={12}>
            <Typography variant="h6">Informações da Inscrição</Typography>
            <ApplicationCard isLoading={false} application={applicationOutcome.application} />
            <hr></hr>
          </Grid>
      )}
    </Grid>
    
    <Box sx={{ width: '100%', mt:3}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={tabHandleChange} aria-label="basic tabs example">
          <Tab label="Pendências" {...a11yProps(0)} />
          <Tab label="Recurso" {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <CustomTabPanel value={value} index={0}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
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
          </Grid>
        </form>
      </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {!isWithinAppealPeriod() ? <Typography variant="h6">Fora do período de recursos</Typography>:
            <>         
              {!appeal?.justification ? <Typography variant="h6">Nenhum recurso para análise</Typography> : 
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6">Justificativa do Candidato</Typography>
                    <hr></hr>
                        
                    <Box sx={getBoxStyle({ paddingTop: 0 })}>
                      <Typography sx={{ mt: 2 }}>{ appeal?.justification }</Typography>
                    </Box>
                      
                      { (appeal.documents?.length ?? 0) > 0 &&
                        <Box>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            disabled={true}
                            value={appeal?.documents?.[0]?.original_name ?? ""}
                            InputProps={{
                              readOnly: true,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <InsertDriveFileIcon fontSize="small" />
                                </InputAdornment>
                              )
                            }}
                          />

                          <Button
                            startIcon={<DownloadIcon />}
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              const firstDoc = appeal?.documents?.[0];
                              if (appeal?.id && firstDoc?.id) {
                                handleDownload(appeal.id, firstDoc.id);
                              }
                            }}
                          >
                            Download
                          </Button>
                        </Box>
                      }      

                  </Box>
                      
                  <Typography variant="h6" sx={{ mt: 6 }}>Decisão do Avaliador</Typography>
                  <hr></hr>

                  <Box sx={{ mt: 4}}>
                    <form onSubmit={appealHandleSubmit}>    
                      <Box>
                        <TextField
                          label={`Comentário${spaces}`}
                          name="decision"
                          id="outlined-helperText"
                          variant="outlined"
                          multiline
                          rows="15"
                          fullWidth
                          value={appeal.decision}
                          onChange={handleAppealDecision}
                          disabled={isAppealPeriodOver()}
                          InputLabelProps={{
                            shrink: true,
                            sx: {
                              fontSize: "1.4rem",
                            },
                          }}
                        />

                        <FormControl component="fieldset" sx={{ mt: 2}}>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            onChange={handleAppealStatus}
                            value={appeal.status || ""}
                          >
                              <FormControlLabel
                                value="accepted"
                                control={<Radio />}
                                label="Aceitar"
                                disabled={isAppealPeriodOver()}
                              />
                              <FormControlLabel
                                value="rejected"
                                control={<Radio />}
                                label="Rejeitar"
                                disabled={isAppealPeriodOver()}
                              />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                          
                      <Button
                        sx={{ mt: 2 }}
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="small"
                          disabled={isAppealPeriodOver()}
                      >
                        Salvar
                    </Button>
                  </form>
                  </Box>
                </>
              }
            </>
          }
      </CustomTabPanel>
    </Box>

    </Box>
  );
}
