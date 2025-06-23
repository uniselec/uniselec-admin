import { Button, Card, CardContent, Typography } from '@mui/material';




export const EnemScoreImport = () => {


    return (
        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    Importar Notas do ENEM
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                >
                    Submit Import CSV
                </Button>
            </CardContent>
        </Card>
    );
};
