import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../shared/layouts/MainLayout';
import { orderRoutes } from '../pages/orders/config/routes';
import { Login } from '../pages/auth/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
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
