import { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDateTime, formatPatterns } from 'src/utils/format-time';

import {
  useGetAllSongsQuery,
  useDeleteSongMutation,
  useDeleteSongsMutation,
} from 'src/app/api/song/songApiSlice';

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
  const { t } = useTranslation('song', { keyPrefix: 'listView' });

  const { data: songData, isLoading } = useGetAllSongsQuery({});

  const [deleteSong] = useDeleteSongMutation();

  const [deleteSongs] = useDeleteSongsMutation();

  const [songs, setSongs] = useState<SongProps[]>([]);

  useEffect(() => {
    if (songData) {
      setSongs(songData.data);
    }
  }, [songData]);

  const handleDeleteRow = async (rowId: number) => {
    await deleteSong(rowId);
  };

  const handleDeleteRows = async (rowIds: number[]) => {
    await deleteSongs(rowIds);
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
      onBatchDeleteRows={handleDeleteRows}
      headLabel={[
        { id: 'title', label: t('columns.title') },
        { id: 'mainArtistName', label: t('columns.artist') },
        { id: 'description', label: t('columns.description') },
        { id: 'releaseAt', label: t('columns.release'), align: 'right' },
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
          <Trans
            i18nKey="listView.deleteDialogContent"
            ns="song"
            values={{ name: rowData?.name }}
            components={{ b: <b /> }}
          />
        </Typography>
      )}
      renderBatchDeleteDialogContent={(selected: number[]) => (
        <Typography variant="body2">
          <Trans
            i18nKey="listView.batchDeleteDialogContent"
            ns="song"
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
      ) => <SongFormDialog id={selectedRowId} removeId={removeId} open={open} setOpen={setOpen} />}
    />
  );
}
