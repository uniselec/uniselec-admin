import React from 'react';
import { Box, Paper, Typography } from "@mui/material";
import { selectAuthUser } from './authSlice';
import { useAppSelector } from '../../app/hooks';
import { useGetUserQuery } from '../users/userSlice';

export const AuthProfile = () => {

    const userAuth = useAppSelector(selectAuthUser);
    const id = userAuth.id as string;
    const { data: user, isFetching } = useGetUserQuery({ id });

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Paper>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    p={5}>
                    <Box p={2} mb={1}>

                        <Typography component="h1" variant="h5">Informações do Usuário</Typography>
                    </Box>

                </Box>
                <Box p={3} mb={3}>
                    <Typography variant="h5">Nome: {userAuth?.name}</Typography>
                    <Typography variant="h5">E-mail: {userAuth?.email}</Typography>
                </Box>

            </Paper>
        </Box>
    )
}