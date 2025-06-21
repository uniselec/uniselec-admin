import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Button,
  Chip,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDownloadUserDocumentMutation, useGetUserQuery, useUpdateUserMutation } from './userSlice';
import { User } from '../../types/User';
import useTranslate from '../polyglot/useTranslate';




export const UserDetails = () => {
  const tStatus = useTranslate('users.status');
  const { id = '' } = useParams();
  const { data, isFetching } = useGetUserQuery({ id });
  const [updateUser, updStatus] = useUpdateUserMutation();
  const { enqueueSnackbar } = useSnackbar();



  const [downloadDoc, { isLoading: isDownloading }] =
    useDownloadUserDocumentMutation();

  const handleDownload = async (path: string, title: string) => {
    try {
      const blob = await downloadDoc({ userId: String(u.id ?? ''), path }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      enqueueSnackbar('Falha ao baixar o documento.', { variant: 'error' });
    }
  };


  if (isFetching || !data) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  const u: User = data.data;
  const fmt = (d?: string) =>
    d ? format(new Date(d), 'dd/MM/yyyy', { locale: ptBR }) : '-';

  const Card = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  );

  const badge = {
    pending: 'warning',
    active: 'success',
    inactive: 'default',
    rejected: 'error',
  } as const;

  /* ---------------- render ---------------- */
  return (
    <Grid container spacing={2} mt={1}>
      {/* MAIN */}
      <Grid item xs={12} md={9}>
        <Grid container spacing={2}>
          {/* pessoais */}
          <Grid item xs={12} md={6}>
            <Card title="Dados pessoais">
              <Typography>
                <b>Nome:</b> {u.name}
              </Typography>
              <Typography>
                <b>CPF:</b> {u.cpf}
              </Typography>
              {/* <Typography>
                <b>RG:</b> {u.rg} ({u.rg_issuer}/{u.rg_state})
              </Typography>
              <Typography>
                <b>Data emissão RG:</b> {fmt(u.rg_issued_at)}
              </Typography>
              <Typography>
                <b>Nascimento:</b> {fmt(u.birthdate)}
              </Typography> */}
            </Card>
          </Grid>

          {/* contato */}
          <Grid item xs={12} md={6}>
            <Card title="Contato">
              <Typography>
                <b>E-mail:</b> {u.email}
              </Typography>
            </Card>
          </Grid>


        </Grid>
      </Grid>

    </Grid>
  );
};
