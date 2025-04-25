import { Link } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

// ------------------------------------------------------------
type PageDisplayProps = {
  totalPages: number;
  page: number;
}

export default function PageDisplay({ totalPages, page }: PageDisplayProps) {
  return (
    <>
      {totalPages > 1 && (
        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap-reverse"
          justifyContent="flex-end"
          sx={{ mt: 3, mb: 2 }}
        >
          <Pagination
            page={page}
            count={totalPages}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}
    </>
  );
}