import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { httpClient } from '../../kernel/http/axios-client';

export const TestMessage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    if (!phone) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await httpClient.doPost('/whatsapp/send', { phone });
      setSuccess('Mensagem enviada com sucesso!');
    } catch (err: unknown) {
      console.error(err);
      setError('Falha ao enviar mensagem. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Testar Envio de Mensagem
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Telefone (DDI+DDD+Número)"
            placeholder="5511999999999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={handleTest}
            disabled={loading || !phone}
          >
            {loading ? 'Enviando...' : 'Testar'}
          </Button>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Paper>
    </Box>
  );
};
