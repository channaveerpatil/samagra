import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import useI18n from '@/hooks/useI18n';
import { LANGUAGE_LOCALES } from '@/lib/i18n/languages';
import type { Customer } from '../types';
import CustomerStatusChip from './CustomerStatusChip';
import CustomerEmptyState from './CustomerEmptyState';
import CustomerRowActionsMenu from './CustomerRowActionsMenu';

export interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  hasSearchTerm: boolean;
  onAddCustomer: () => void;
  canAddCustomer: boolean;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const SKELETON_ROW_COUNT = 5;

function formatCreatedDate(isoDate: string, locale: string): string {
  return new Date(isoDate).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function CustomerTableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <>
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columnCount }).map((_column, columnIndex) => (
            <TableCell key={columnIndex}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default function CustomerTable({
  customers,
  isLoading,
  hasSearchTerm,
  onAddCustomer,
  canAddCustomer,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const { t, language } = useI18n();
  const showEmptyState = !isLoading && customers.length === 0;

  const columns = [
    t('customers.table.name'),
    t('customers.table.email'),
    t('customers.table.company'),
    t('customers.table.status'),
    t('customers.table.created'),
    t('customers.table.actions'),
  ];

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table
        sx={{
          '& .MuiTableCell-root': {
            borderColor: 'divider',
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            {columns.map((column) => (
              <TableCell key={column} sx={{ fontWeight: 700, color: 'text.primary' }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? <CustomerTableSkeleton columnCount={columns.length} /> : null}
          {!isLoading &&
            customers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {customer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {customer.email}
                  </Typography>
                </TableCell>
                <TableCell>{customer.company}</TableCell>
                <TableCell>
                  <CustomerStatusChip status={customer.status} />
                </TableCell>
                <TableCell>
                  {formatCreatedDate(customer.createdAt, LANGUAGE_LOCALES[language])}
                </TableCell>
                <TableCell align="center">
                  <CustomerRowActionsMenu
                    customer={customer}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {showEmptyState ? (
        <CustomerEmptyState
          hasSearchTerm={hasSearchTerm}
          onAddCustomer={onAddCustomer}
          canAddCustomer={canAddCustomer}
        />
      ) : null}
    </TableContainer>
  );
}
