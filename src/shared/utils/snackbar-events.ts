import type { AlertColor } from '@mui/material';

export const SNACKBAR_EVENT = 'trigger-snackbar';

export const triggerSnackbar = (
  message: string,
  severity: AlertColor = 'error',
) => {
  const event = new CustomEvent(SNACKBAR_EVENT, {
    detail: { message, severity },
  });
  window.dispatchEvent(event);
};
