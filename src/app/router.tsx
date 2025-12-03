import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../shared/layouts/MainLayout';
import { orderRoutes } from '../pages/orders/config/routes';
import { Login } from '../pages/auth/Login';
import { AuthGuard } from '../shared/components/AuthGuard';
import { TableDemo } from '../pages/demo/TableDemo';
import { CustomerList } from '../pages/customers/list-customer/CustomerList';
import { TestMessage } from '../pages/test-message/TestMessage';
import { Home } from '../pages/home/Home';
import { MessageList } from '../pages/messages/MessageList';

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
        index: true,
        element: <Home />,
      },
      {
        path: 'orders',
        children: orderRoutes,
      },
      {
        path: 'demo-table',
        element: <TableDemo />,
      },
      {
        path: 'customers',
        element: <CustomerList />,
      },
      {
        path: 'messages',
        element: <MessageList />,
      },
      {
        path: 'test-message',
        element: <TestMessage />,
      },
    ],
  },
]);
