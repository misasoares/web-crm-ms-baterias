import { Table, type Column } from '../../shared/components/Table/Table';
import { Chip, IconButton, Avatar } from '@mui/material';
import { Edit, Delete, MoreHoriz } from '@mui/icons-material';

interface UserData {
  id: string;
  number: string;
  user: { name: string; avatar: string; email: string };
  date: string;
  status: 'Done' | 'Pending' | 'Cancelled';
  total: number;
  payment: 'Paid' | 'Unpaid';
}

const mockData: UserData[] = [
  {
    id: '1',
    number: '#654321',
    user: {
      name: 'Freya Nilsen',
      avatar: 'https://i.pravatar.cc/150?u=1',
      email: 'freya@example.com',
    },
    date: '20 Mar 2099',
    status: 'Done',
    total: 19.99,
    payment: 'Paid',
  },
  {
    id: '2',
    number: '#345678',
    user: {
      name: 'Liv Hansen',
      avatar: 'https://i.pravatar.cc/150?u=2',
      email: 'liv@example.com',
    },
    date: '21 Mar 2099',
    status: 'Done',
    total: 30.0,
    payment: 'Unpaid',
  },
  {
    id: '3',
    number: '#901234',
    user: {
      name: 'Ingrid Halvorsen',
      avatar: 'https://i.pravatar.cc/150?u=3',
      email: 'ingrid@example.com',
    },
    date: '17 Mar 2099',
    status: 'Done',
    total: 8.75,
    payment: 'Paid',
  },
  {
    id: '4',
    number: '#789012',
    user: {
      name: 'Kasper Madsen',
      avatar: 'https://i.pravatar.cc/150?u=4',
      email: 'kasper@example.com',
    },
    date: '19 Mar 2099',
    status: 'Done',
    total: 5.0,
    payment: 'Unpaid',
  },
  {
    id: '5',
    number: '#123456',
    user: {
      name: 'Soren Jorge',
      avatar: 'https://i.pravatar.cc/150?u=5',
      email: 'soren@example.com',
    },
    date: '18 Mar 2099',
    status: 'Pending',
    total: 42.5,
    payment: 'Unpaid',
  },
];

export const TableDemo = () => {
  const columns: Column<UserData>[] = [
    {
      header: 'Number',
      accessor: 'number',
      sortable: true,
    },
    {
      header: 'User',
      accessor: 'user',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={row.user.avatar}
            alt={row.user.name}
            sx={{ width: 32, height: 32 }}
          />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {row.user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {row.user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          className={`${
            row.status === 'Done'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          } font-medium border-none`}
        />
      ),
    },
    {
      header: 'Total',
      accessor: 'total',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          ${row.total.toFixed(2)}
        </span>
      ),
      sortable: true,
    },
    {
      header: 'Payment',
      accessor: 'payment',
      render: (row) => (
        <span
          className={
            row.payment === 'Paid'
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          }
        >
          {row.payment}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Table Component Demo
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          A reusable, responsive, and theme-aware table component built with
          Tailwind CSS and MUI.
        </p>
      </div>

      <Table
        title="Latest Orders"
        columns={columns}
        data={mockData}
        onSelect={(rows) => console.log('Selected:', rows)}
        onSort={(key, dir) => console.log('Sort:', key, dir)}
        actions={() => (
          <>
            <IconButton
              size="small"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Edit fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Delete fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <MoreHoriz fontSize="small" />
            </IconButton>
          </>
        )}
      />
    </div>
  );
};
