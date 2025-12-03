import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../shared/layouts/MainLayout';
import { orderRoutes } from '../pages/orders/config/routes';
import { Login } from '../pages/auth/Login';
import { AuthGuard } from '../shared/components/AuthGuard';
import { TableDemo } from '../pages/demo/TableDemo';

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
      <AuthGuard isPrivate={false}>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'orders',
        children: orderRoutes,
      },
      {
        path: 'orders',
        element: <div>Orders Page</div>,
      },
      {
        path: 'demo-table',
        element: <TableDemo />,
      },
    ],
  },
]);
