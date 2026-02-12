import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert,
    Paper,
    CircularProgress,
    Checkbox,
    FormGroup,
    FormControlLabel,
} from "@mui/material";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
    useGetApplicationOutcomesQuery,
    useNotifyApplicationStatusMutation
} from "../applicationOutcomes/applicationOutcomeSlice";
import { ApplicationOutcome } from "../../types/ApplicationOutcome";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useTranslate from "../polyglot/useTranslate";
import { useGetProcessSelectionQuery } from "./processSelectionSlice";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


interface ProcessedApplicationOutcome extends ApplicationOutcome {
    displayStatus: string;
    displayReason: string;
}

const toUpperCase = (text: string): string => text.toUpperCase();

const DeferidosIndeferidosList = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [snack, setSnack] = React.useState<{
        open: boolean;
        severity: "success" | "error";
        msg: string;
    }>({ open: false, severity: "success", msg: "" });

    const [selectedStatusesForNotification, setSelectedStatusesForNotification] = useState<string[]>([]);

    const { id: processSelectionId } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    if (!processSelectionId) {
        return (
            <Typography variant="h6" color="error">
                Selecione um Processo Seletivo
            </Typography>
        );
    }

    const { data: processSelection, isFetching: isFetchingProcess } =
        useGetProcessSelectionQuery({ id: processSelectionId });

    const translate = useTranslate("status");

    const [options] = useState({
        page: 1,
        perPage: 6000,
        search: "",
        filters: { process_selection_id: processSelectionId } as Record<string, string>,
    });

    // 👉 inicializa o filtro a partir da URL (?status=...)
    const [filterStatus, setFilterStatus] = useState<string>(
        () => searchParams.get("status") || "all"
    );

    // 👉 quando o usuário usa o botão Voltar/Avançar do navegador,
    // o searchParams muda e sincronizamos o estado
    useEffect(() => {
        const statusFromUrl = searchParams.get("status") || "all";
        setFilterStatus(statusFromUrl);
    }, [searchParams]);

    const { data: outcomesData, isFetching, error } =
        useGetApplicationOutcomesQuery(options);
    const [notifyApplicationStatus, { isLoading }] =
        useNotifyApplicationStatusMutation();

    if (isFetchingProcess) {
        return <Typography>Loading...</Typography>;
    }

    const maskCPF = (cpf: string): string => {
        const cleanCPF = cpf.replace(/\D/g, "");
        return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "***.$2.$3-**");
    };

    const generatePDF = () => {
        const marginCm = 2;
        const pt = 28.35;
        const topMargin = marginCm * pt;
        const bottomMargin = marginCm * pt;

        const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const now = new Date().toLocaleString("pt-BR");

        doc.setFontSize(10);
        doc.text(
            processSelection?.data?.name ?? "",
            pageWidth / 2,
            topMargin,
            { align: "center" }
        );
        doc.text(
            processSelection?.data?.description ?? "",
            pageWidth / 2,
            topMargin + 20,
            { align: "center" }
        );
        doc.text("Inscrições Deferidas ou Indeferida", pageWidth / 2, topMargin + 40, {
            align: "center",
        });


        const rows = deferidosIndeferidos.map((o) => [
            o.status === "approved"
                ? toUpperCase(o.application?.enem_score?.scores?.name || "")
                : toUpperCase(o.application?.form_data?.name || ""),
            maskCPF(o.application?.form_data?.cpf || ""),
            o.displayStatus,
            o.displayReason,
        ]);

        (doc as any).autoTable({
            head: [["Nome", "CPF", "Situação", "Motivo"]],
            body: rows,
            startY: topMargin + 60,
            margin: {
                top: topMargin,
                left: topMargin,
                right: topMargin,
                bottom: bottomMargin,
            },
            styles: { fontSize: 8, overflow: "linebreak" },
            theme: "grid",
            didDrawPage: () => {
                doc.setFontSize(8);
                doc.text(
                    `Data/hora: ${now}`,
                    topMargin,
                    pageHeight - bottomMargin + 16
                );
                doc.text(
                    `Página ${(doc.internal as any).getNumberOfPages()}`,
                    pageWidth - topMargin,
                    pageHeight - bottomMargin + 16,
                    { align: "right" }
                );
            },
        });

        doc.save("inscricoes_deferidas_indeferidas.pdf");
    };

    if (isFetching) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error fetching applicationOutcomes</Typography>;
    }
    const getSortName = (outcome: ApplicationOutcome): string => {
        const app = outcome.application;
        if (!app) return "";

        if (app.name_source === "enem") {
            return (app.enem_score?.scores?.name || "").toUpperCase();
        }

        return (app.form_data?.name || "").toUpperCase();
    };
    const deferidosIndeferidos: ProcessedApplicationOutcome[] = (outcomesData?.data || [])
        .filter((outcome: ApplicationOutcome) => {
            if (filterStatus === "all") return true;
            if (filterStatus === "without_duplicates")
                return outcome.reason !== "Inscrição duplicada";
            return outcome.status === filterStatus;
        })
        .map((outcome: ApplicationOutcome) => ({
            ...outcome,
            displayStatus: translate(outcome.status),
            displayReason:
                outcome.status === "rejected" || outcome.status === "pending"
                    ? outcome.reason || "-"
                    : "",
        }))
        .sort((a, b) =>
            getSortName(a).localeCompare(getSortName(b), "pt-BR")
        );

    const wrapWithSnack = (promise: Promise<{ message: string }>) => {
        return promise
            .then((response) =>
                setSnack({
                    open: true,
                    severity: "success",
                    msg: response.message || "Notificações enviadas com sucesso!",
                })
            )
            .catch((error) =>
                setSnack({
                    open: true,
                    severity: "error",
                    msg: error?.data?.error || "Erro ao enviar as notificações.",
                })
            );
    };

    const sendNotifications = () => {
        setDialogOpen(false);
        if (processSelectionId) {
            wrapWithSnack(
                notifyApplicationStatus({
                    selectionId: processSelectionId,
                    statuses: selectedStatusesForNotification,
                }).unwrap()
            );
        }
    };

    const handleStatusCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, checked } = event.target;
        setSelectedStatusesForNotification((previousStatuses) =>
            checked
                ? [...previousStatuses, name]
                : previousStatuses.filter((status) => status !== name)
        );
    };

    const totalApproved = deferidosIndeferidos.filter(
        (outcome) => outcome.status === "approved"
    ).length;
    const totalRejected = deferidosIndeferidos.filter(
        (outcome) => outcome.status === "rejected"
    ).length;
    const totalPending = deferidosIndeferidos.filter(
        (outcome) => outcome.status === "pending"
    ).length;
    const total = deferidosIndeferidos.length;

    const getDisplayName = (outcome: ApplicationOutcome): string => {
        if (!outcome?.application) return "";

        const { form_data, enem_score, resolved_inconsistencies } =
            outcome.application;

        if (resolved_inconsistencies?.selected_name) {
            return resolved_inconsistencies.selected_name.toUpperCase();
        }

        if (outcome.status === "approved") {
            return (enem_score?.scores?.name || "").toUpperCase();
        }

        return (form_data?.name || "").toUpperCase();
    };

    const getDisplayCPF = (
        outcome: ApplicationOutcome,
        maskCPFFn: (cpf: string) => string
    ): string => {
        if (!outcome?.application) return "";

        const { form_data, resolved_inconsistencies } = outcome.application;

        if (resolved_inconsistencies?.selected_cpf) {
            return maskCPFFn(resolved_inconsistencies.selected_cpf);
        }

        return maskCPFFn(form_data?.cpf || "");
    };

    const handleFilterStatusChange = (event: any) => {
        const value = event.target.value as string;

        setFilterStatus(value);

        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (value === "all") {
                params.delete("status");
            } else {
                params.set("status", value);
            }
            return params;
        });
    };
    console.log(outcomesData);
    const translateAppealStatus = (status: string) => {
        if (status === 'submitted') return 'Não analisado';
        if (status === 'accepted') return 'Aceito';
        if (status === 'rejected') return 'Rejeitado';
        return "";
    }

    return (
        <Box sx={{ mt: 0, mb: 0 }}>
            <Paper sx={{ p: 3, mb: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md>
                        <Typography variant="h5" gutterBottom>
                            Inscrições Deferidas ou Indeferidas
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} lg={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="status-filter-label">
                                Filtrar Status
                            </InputLabel>
                            <Select
                                labelId="status-filter-label"
                                id="status-filter"
                                value={filterStatus}
                                label="Filtrar Status"
                                onChange={handleFilterStatusChange}
                            >
                                <MenuItem value="all">Todos</MenuItem>
                                <MenuItem value="without_duplicates">
                                    Exceto duplicados
                                </MenuItem>
                                <MenuItem value="approved">Deferidos</MenuItem>
                                <MenuItem value="pending">Pendentes</MenuItem>
                                <MenuItem value="rejected">Indeferidos</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Botões */}
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md="auto"
                        sx={{ display: "flex", gap: 1 }}
                    >
                        <Button variant="contained" onClick={generatePDF}>
                            Gerar PDF
                        </Button>
                        <Button
                            variant="contained"
                            component={Link}
                            to={`/process-selections/details/${processSelectionId}/step/3`}
                        >
                            Voltar
                        </Button>
                        <Button
                            variant="contained"
                            disabled={isLoading || !processSelectionId}
                            onClick={() => setDialogOpen(true)}
                        >
                            {isLoading ? (
                                <CircularProgress size={22} sx={{ mr: 1 }} />
                            ) : null}
                            Notificar situação das inscrições
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="primary">
                                Total Deferidos
                            </Typography>
                            <Typography variant="h4">
                                {totalApproved}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="error">
                                Total Indeferidos
                            </Typography>
                            <Typography variant="h4">
                                {totalRejected}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="warning">
                                Total Pendentes
                            </Typography>
                            <Typography variant="h4">
                                {totalPending}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary">
                                Total Geral
                            </Typography>
                            <Typography variant="h4">{total}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box
                sx={{
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                }}
            >
                <Card>
                    <CardContent>
                        <table
                            id="outcomes-table"
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                marginTop: "20px",
                                color: "black",
                                tableLayout: "fixed",
                                wordWrap: "break-word",
                                fontSize: "12px",
                            }}
                        >
                            <thead>
                                <tr style={{ border: "1px solid black" }}>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Nome</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>CPF</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Situação</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Motivo</th>
                                    <th style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>Recurso</th>
                                </tr>
                            </thead>
                            <tbody>

                                {deferidosIndeferidos?.map((outcome) => (
                                    <tr
                                        key={outcome.id}
                                        style={{
                                            border: "1px solid black",
                                            color: "black",
                                        }}
                                    >
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                color: "black",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            <Link
                                                to={`/application-outcomes/edit/${outcome.id}`}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "blue",
                                                }}
                                            >
                                                {getDisplayName(outcome)}
                                            </Link>
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                color: "black",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {getDisplayCPF(outcome, maskCPF)}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                color: "black",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {translate(outcome?.status)}
                                        </td>
                                        <td
                                            style={{
                                                border: "1px solid black",
                                                padding: "8px",
                                                color: "black",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {outcome.displayReason}
                                        </td>
                                        <td style={{ border: "1px solid black", padding: "8px", color: "black", whiteSpace: "normal" }}>
                                            {outcome.application?.appeal?.status &&                                            
                                                <Link
                                                    to={`/application-outcomes/edit/${outcome.id}?tab=appeal`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        textDecoration: 'none',
                                                        color:
                                                            outcome.application?.appeal?.status === "accepted" ? "green" :
                                                                outcome.application?.appeal?.status === "rejected" ? "red" :
                                                                    outcome.application?.appeal?.status === "submitted" ? "black" :
                                                                        "grey.800",
                                                        fontWeight: 600,
                                                        textTransform: "capitalize"
                                                    }}>
                                                    <>
                                                        {translateAppealStatus(outcome.application?.appeal?.status ?? "")}
                                                        <OpenInNewIcon
                                                            sx={{
                                                                fontSize: 14,
                                                                ml: 0.5,
                                                                verticalAlign: "middle",
                                                            }}
                                                        />
                                                    </>
                                                </Link>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </Box>

            {/* Diálogo de confirmação */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="confirm-dialog-title"
            >
                <DialogTitle id="confirm-dialog-title">
                    Notificar situação da inscrição
                </DialogTitle>
                <DialogContent>
                    <FormGroup row>
                        <FormControlLabel
                            label={translate("approved")}
                            control={
                                <Checkbox
                                    name="approved"
                                    onChange={handleStatusCheckboxChange}
                                    checked={selectedStatusesForNotification.includes(
                                        "approved"
                                    )}
                                />
                            }
                        />
                        <FormControlLabel
                            label={translate("pending")}
                            control={
                                <Checkbox
                                    name="pending"
                                    onChange={handleStatusCheckboxChange}
                                    checked={selectedStatusesForNotification.includes(
                                        "pending"
                                    )}
                                />
                            }
                        />
                        <FormControlLabel
                            label={translate("rejected")}
                            control={
                                <Checkbox
                                    name="rejected"
                                    onChange={handleStatusCheckboxChange}
                                    checked={selectedStatusesForNotification.includes(
                                        "rejected"
                                    )}
                                />
                            }
                        />
                    </FormGroup>
                    <br />
                    <DialogContentText>
                        Selecione ao menos um status para prosseguir.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">
                        Cancelar
                    </Button>
                    <Button
                        onClick={sendNotifications}
                        variant="contained"
                        color="primary"
                        autoFocus
                        disabled={
                            isLoading ||
                            selectedStatusesForNotification.length === 0
                        }
                    >
                        {isLoading ? (
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                        ) : null}
                        Enviar e-mails
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnack((snack) => ({ ...snack, open: false }))
                }
            >
                <Alert
                    onClose={() =>
                        setSnack((snack) => ({ ...snack, open: false }))
                    }
                    severity={snack.severity}
                    sx={{ width: "100%" }}
                >
                    {snack.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export { DeferidosIndeferidosList };
