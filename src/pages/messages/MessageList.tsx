import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { Smartphone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../kernel/http/axios-client';
import {
  type OilChangeReminder,
  ReminderStatus,
} from '../../kernel/http/types';

export const MessageList: React.FC = () => {
  const [reminders, setReminders] = useState<OilChangeReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response =
        await httpClient.doGet<OilChangeReminder[]>('/oil-reminders');
      if (response.success && response.data) {
        setReminders(response.data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ReminderStatus) => {
    switch (status) {
      case ReminderStatus.PENDING:
        return 'warning';
      case ReminderStatus.SENT:
        return 'success';
      case ReminderStatus.CANCELLED:
        return 'default';
      case ReminderStatus.FAILED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: ReminderStatus) => {
    switch (status) {
      case ReminderStatus.PENDING:
        return 'Pendente';
      case ReminderStatus.SENT:
        return 'Enviado';
      case ReminderStatus.CANCELLED:
        return 'Cancelado';
      case ReminderStatus.FAILED:
        return 'Falhou';
      default:
        return status;
    }
  };

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    let match = cleaned.match(/^(\d{2})(\d{2})(\d{1})(\d{4})(\d{4})$/);
    if (match) {
      return `+${match[1]} (${match[2]}) ${match[3]} ${match[4]}-${match[5]}`;
    }
    match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
    if (match) {
      return `+55 (${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Lista de Mensagens
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<Smartphone />} 
          onClick={() => navigate('/whatsapp-config')}
        >
          Configurar WhatsApp
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Agendado Para</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tentativas</TableCell>
              <TableCell>Enviado Em</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reminders.map((reminder) => (
              <TableRow key={reminder.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {reminder.order?.customer?.name || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {reminder.order?.customer?.phone
                      ? formatPhone(reminder.order.customer.phone)
                      : 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>{reminder.order?.vehicle || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(reminder.scheduledFor).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(reminder.status)}
                    color={getStatusColor(reminder.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{reminder.attempts}/3</TableCell>
                <TableCell>
                  {reminder.sentAt
                    ? new Date(reminder.sentAt).toLocaleString()
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
            {reminders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma mensagem encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
