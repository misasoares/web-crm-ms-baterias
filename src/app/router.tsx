import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../shared/layouts/MainLayout';
import { orderRoutes } from '../pages/orders/config/routes';
import { Login } from '../pages/auth/Login';
import { AuthGuard } from '../shared/components/AuthGuard';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthGuard isPrivate={false}>
        <Login />
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: (
      <AuthGuard isPrivate={true}>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'orders',
        children: orderRoutes,
      },
      {
        path: '/',
        element: <div>Welcome to CRM App</div>,
      },
    ],
  },
]);
