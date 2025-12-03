import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import MessageIcon from '@mui/icons-material/Message';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const menuCards = [
    {
      title: 'Pedidos',
      description: 'Gerenciar pedidos de clientes',
      icon: <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      path: '/orders',
      color: '#1976d2',
    },
    {
      title: 'Clientes',
      description: 'Gerenciar cadastro de clientes',
      icon: <PeopleIcon sx={{ fontSize: 60, color: 'success.main' }} />,
      path: '/customers',
      color: '#2e7d32',
    },
    {
      title: 'Lista de mensagens',
      description: 'Visualizar lembretes de troca de óleo',
      icon: <MessageIcon sx={{ fontSize: 60, color: 'warning.main' }} />,
      path: '/messages',
      color: '#ed6c02',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
          Bem-vindo ao CRM
        </Typography>

        <Grid container spacing={3}>
          {menuCards.map((card) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.path}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(card.path)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4,
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{card.icon}</Box>
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
