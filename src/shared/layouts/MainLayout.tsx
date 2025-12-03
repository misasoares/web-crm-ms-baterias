import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getButtonStyle = (path: string) => ({
    borderBottom: isActive(path) ? '2px solid white' : '2px solid transparent',
    borderRadius: 0,
    opacity: isActive(path) ? 1 : 0.7,
    '&:hover': {
      opacity: 1,
      borderBottom: '2px solid rgba(255, 255, 255, 0.5)',
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
            <Typography variant="h6" component="div">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                CRM App
              </Link>
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={getButtonStyle('/')}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/orders"
              sx={getButtonStyle('/orders')}
            >
              Pedidos
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/customers"
              sx={getButtonStyle('/customers')}
            >
              Clientes
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/messages"
              sx={getButtonStyle('/messages')}
            >
              Lista de mensagens
            </Button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minWidth: 120,
            }}
          >
            <ThemeSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
