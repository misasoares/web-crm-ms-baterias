import type { RouteObject } from 'react-router-dom';
import { OrderList } from '../list-order/OrderList';
import { CreateOrder } from '../create-order/CreateOrder';

export const orderRoutes: RouteObject[] = [
  {
    path: '',
    element: <OrderList />,
  },
  {
    path: 'create',
    element: <CreateOrder />,
  },
];
