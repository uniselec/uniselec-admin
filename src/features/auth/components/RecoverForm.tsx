import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import { FormEvent, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Credentials } from '../authApiSlice';
import { Forgot, ResetPassword } from "../../../types/ResetPassword";

type Props = {
    credentials: Credentials;
    isdisabled?: boolean;
    isLoading?: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmitFormForgot: (e: React.FormEvent<HTMLFormElement>, forgot: Forgot) => void;
};

export const RecoverForm = ({
    credentials,
    isdisabled = false,
    isLoading = false,
    handleSubmit,
    handleChange,
    handleSubmitFormForgot
}: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [errorLogin, setErrorLogin] = useState({ valid: true, text: "" });
    const [errorPassword, setErrorPassowrd] = useState({ valid: true, text: "" });
    const isDarkMode = theme.palette.mode === 'dark';
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [forgotState, setForgotState] = useState({ cpf: "" } as Forgot);
    const handleChangeForgot = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForgotState({ ...forgotState, [name]: value });
    };
    const handleConfirmDialogClose = () => {
        setOpenConfirmDialog(false);
    };


    const handleConfirmSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        setOpenConfirmDialog(false);
        const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as FormEvent<HTMLFormElement>;
        handleSubmitFormForgot(formEvent, forgotState);
    };

    function validateLogin() {
        if (credentials.email.length > 1) {
            setErrorLogin({ valid: true, text: "" });
        } else {
            setErrorLogin({ valid: false, text: "Digite no mínimo 1 caractere" });
        }
    }

    function validatePassword() {
        if (credentials.password.length > 3) {
            setErrorPassowrd({ valid: true, text: "" });
        } else {
            setErrorPassowrd({ valid: false, text: "Digite no mínimo 3 caracteres" });
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 5,
            }}
            p={5}>
            <Box p={2} mb={2}>
                <Typography component="h1" variant="h5">Formulário de Login</Typography>
            </Box>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(event);
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            {errorLogin.valid ? (
                                ""
                            ) : (
                                <Alert severity="error">{errorLogin.text}</Alert>
                            )}
                            <TextField
                                required={true}
                                value={credentials.email}
                                onChange={handleChange}
                                name="email"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={isLoading}
                                error={!errorLogin.valid}
                                onBlur={validateLogin}
                                helperText={errorLogin.text}
                                label="E-mail"
                                variant="outlined"
                                margin="normal"
                                fullWidth
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                required={true}
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={isLoading}
                                error={!errorPassword.valid}
                                onBlur={validatePassword}
                                helperText={errorPassword.text}
                                label="Senha"
                                variant="outlined"
                                margin="normal"
                                type="password"
                                fullWidth
                                autoComplete="off"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" gap={2}>
                            <Button
                                disabled={!(errorPassword.valid && errorLogin.valid && !isLoading)}
                                type="submit"
                                variant="contained"
                            >
                                {isLoading ? "Aguarde..." : "Logar"}
                            </Button>
                            <Button
                                onClick={() => {
                                    setOpenConfirmDialog(true);
                                }}
                                variant="outlined"
                            >
                                {isLoading ? "Aguarde..." : "Esqueci a Senha"}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
            <Dialog
                open={openConfirmDialog}
                onClose={handleConfirmDialogClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Recuperação da Senha</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Digite o Seu CPF para recuperar sua senha:
                    </DialogContentText>
                    <Box mt={2}>
                        <FormControl fullWidth>
                            <TextField
                                required={true}
                                name="cpf"
                                value={forgotState.email || ""}
                                onChange={handleChangeForgot}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={isLoading}
                                // error={!errorPassword.valid}
                                // onBlur={validatePassword}
                                // helperText={errorPassword.text}
                                label="CPF"
                                variant="outlined"
                                margin="normal"
                                type="text"
                                fullWidth
                                autoComplete="off"
                            />
                        </FormControl>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleConfirmDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirmSubmit}
                        color="secondary"
                        autoFocus
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
