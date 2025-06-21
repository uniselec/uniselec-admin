import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Typography,
  Box
} from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassTop';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseIcon from '@mui/icons-material/PauseCircle';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import useTranslate from '../../polyglot/useTranslate';
import { UserStatusLog } from '../../../types/User';

type Props = { logs: UserStatusLog[] };

const ICONS = {
  pending:  <PendingIcon />,
  active:   <CheckIcon />,
  inactive: <PauseIcon />,
  rejected: <CancelIcon />,
} as const;

const COLORS = {
  pending:  'warning',
  active:   'success',
  inactive: 'default',
  rejected: 'error',
} as const;

export function StatusList({ logs }: Props) {
  const tStatus = useTranslate('users.status');

  if (!logs.length) {
    return <Typography variant="body2">Nenhum log.</Typography>;
  }

  // Garantir ordem cronológica (mais antigo primeiro)
  const sorted = [...logs].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <List>
      {sorted.map((log) => {
        const icon = ICONS[log.new_status as keyof typeof ICONS];
        const color = COLORS[log.new_status as keyof typeof COLORS];
        const timestamp = format(
          new Date(log.created_at),
          'dd/MM/yyyy HH:mm',
          { locale: ptBR }
        );

        return (
          <ListItem key={log.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: `${color}.main` }}>
                {icon}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={tStatus(log.new_status)}
                    size="small"
                    color={color as any}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {timestamp}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mt: 0.5 }}
                >
                  {log.description}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}
