import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useTheme } from '../shared/contexts/ThemeContext';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { router } from './router';

const App: React.FC = () => {
  const { theme: mode } = useTheme();

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
      }),
    [mode],
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </MuiThemeProvider>
  );
};

export default App;
