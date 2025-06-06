import type { RowConfigs } from 'src/components/table/table-row';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { Scrollbar } from 'src/components/scrollbar';
import { useTable } from 'src/components/table/use-table';
import { CustomTableRow } from 'src/components/table/table-row';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';
import { CustomTableToolbar } from 'src/components/table/table-toolbar';

// ----------------------------------------------------------------------

export type Header = {
  id: string;
  label?: string;
  align?: string;
};

export type TableProps = {
  data: { id: number }[];
  totalPages: number;
  headerConfigs: Header[];
  rowConfigs: RowConfigs;
  toolbar?: boolean;
  onEditRow: () => void;
  onDeleteRow: () => void;
};

export function DTable({
  data,
  totalPages,
  headerConfigs,
  rowConfigs,
  toolbar,
  onEditRow,
  onDeleteRow,
}: TableProps) {
  const table = useTable();

  const [filter, setFilter] = useState({ name: '' });

  const notFound = !data?.length;

  return (
    <Card>
      {toolbar && (
        <CustomTableToolbar
          numSelected={table.selected.length}
          filterName={filter.name}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilter({ ...filter, name: event.target.value });
            table.onResetPage();
          }}
        />
      )}

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <CustomTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={data?.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  data?.map((row) => '' + row.id)
                )
              }
              headLabel={headerConfigs}
            />
            <TableBody>
              {data?.map((row) => (
                <CustomTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes('' + row.id)}
                  onSelectRow={() => table.onSelectRow('' + row.id)}
                  config={rowConfigs}
                  onEditRow={onEditRow}
                  onDeleteRow={onDeleteRow}
                />
              ))}

              {/* <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, data?.length)}
              /> */}

              {notFound && <TableNoData searchQuery={filter.name} />}
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
  );
}
