import type { Form } from 'src/hooks/use-debounce-form';
import type { Artist, SongArtist } from 'src/utils/type';

import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ImageIcon from '@mui/icons-material/Image';
import CardContent from '@mui/material/CardContent';

import useDebounceForm from 'src/hooks/use-debounce-form';

import { handleError } from 'src/utils/notify';
import { generateSlug } from 'src/utils/format-string';

import { useGetAllArtistsQuery } from 'src/app/api/artist/artistApiSlice';
import {
  useGetSongByIdQuery,
  useCreateSongMutation,
  useUpdateSongMutation,
} from 'src/app/api/song/songApiSlice';

// import { MusicNoteIcon } from 'src/components/iconify';
import Fallback from 'src/components/loading/fallback';
import EditDialog from 'src/components/popup/edit-dialog';
import { TextInput } from 'src/components/input/text-input';
import { DateInput } from 'src/components/input/date-input';
import { ArtistSelectInput } from 'src/components/select/artist-select-input';

import SongArtistList from './artist-list';

//-------------------------------------------------------------------------

type SongFormDialogProps = {
  id?: number;
  removeId: () => void;
  open: boolean;
  setOpen: (val: boolean) => void;
};

const form: Form<any> = {
  initialState: {
    title: '',
    artist: '',
    description: '',
    releaseAt: '',
    imageUrl: '',
    lyric: '',
  },
  requiredFields: ['title', 'artist'],
};

const mapPayload = (formData: any) => ({
  title: formData.title || '',
  artist: formData.artist || '',
  description: formData.description || '',
  releaseAt: formData.releaseAt || '',
  imageUrl: formData.imageUrl || '',
  lyric: formData.lyric || '',
});

export default function SongFormDialog({ id, removeId, open, setOpen }: SongFormDialogProps) {
  const { t } = useTranslation('song', { keyPrefix: 'formDialog' });

  const { data, isLoading } = useGetSongByIdQuery(id, { skip: !id });
  const [createSong] = useCreateSongMutation();
  const [updateSong] = useUpdateSongMutation();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [songArtists, setSongArtists] = useState<SongArtist[]>([]);
  const { data: artistData } = useGetAllArtistsQuery({});
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    if (artistData && artistData.data) {
      setArtists(artistData.data);
    }
  }, [artistData]);

  const initialState = useMemo(() => {
    if (id && data?.data) {
      const song = data.data;

      setSongArtists(song.artists);

      setSlug(song.slug);

      return {
        title: song.title || '',
        artist: song.artist || '',
        description: song.description || '',
        releaseAt: song.releaseAt || '',
        imageUrl: song.imageUrl || '',
        lyric: song.lyric || '',
      };
    }
    return form.initialState;
  }, [id, data]);

  const formRequiredFields = useMemo(() => {
    if (id && data?.data) {
      return ['title', 'artist'];
    }
    return form.requiredFields;
  }, [id, data]);

  const { formData, formError, handleInputChange, isValidForm, resetForm } = useDebounceForm({
    initialState,
    requiredFields: formRequiredFields,
  });

  useEffect(() => {
    if (formData.title) {
      setSlug(generateSlug(formData.title));
    }
  }, [formData.title]);

  const handleSave = async () => {
    try {
      const payload = { ...mapPayload(formData), artists: songArtists, slug };
      if (id) {
        await updateSong({ id, payload }).unwrap();
      } else {
        await createSong(payload).unwrap();
      }
      handlePopupClose();
    } catch (error) {
      handleError(error);
    }
  };

  const handlePopupClose = () => {
    setOpen(false);
    removeId();
    resetForm();
    setSongArtists([]);
    setSlug('');
  };

  if (isLoading) {
    return <Fallback />;
  }

  return (
    <EditDialog
      open={open}
      canSave={isValidForm()}
      onSave={handleSave}
      onPopupClose={handlePopupClose}
      title={id ? t('editTitle') : t('newTitle')}
      width="1000px"
    >
      <Grid container spacing={4}>
        {/* Left Column: Metadata */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card elevation={4} sx={{}}>
            <CardContent>
              <Grid container spacing={3.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    required
                    label={t('form.title')}
                    name="title"
                    value={formData.title}
                    error={formError.title}
                    placeholder="e.g. Midnight City"
                    handleInputChange={handleInputChange}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ArtistSelectInput
                    required
                    label={t('form.artist')}
                    name="artist"
                    value={formData.artist}
                    error={formError.artist}
                    options={artists}
                    placeholder="e.g. M83"
                    handleInputChange={handleInputChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <TextInput
                    label={t('form.slug')}
                    name="slug"
                    value={slug}
                    placeholder="midnight-city"
                    handleInputChange={(e) => setSlug(e.target.value)}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <DateInput
                    error={formError.releaseAt}
                    value={formData.releaseAt}
                    name="releaseAt"
                    handleInputChange={handleInputChange}
                    label={t('form.release')}
                    format="YYYY"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextInput
                    label={t('form.description')}
                    name="description"
                    value={formData.description}
                    error={formError.description}
                    handleInputChange={handleInputChange}
                    multiline={6}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Visuals & Lyrics */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card elevation={4} sx={{}}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('form.coverArtwork')}
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  width: '100%',
                  aspectRatio: '1/1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderStyle: 'dashed',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
                component="label"
              >
                {id && formData.imageUrl ? (
                  <Box
                    component="img"
                    // src={previewImage}
                    alt="Cover Preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <Box>
                      <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('form.uploadTip')}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                      {t('form.recommend')}: 1080x1080
                    </Typography>
                  </>
                )}
                <input type="file" hidden accept="image/*" onChange={() => 1} />
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card elevation={4} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Box>
                <SongArtistList
                  artists={artists}
                  songArtists={songArtists}
                  onChange={setSongArtists}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card elevation={4} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {t('form.lyric')}
              </Typography>
              <TextInput
                required
                name="lyric"
                value={formData.lyric}
                error={formError.lyric}
                placeholder="Verse 1..."
                handleInputChange={handleInputChange}
                multiline={10}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </EditDialog>
  );
}
