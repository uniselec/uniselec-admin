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
        {/* Seção para informações do EnemScore */}
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

        {/* Seção para informações da Application associada */}
        {enemScore.application && enemScore.application.data && (
          <Grid item xs={12}>
            <Typography variant="h6">Inscrição do Candidato</Typography>
            <Typography>ID da Inscrição: {enemScore.application.id || 'N/A'}</Typography>
            <Typography>Nome: {enemScore.application.data.name || 'N/A'}</Typography>
            <Typography>Email: {enemScore.application.data.email || 'N/A'}</Typography>
            <Typography>CPF: {enemScore.application.data.cpf || 'N/A'}</Typography>
            <Typography>Data de Nascimento: {enemScore.application.data.birtdate || 'N/A'}</Typography>
            <Typography>Sexo: {enemScore.application.data.sex || 'N/A'}</Typography>
            <Typography>Telefone: {enemScore.application.data.phone1 || 'N/A'}</Typography>
            <Typography>Endereço: {enemScore.application.data.address || 'N/A'}</Typography>
            <Typography>Cidade: {enemScore.application.data.city || 'N/A'}</Typography>
            <Typography>Estado: {enemScore.application.data.uf || 'N/A'}</Typography>
            <Typography>Curso: {enemScore.application.data.position || 'N/A'}</Typography>
            <Typography>Local do Curso: {enemScore.application.data.location_position || 'N/A'}</Typography>
            <Typography>Edital: {enemScore.application.data.edital || 'N/A'}</Typography>
            <Typography>Modalidade de Vaga: {enemScore.application.data.vaga?.join(', ') || 'N/A'}</Typography>
            <Typography>Bônus: {enemScore.application.data.bonus?.join(', ') || 'N/A'}</Typography>
            <Typography>Inscrição Criada em: {formatDate(enemScore.application.created_at)}</Typography>
            <Typography>Inscrição Atualizada em: {formatDate(enemScore.application.updated_at)}</Typography>
          </Grid>
        )}

        {/* Botões */}
        <Grid item xs={12}>
          <Box display="flex" gap={2}>
            <Button variant="contained" component={Link} to="/enem-scores">
              Voltar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
