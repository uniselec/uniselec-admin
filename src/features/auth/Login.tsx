import {
    Box,
    Paper,
    Typography,
    Alert
} from "@mui/material";
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Credentials, useLoginMutation } from './authApiSlice';
import { LoginForm } from './components/LoginForm';
import { usePasswordForgotMutation } from "./authApiSlice";
import { Forgot } from "../../types/ResetPassword";
import useTranslate from "../polyglot/useTranslate";
import { useAppSelector } from "../../app/hooks";
import { selectIsAuthenticated } from "./authSlice";

export const Login = () => {
    const [doLogin, statusLogin] = useLoginMutation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [forgotPassword, statusForgotPassword] = usePasswordForgotMutation();
    const translate = useTranslate("auth");
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    const [credentials, setCredentials] = useState<Credentials>({
        email: "",
        password: "",
        device_name: "react_web"
    });

    const [forgotMessage, setForgotMessage] = useState<string | null>(null);

    async function handleSubmitFormForgot(e: React.FormEvent<HTMLFormElement>, forgotData: Forgot) {
        e.preventDefault();
        setForgotMessage(null); // Clear the previous message
        const response = await forgotPassword(forgotData);

        if ('data' in response && response.data) {
            setForgotMessage(translate("Password reset link sent successfully"));
        } else if ('error' in response && response.error) {
            if ('data' in response.error && (response.error as any).data?.message) {
                const message = (response.error as any).data.message.replace(/\.$/, "");
                setForgotMessage(translate(message));
            } else {
                setForgotMessage(translate("An unexpected error occurred. Please try again").replace(/\.$/, ""));
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        const response = await doLogin(credentials);

        if ('data' in response && response.data) {
            enqueueSnackbar(translate("Login successful!").replace(/\.$/, ""), { variant: "success" });
            setIsLoading(false);
            navigate('/');
        } else if ('error' in response && response.error) {
            if ("data" in response.error) {
                const message = (response.error as any).data?.message || "Login failed.";
                enqueueSnackbar(translate(message.replace(/\.$/, "")), { variant: "error" });
            } else {
                enqueueSnackbar(translate("Login failed").replace(/\.$/, ""), { variant: "error" });
            }
            setIsLoading(false);
        }
    }

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Paper>
                {forgotMessage && (
                    <Alert severity={statusForgotPassword.isError ? "error" : "success"} sx={{ mb: 2 }}>
                        {forgotMessage}
                    </Alert>
                )}
                {(isAuthenticated ? (<>Você está autenticado</>) : (
                    <LoginForm
                        credentials={credentials}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        handleSubmitFormForgot={handleSubmitFormForgot}
                    />))}

            </Paper>
        </Box>
    );
};
