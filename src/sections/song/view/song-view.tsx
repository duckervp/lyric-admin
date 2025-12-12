import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDateTime, formatPatterns } from 'src/utils/format-time';

import { useGetAllSongsQuery, useDeleteSongMutation } from 'src/app/api/song/songApiSlice';

import Fallback from 'src/components/loading/fallback';
import { TableView } from 'src/components/table/table-view';

import SongFormDialog from '../song-form';
// ----------------------------------------------------------------------
export type SongProps = {
  id: number;
  title: string;
  imageUrl: string;
  artist: string;
  description: string;
  releaseAt: string;
  mainArtistName: string;
  mainArtistImageUrl: string;
};

export function SongView() {
  const { t } = useTranslation('song', { keyPrefix: 'list-view' });

  const { data: songData, isLoading } = useGetAllSongsQuery({});

  const [deleteSong] = useDeleteSongMutation();

  const [songs, setSongs] = useState<SongProps[]>([]);

  useEffect(() => {
    if (songData) {
      setSongs(songData.data);
    }
  }, [songData]);

  const handleDeleteRow = async (rowId: number) => {
    await deleteSong(rowId);
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <TableView
      title={t('title')}
      // des={t('des')}
      creationBtnText={t('creationBtnText')}
      data={songs}
      searchField="title"
      onDeleteRow={handleDeleteRow}
      headLabel={[
        { id: 'title', label: 'Title' },
        { id: 'mainArtistName', label: 'Artist' },
        { id: 'description', label: 'Description' },
        { id: 'releaseAt', label: 'Release', align: 'right' },
        { id: '' },
      ]}
      rowConfigMap={(row: any) => [
        {
          field: 'title',
        },
        {
          field: 'mainArtistName',
          render: () => (
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
              <img
                src={row.mainArtistImageUrl || '/assets/images/avatar/avatar-25.webp'}
                alt={row.mainArtistName}
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
              {row.mainArtistName}
            </Box>
          ),
        },
        { field: 'description' },
        {
          field: 'releaseAt',
          align: 'right',
          render: () => fDateTime(row.releaseAt, formatPatterns.year),
        },
      ]}
      renderDeleteDialogContent={(rowData: any) => (
        <Typography variant="body2">
          Are you sure to delete <b>{rowData?.title}</b> song?
        </Typography>
      )}
      renderFormDialog={(
        selectedRowId: number,
        removeId: () => void,
        open: boolean,
        setOpen: (val: boolean) => void
      ) => <SongFormDialog id={selectedRowId} removeId={removeId} open={open} setOpen={setOpen} />}
    />
  );
}
