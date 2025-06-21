import React from 'react';
import { Box, Paper, Typography, Button } from "@mui/material";
import { selectAuthUser } from './authSlice';
import { useAppSelector } from '../../app/hooks';
import { useGetUserQuery } from '../users/userSlice';
import { Link } from 'react-router-dom';
import { User } from '../../types/User';

export const AuthProfile = () => {
    const userAuth = useAppSelector(selectAuthUser) as User;
    const id = userAuth.id || "";
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
                    p={5}
                >
                    <Box p={2} mb={1}>
                        <Typography component="h1" variant="h5">Perfil do Utilizador</Typography>
                    </Box>
                </Box>
                <Box p={3} mb={3}>
                    <Typography variant="h5">Nome: {userAuth?.name}</Typography>
                    <Typography variant="h5">E-mail: {userAuth?.email}</Typography>
                    <Box mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/profile/edit"
                        >
                            Editar Perfil
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};
