import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { EnemScore } from "../../../types/EnemScore";

type Props = {
  enemScore: EnemScore;
  isLoading?: boolean;
};

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
}

export function EnemScoreCard({ enemScore, isLoading = false }: Props) {
  if (!enemScore || !enemScore.scores) {
    return <Typography variant="h6">Carregando...</Typography>;
  }

  return (
    <Box p={2}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Informações vindas do arquivo do INEP</Typography>
          <Typography>ENEM: {enemScore.enem}</Typography>
          <Typography>Nome: {enemScore.scores.name || 'N/A'}</Typography>
          <Typography>CPF: {enemScore.scores.cpf || 'N/A'}</Typography>
          <Typography>Data de Nascimento: {enemScore.scores.birthdate || 'N/A'}</Typography>
          <Typography>Nota em Ciências da Natureza: {enemScore.scores.science_score || 'N/A'}</Typography>
          <Typography>Nota em Ciências Humanas: {enemScore.scores.humanities_score || 'N/A'}</Typography>
          <Typography>Nota em Linguagens e Códigos: {enemScore.scores.language_score || 'N/A'}</Typography>
          <Typography>Nota em Matemática: {enemScore.scores.math_score || 'N/A'}</Typography>
          <Typography>Nota em Redação: {enemScore.scores.writing_score || 'N/A'}</Typography>
          <Typography>Notas Originais: {enemScore.original_scores || 'N/A'}</Typography>
          <Typography>Criado em: {formatDate(enemScore.created_at)}</Typography>
          <Typography>Atualizado em: {formatDate(enemScore.updated_at)}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
