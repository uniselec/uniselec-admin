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
                    <Typography variant="h4">Em desenvolvimento</Typography><br />
                    <Typography variant="h6">Esta funcionalidade está em desenvolvimento.</Typography>
                </Box>
            </Paper>
        </Box>
  )
}

export {CardAdvise};
