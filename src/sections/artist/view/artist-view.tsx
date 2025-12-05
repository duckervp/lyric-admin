import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { ArtistRole } from 'src/utils/type';

import { DashboardContent } from 'src/layouts/dashboard';
import { useDeleteArtistMutation, useGetAllArtistsQuery } from 'src/app/api/artist/artistApiSlice';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import Fallback from 'src/components/loading/fallback';
import { useTable } from 'src/components/table/use-table';
import DeleteDialog from 'src/components/popup/delete-dialog';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { TableEmptyRows } from 'src/components/table/table-empty-rows';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

import ArtistFormDialog from '../artist-form-dialog';
// ----------------------------------------------------------------------
export type ArtistProps = {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

export function ArtistView() {
  const table = useTable();

  const [filter, setFilter] = useState({ name: '' });

  const { data: userData, isLoading } = useGetAllArtistsQuery({});

  const [deleteArtist] = useDeleteArtistMutation();

  const [users, setArtists] = useState<ArtistProps[]>([]);

  const [selectedRow, setSelectedRow] = useState<ArtistProps>();

  const [userFormDialogOpen, setArtistFormDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setArtists(userData.data);
    }
  }, [userData]);

  const dataFiltered: ArtistProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName: filter.name,
  });

  const notFound = !dataFiltered.length && !!filter.name;

  const handleEditRow = (row: ArtistProps) => {
    setSelectedRow(row);
    setArtistFormDialogOpen(true);
  };

  const handleDeleteRow = async () => {
    await deleteArtist(selectedRow?.id);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <DashboardContent>
      <ArtistFormDialog
        id={selectedRow?.id}
        removeId={() => setSelectedRow(undefined)}
        open={userFormDialogOpen}
        setOpen={setArtistFormDialogOpen}
      />
      <DeleteDialog
        title="Delete Confirmation"
        open={deleteDialogOpen}
        onPopupClose={() => setDeleteDialogOpen(false)}
        children={
          <Typography variant="body2">
            Are you sure to delete <b>{selectedRow?.name}</b> artist?
          </Typography>
        }
        onDelete={handleDeleteRow}
      />
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">Artists</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage singers and composers
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setArtistFormDialogOpen(true)}
        >
          New artist
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
                  { id: 'role', label: 'Role' },
                  { id: 'bio', label: 'Bio' },
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
                      onEditRow={() => handleEditRow(row)}
                      onDeleteRow={() => {
                        setSelectedRow(row);
                        setDeleteDialogOpen(true);
                      }}
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
                        {
                          field: 'role',
                          render: () => (
                            <Label
                              color={
                                (row.role === ArtistRole.SINGER && 'success') ||
                                (row.role == ArtistRole.COMPOSER && 'info') ||
                                'error'
                              }
                            >
                              {row.role === ArtistRole.SINGER_COMPOSER
                                ? 'Singer & Composer'
                                : row.role}
                            </Label>
                          ),
                        },
                        { field: 'bio' },
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
