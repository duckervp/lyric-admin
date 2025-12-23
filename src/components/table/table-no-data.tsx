import type { TableRowProps } from '@mui/material/TableRow';

import { Trans, useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type TableNoDataProps = TableRowProps & {
  searchQuery: string;
};

export function TableNoData({ searchQuery, ...other }: TableNoDataProps) {
  const { t } = useTranslation('common', { keyPrefix: 'table.noData' });
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={7}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('notFoundTitle')}
          </Typography>

          <Typography variant="body2">
            <Trans
              i18nKey="table.noData.notFoundMessage"
              ns="common"
              values={{ searchQuery }}
              components={{ strong: <strong />, br: <br /> }}
            />
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}
