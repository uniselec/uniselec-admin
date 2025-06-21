import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/HourglassTop';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseIcon from '@mui/icons-material/PauseCircle';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserStatusLog } from '../../../types/User';
import useTranslate from '../../polyglot/useTranslate';

type Props = { logs: UserStatusLog[] };

const icon = {
  pending:  <PendingIcon />,
  active:   <CheckIcon />,
  inactive: <PauseIcon />,
  rejected: <CancelIcon />,
} as const;

export const StatusTimeline = ({ logs }: Props) => {
  const tStatus = useTranslate('users.status');

  if (!logs.length) return <Typography variant="body2">Nenhum log.</Typography>;

  return (
    <Timeline position="alternate">
      {logs.map((l, i) => (
        <TimelineItem key={l.id}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align={i % 2 ? 'left' : 'right'}
            variant="body2"
            color="text.secondary"
          >
            {format(new Date(l.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}
          </TimelineOppositeContent>

          <TimelineSeparator>
            {i !== 0 && <TimelineConnector />}
            <TimelineDot
              color={
                l.new_status === 'active'
                  ? 'success'
                  : l.new_status === 'rejected'
                  ? 'error'
                  : l.new_status === 'pending'
                  ? 'warning'
                  : 'grey'
              }
            >
              {icon[l.new_status as keyof typeof icon]}
            </TimelineDot>
            {i !== logs.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent sx={{ py: 2 }}>
            <Typography variant="subtitle2">{tStatus(l.new_status)}</Typography>
            <Typography variant="body2">{l.description}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
