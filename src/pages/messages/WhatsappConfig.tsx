import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Refresh as RefreshIcon,
  Smartphone as SmartphoneIcon,
  Send as SendIcon,
  LinkOff as LinkOffIcon,
} from '@mui/icons-material';
import { httpClient } from '../../kernel/http/axios-client';

interface ConnectionStatus {
  instanceName: string;
  state: 'open' | 'close' | 'connecting' | 'qrcode';
  statusReason?: number;
}

interface QrData {
  instance: string;
  pairingCode: string | null;
  code: string | null;
  base64: string;
  count: number;
}

export const WhatsappConfig: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<QrData | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [loadingDisconnect, setLoadingDisconnect] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await httpClient.doGet<any>('/whatsapp/status');
      
      let data = response;
      if (response && (response as any).success && (response as any).data) {
          data = (response as any).data;
      }

      // Handle nested instance object from Evolution API
      // Response format: { instance: { instanceName: 'crm', state: 'open' } }
      if (data && (data as any).instance) {
        setStatus((data as any).instance);
      } else {
        setStatus(data as any);
      }
    } catch (error) {
      console.error('Failed to fetch status', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async () => {
    setLoadingQr(true);
    try {
      const response = await httpClient.doGet<QrData>('/whatsapp/qr');
      if (response.success && response.data) {
        setQrCodeData(response.data as any);
        setDialogOpen(true);
      } else {
         // Fallback if data is returned directly
         setQrCodeData(response as any);
         setDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch QR code', error);
    } finally {
      setLoadingQr(false);
    }
  };

  const handleDisconnect = async () => {
    setLoadingDisconnect(true);
    try {
      await httpClient.doDelete('/whatsapp/disconnect');
      await fetchStatus();
    } catch (error) {
      console.error('Failed to disconnect', error);
    } finally {
      setLoadingDisconnect(false);
    }
  };

  // Test Message State
  const [testPhone, setTestPhone] = useState('+5551995616436');
  const [testMessage, setTestMessage] = useState('Hello World');
  const [sendingTest, setSendingTest] = useState(false);

  const sendTestMessage = async () => {
    setSendingTest(true);
    try {
      await httpClient.doPost('/whatsapp/send', {
        phone: testPhone,
        text: testMessage // Ensure backend supports 'text' or map it if it expects 'body'
      });
      // success handled by interceptor snackbar usually, or we can add specific alert here
    } catch (error) {
      console.error('Failed to send test message', error);
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getStatusColor = (state?: string) => {
    switch (state) {
      case 'open':
        return 'success';
      case 'connecting':
        return 'warning';
      case 'close':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (state?: string) => {
    if (!state) return 'DESCONHECIDO';
    const map: Record<string, string> = {
      open: 'CONECTADO',
      close: 'DESCONECTADO',
      connecting: 'CONECTANDO',
      qrcode: 'AGUARDANDO QR CODE',
    };
    return map[state] || state.toUpperCase();
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SmartphoneIcon fontSize="large" color="primary" />
              <Typography variant="h5" component="span" fontWeight="bold">
                Configuração do WhatsApp
              </Typography>
            </Box>
          }
          action={
            <Button
              variant="outlined"
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={fetchStatus}
              disabled={loading}
            >
              Atualizar
            </Button>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              bgcolor: 'background.default',
            }}
          >
            <Box>
              <Typography variant="h6">Status da Conexão</Typography>
              <Typography variant="body2" color="text.secondary">
                Verifique se o seu WhatsApp está conectado.
              </Typography>
            </Box>
            <Chip
              label={getStatusLabel(status?.state)}
              color={getStatusColor(status?.state) as any}
              sx={{ fontWeight: 'bold', fontSize: '1rem', px: 2 }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={loadingQr ? <CircularProgress size={20} color="inherit" /> : <QrCodeIcon />}
              onClick={generateQrCode}
              disabled={loadingQr || status?.state === 'open'}
            >
              {loadingQr ? 'Gerando...' : 'Gerar QR Code'}
            </Button>
            
            {status?.state === 'open' && (
              <Button
                variant="contained"
                color="error"
                size="large"
                sx={{ ml: 2 }}
                startIcon={loadingDisconnect ? <CircularProgress size={20} color="inherit" /> : <LinkOffIcon />}
                onClick={handleDisconnect}
                disabled={loadingDisconnect}
              >
                {loadingDisconnect ? 'Desconectando...' : 'Desconectar'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="bold">
              Testar Conexão
            </Typography>
          }
        />
        <CardContent>
           <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Número do Destinatário"
                variant="outlined"
                fullWidth
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+5551999999999"
              />
              <TextField
                label="Mensagem"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  color="success" 
                  endIcon={sendingTest ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  onClick={sendTestMessage}
                  disabled={sendingTest || status?.state !== 'open'}
                >
                  {sendingTest ? 'Enviando...' : 'Enviar Mensagem Teste'}
                </Button>
              </Box>
           </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Escaneie o QR Code</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              gap: 2,
            }}
          >
            {qrCodeData?.base64 ? (
              <img
                src={qrCodeData.base64}
                alt="WhatsApp QR Code"
                style={{
                  width: 256,
                  height: 256,
                  border: '4px solid white',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  borderRadius: 8,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 256,
                  height: 256,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                }}
              >
                <Typography color="text.secondary">QR Code indisponível</Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" align="center">
              Abra o WhatsApp no seu celular, vá em <strong>Aparelhos Conectados</strong> e escaneie o código
              acima.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
