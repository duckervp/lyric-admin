import type { ReactNode } from 'react';
import type { RowConfigs } from 'src/components/table/table-row';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/components/table/use-table';
import DeleteDialog from 'src/components/popup/delete-dialog';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { TableEmptyRows } from 'src/components/table/table-empty-rows';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from 'src/components/table/utils';

// ----------------------------------------------------------------------

export type TableViewProps = {
  title: string;
  des?: string;
  creationBtnText: string;
  data: any[];
  searchField: string;
  onDeleteRow: (rowId: number) => Promise<void>;
  onBatchDeleteRows?: (rowIds: number[]) => Promise<void>;
  renderFormDialog: (
    selectedRowId: number,
    removeId: () => void,
    open: boolean,
    setOpen: (val: boolean) => void
  ) => ReactNode;
  renderDeleteDialogContent: (rowData: any) => ReactNode;
  headLabel: Record<string, any>[];
  rowConfigMap: (row: any) => RowConfigs;
};

export function TableView({
  title,
  des,
  creationBtnText,
  data,
  searchField,
  onDeleteRow,
  renderFormDialog,
  renderDeleteDialogContent,
  headLabel,
  rowConfigMap,
  onBatchDeleteRows,
}: TableViewProps) {
  const table = useTable();

  const initFilterState = { [searchField]: '' };

  const [filter, setFilter] = useState(initFilterState);

  const [selectedRow, setSelectedRow] = useState<any>();

  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [batchDeleteDialogOpen, setBatchDeleteDialogOpen] = useState(false);

  const dataFiltered: any[] = applyFilter({
    inputData: data,
    comparator: getComparator(table.order, table.orderBy),
    filter: searchField,
    filterValue: filter[searchField],
  });

  const notFound = !dataFiltered.length && !!filter.name;

  const handleEditRow = (row: any) => {
    setSelectedRow(row);
    setFormDialogOpen(true);
  };

  const handleDeleteRow = async () => {
    await onDeleteRow(selectedRow?.id);
  };

  const handleBatchDelete = async () => {
    if (onBatchDeleteRows) {
      await onBatchDeleteRows(table.selected);
      table.onSelectedRowsDeleted();
    }
  };

  return (
    <DashboardContent>
      {renderFormDialog(
        selectedRow?.id,
        () => setSelectedRow(undefined),
        formDialogOpen,
        setFormDialogOpen
      )}
      <DeleteDialog
        title="Delete Confirmation"
        open={deleteDialogOpen}
        onPopupClose={() => setDeleteDialogOpen(false)}
        children={renderDeleteDialogContent(selectedRow)}
        onDelete={handleDeleteRow}
      />
      <DeleteDialog
        title="Delete Confirmation"
        open={batchDeleteDialogOpen}
        onPopupClose={() => setBatchDeleteDialogOpen(false)}
        children={
          <Typography variant="body2">Are you sure to delete the selected records?</Typography>
        }
        onDelete={handleBatchDelete}
      />
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">{title}</Typography>
          {des && (
            <Typography variant="body2" color="text.secondary">
              {des}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => setFormDialogOpen(true)}
        >
          {creationBtnText}
        </Button>
      </Box>

      <Card>
        <CustomTableToolbar
          numSelected={table.selected.length}
          filterName={filter[searchField]}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilter({ ...filter, [searchField]: event.target.value });
            table.onResetPage();
          }}
          onDelete={() => setBatchDeleteDialogOpen(true)}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={data.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    data.map((item: any) => item.id)
                  )
                }
                headLabel={headLabel}
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
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      config={rowConfigMap(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, data.length)}
                />

                {notFound && <TableNoData searchQuery={filter[searchField]} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={data.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
