import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import PageContainer from '@/components/layout/PageContainer';
import SectionCard from '@/components/common/SectionCard';
import StatCard from '@/components/common/StatCard';
import useCustomers from '@/features/customers/hooks/useCustomers';
import CustomerTable from '@/features/customers/components/CustomerTable';
import CustomerFormDialog from '@/features/customers/components/CustomerFormDialog';
import CustomerDetailsDialog from '@/features/customers/components/CustomerDetailsDialog';
import DeleteCustomerDialog from '@/features/customers/components/DeleteCustomerDialog';
import type { Customer } from '@/features/customers/types';
import { exportCustomersToExcel } from '@/features/customers/utils/exportCustomers';
import useAuth from '@/hooks/useAuth';
import useI18n from '@/hooks/useI18n';
import { PERMISSIONS } from '@/lib/auth/permissions';

export default function CustomersPage() {
  const { can } = useAuth();
  const { t } = useI18n();
  const canCreateCustomer = can(PERMISSIONS.CUSTOMER_CREATE);

  const {
    customers,
    allCustomers,
    isLoading,
    searchTerm,
    setSearchTerm,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [formCustomer, setFormCustomer] = React.useState<Customer | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [viewingCustomer, setViewingCustomer] = React.useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = React.useState<Customer | null>(null);

  const openAddForm = () => {
    setFormCustomer(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (customer: Customer) => {
    setFormCustomer(customer);
    setIsFormOpen(true);
    setViewingCustomer(null);
  };

  const handleFormSubmit = async (input: Parameters<typeof createCustomer>[0]) => {
    if (formCustomer) {
      await updateCustomer(formCustomer.id, input);
    } else {
      await createCustomer(input);
    }
  };

  const handleExport = () => {
    exportCustomersToExcel(customers);
  };

  const kpis = [
    {
      label: t('customers.kpi.total'),
      value: allCustomers.length,
      icon: <GroupsIcon />,
      color: 'primary' as const,
    },
    {
      label: t('customers.kpi.active'),
      value: allCustomers.filter((customer) => customer.status === 'active').length,
      icon: <CheckCircleOutlineIcon />,
      color: 'success' as const,
    },
    {
      label: t('customers.kpi.leads'),
      value: allCustomers.filter((customer) => customer.status === 'lead').length,
      icon: <TrendingUpIcon />,
      color: 'warning' as const,
    },
    {
      label: t('customers.kpi.inactive'),
      value: allCustomers.filter((customer) => customer.status === 'inactive').length,
      icon: <PauseCircleOutlineIcon />,
      color: 'info' as const,
    },
  ];

  return (
    <PageContainer
      title={t('customers.pageTitle')}
      description={t('customers.pageDescription')}
      breadcrumbs={[{ title: t('customers.pageTitle') }]}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2,
          mb: 2,
        }}
      >
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} iconAlign="right" {...kpi} />
        ))}
      </Box>

      <SectionCard title={t('customers.sectionTitle')}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}
          >
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t('customers.searchPlaceholder')}
              size="small"
              sx={{ maxWidth: 360, flex: 1, minWidth: 220 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" startIcon={<FilterListIcon />}>
                {t('customers.filter')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={handleExport}
                disabled={customers.length === 0}
              >
                {t('customers.export')}
              </Button>
              {canCreateCustomer ? (
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAddForm}>
                  {t('customers.addCustomer')}
                </Button>
              ) : null}
            </Stack>
          </Stack>

          <CustomerTable
            customers={customers}
            isLoading={isLoading}
            hasSearchTerm={!!searchTerm.trim()}
            onAddCustomer={openAddForm}
            canAddCustomer={canCreateCustomer}
            onView={setViewingCustomer}
            onEdit={openEditForm}
            onDelete={setDeletingCustomer}
          />
        </Stack>
      </SectionCard>

      <CustomerFormDialog
        open={isFormOpen}
        customer={formCustomer}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <CustomerDetailsDialog
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        onEdit={openEditForm}
      />

      <DeleteCustomerDialog
        customer={deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={deleteCustomer}
      />
    </PageContainer>
  );
}
