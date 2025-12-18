import { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { UserRole } from 'src/utils/type';

import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useDeleteUsersMutation,
} from 'src/app/api/user/userApiSlice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Fallback from 'src/components/loading/fallback';
import { TableView } from 'src/components/table/table-view';

import UserFormDialog from '../user-form-dialog';

// ----------------------------------------------------------------------
export type UserProps = {
  id: number;
  name: string;
  role: string;
  active: string;
  company: string;
  imageUrl: string;
  verified: boolean;
};

export function UserView() {
  const { t } = useTranslation('user', { keyPrefix: 'listView' });

  const { data: userData, isLoading } = useGetAllUsersQuery({});

  const [users, setUsers] = useState<UserProps[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const [deleteUsers] = useDeleteUsersMutation();

  useEffect(() => {
    if (userData) {
      setUsers(userData.data);
    }
  }, [userData]);

  const handleDeleteRow = async (rowId: number) => {
    await deleteUser(rowId);
  };

  const handleDeleteRows = async (rowIds: number[]) => {
    await deleteUsers(rowIds);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <TableView
      title={t('title')}
      // des={t('des')}
      creationBtnText={t('creationBtnText')}
      data={users}
      searchField="name"
      onDeleteRow={handleDeleteRow}
      onBatchDeleteRows={handleDeleteRows}
      headLabel={[
        { id: 'name', label: t('columns.name') },
        { id: 'email', label: t('columns.email') },
        { id: 'role', label: t('columns.role') },
        { id: 'verified', label: t('columns.verified'), align: 'center' },
        { id: 'active', label: t('columns.active') },
        { id: '' },
      ]}
      rowConfigMap={(row: any) => [
        {
          field: 'name',
          render: () => (
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <img
                src={row.imageUrl || '/assets/images/avatar/avatar-25.webp'}
                alt={row.name}
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
              {row.name}
            </Box>
          ),
        },
        { field: 'email' },
        {
          field: 'role',
          render: () => (
            <Label color={(row.role === UserRole.USER && 'info') || 'secondary'}>{row.role}</Label>
          ),
        },
        {
          field: 'verified',
          align: 'center',
          render: () =>
            row.verified ? (
              <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
            ) : (
              '-'
            ),
        },
        {
          field: 'active',
          render: () => (
            <Label color={(row.active && 'success') || 'error'}>
              {row.active ? t('status.active') : t('status.inactive')}
            </Label>
          ),
        },
      ]}
      renderDeleteDialogContent={(rowData: any) => (
        <Typography variant="body2">
          <Trans
            i18nKey="listView.deleteDialogContent"
            ns="user"
            values={{ name: rowData?.name }}
            components={{ b: <b /> }}
          />
        </Typography>
      )}
      renderBatchDeleteDialogContent={(selected: number[]) => (
        <Typography variant="body2">
          <Trans
            i18nKey="listView.batchDeleteDialogContent"
            ns="user"
            values={{ selected: selected.length }}
            count={selected.length}
            components={{ b: <b /> }}
          />
        </Typography>
      )}
      renderFormDialog={(
        selectedRowId: number,
        removeId: () => void,
        open: boolean,
        setOpen: (val: boolean) => void
      ) => <UserFormDialog id={selectedRowId} removeId={removeId} open={open} setOpen={setOpen} />}
    />
  );
}
