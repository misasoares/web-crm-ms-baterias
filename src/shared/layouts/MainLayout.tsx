import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import { Outlet, Link } from 'react-router-dom';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

export const MainLayout: React.FC = () => {
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
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/orders">
              Pedidos
            </Button>
            <Button color="inherit" component={Link} to="/customers">
              Clientes
            </Button>
            <Button color="inherit" component={Link} to="/messages">
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
