import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ArtistRole } from 'src/utils/type';

import { useGetAllArtistsQuery, useDeleteArtistMutation } from 'src/app/api/artist/artistApiSlice';

import { Label } from 'src/components/label';
import Fallback from 'src/components/loading/fallback';
import { TableView } from 'src/components/table/table-view';

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
  const { t } = useTranslation('artist', { keyPrefix: 'list-view' });

  const { data: artistData, isLoading } = useGetAllArtistsQuery({});

  const [deleteArtist] = useDeleteArtistMutation();

  const [artists, setArtists] = useState<ArtistProps[]>([]);

  useEffect(() => {
    if (artistData) {
      setArtists(artistData.data);
    }
  }, [artistData]);

  const handleDeleteRow = async (rowId: number) => {
    await deleteArtist(rowId);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <TableView
      title={t('title')}
      // des={t('des')}
      creationBtnText={t('creationBtnText')}
      data={artists}
      searchField="name"
      onDeleteRow={handleDeleteRow}
      headLabel={[
        { id: 'name', label: 'Name' },
        { id: 'role', label: 'Role' },
        { id: 'bio', label: 'Bio' },
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
              {row.role === ArtistRole.SINGER_COMPOSER ? 'Singer & Composer' : row.role}
            </Label>
          ),
        },
        { field: 'bio' },
      ]}
      renderDeleteDialogContent={(rowData: any) => (
        <Typography variant="body2">
          Are you sure to delete <b>{rowData?.name}</b> artist?
        </Typography>
      )}
      renderFormDialog={(
        selectedRowId: number,
        removeId: () => void,
        open: boolean,
        setOpen: (val: boolean) => void
      ) => (
        <ArtistFormDialog id={selectedRowId} removeId={removeId} open={open} setOpen={setOpen} />
      )}
    />
  );
}
