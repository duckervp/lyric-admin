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
import { useGetAllSongsQuery, useDeleteSongMutation } from 'src/app/api/song/songApiSlice';

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

import SongFormDialog from '../song-form';
// ----------------------------------------------------------------------
export type SongProps = {
  id: number;
  title: string;
  imageUrl: string;
  artist: string;
  description: string;
  releaseAt: string;
};

export function SongView() {
  const table = useTable();

  const [filter, setFilter] = useState({ name: '' });

  const { data: userData, isLoading } = useGetAllSongsQuery({});

  const [deleteSong] = useDeleteSongMutation();

  const [users, setSongs] = useState<SongProps[]>([]);

  const [selectedRow, setSelectedRow] = useState<SongProps>();

  const [userFormDialogOpen, setSongFormDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setSongs(userData.data);
    }
  }, [userData]);

  const dataFiltered: SongProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName: filter.name,
  });

  const notFound = !dataFiltered.length && !!filter.name;

  const handleEditRow = (row: SongProps) => {
    setSelectedRow(row);
    setSongFormDialogOpen(true);
  };

  const handleDeleteRow = async () => {
    await deleteSong(selectedRow?.id);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <DashboardContent>
      <SongFormDialog
        id={selectedRow?.id}
        removeId={() => setSelectedRow(undefined)}
        open={userFormDialogOpen}
        setOpen={setSongFormDialogOpen}
      />
      <DeleteDialog
        title="Delete Confirmation"
        open={deleteDialogOpen}
        onPopupClose={() => setDeleteDialogOpen(false)}
        children={
          <Typography variant="body2">
            Are you sure to delete <b>{selectedRow?.title}</b> song?
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
          <Typography variant="h4">Songs</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage songs
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setSongFormDialogOpen(true)}
        >
          New song
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
                  { id: 'title', label: 'Title' },
                  { id: 'artist', label: 'Artist' },
                  { id: 'description', label: 'Description' },
                  { id: 'releaseAt', label: 'Release', align: 'right' },
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
                          field: 'title',
                          render: () => (
                            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                              <img
                                src={row.imageUrl || '/assets/images/avatar/avatar-25.webp'}
                                alt={row.title}
                                style={{ width: 40, height: 40, borderRadius: '50%' }}
                              />
                              {row.title}
                            </Box>
                          ),
                        },
                        { field: 'artist' },
                        { field: 'description' },
                        { field: 'releaseAt', align: 'right' },
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
