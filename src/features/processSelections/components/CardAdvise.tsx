import { Box, Paper, Typography } from '@mui/material';
import React from 'react'

const CardAdvise = () => {
  return (
    <Box>
            <Paper>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                    p={5}>
                    <Typography variant="h1">Em desenvolvimento</Typography>
                    <Typography variant="h2">O Processamento da Seleção está em desenvolvimento</Typography>
                </Box>
            </Paper>
        </Box>
  )
}

export {CardAdvise};
