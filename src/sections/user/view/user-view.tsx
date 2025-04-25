import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { useGetAllUsersQuery } from 'src/app/api/user/userApiSlice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import Fallback from 'src/components/loading/fallback';
import { useTable } from 'src/components/table/use-table';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { TableEmptyRows } from 'src/components/table/table-empty-rows';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import UserFormDialog from '../user-form-dialog';

// ----------------------------------------------------------------------
export type UserProps = {
  id: number;
  name: string;
  role: string;
  active: string;
  company: string;
  imageUrl: string;
  isVerified: boolean;
};

export function UserView() {
  const table = useTable();

  const [filter, setFilter] = useState({ name: '' });

  const { data: userData, isLoading } = useGetAllUsersQuery({});

  const [users, setUsers] = useState<UserProps[]>([]);

  const [userId, setUserId] = useState<number | undefined>();

  const [userFormDialogOpen, setUserFormDialogOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setUsers(userData.data);
    }
  }, [userData]);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName: filter.name,
  });

  const notFound = !dataFiltered.length && !!filter.name;

  const handleEditRow = (id: number) => {
    console.log('edit', id);
    setUserId(id);
    setUserFormDialogOpen(true);
  };

  const handleDeleteRow = (id: number) => {
    console.log('delete', id);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <DashboardContent>
      <UserFormDialog
        id={userId}
        removeId={() => setUserId(undefined)}
        open={userFormDialogOpen}
        setOpen={setUserFormDialogOpen}
      />
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setUserFormDialogOpen(true)}
        >
          New user
        </Button>
      </Box>

      <Card>
        <CustomTableToolbar
          numSelected={table.selected.length}
          filterName={filter.name}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilter({ ...filter, name: event.target.value });
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((user: any) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'role', label: 'Role' },
                  { id: 'isVerified', label: 'Verified', align: 'center' },
                  { id: 'active', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CustomTableRow
                      key={row.id}
                      row={row}
                      onEditRow={handleEditRow}
                      onDeleteRow={handleDeleteRow}
                      selected={table.selected.includes(row.id.toString())}
                      onSelectRow={() => table.onSelectRow(row.id.toString())}
                      config={[
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
                        { field: 'role' },
                        {
                          field: 'isVerified',
                          align: 'center',
                          render: () =>
                            row.isVerified ? (
                              <Iconify
                                width={22}
                                icon="solar:check-circle-bold"
                                sx={{ color: 'success.main' }}
                              />
                            ) : (
                              '-'
                            ),
                        },
                        {
                          field: 'active',
                          render: () => (
                            <Label color={(row.active && 'success') || 'error'}>
                              {row.active ? 'active' : 'inactive'}
                            </Label>
                          ),
                        },
                      ]}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filter.name} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
