import type { Artist, SongArtist } from 'src/utils/type';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import DeleteIcon from '@mui/icons-material/Delete';

import { ArtistRole } from 'src/utils/type';

import { ArtistSelectInput } from 'src/components/select/artist-select-input';

interface SongArtistListProps {
  artists: Artist[];
  songArtists: SongArtist[];
  onChange: (songArtists: SongArtist[]) => void;
}

const SongArtistList: React.FC<SongArtistListProps> = ({ artists, songArtists, onChange }) => {
  const { t } = useTranslation('song', { keyPrefix: 'artistList' });

  const addArtist = () => {
    const newArtist: SongArtist = {
      songId: 0,
      artistId: 0,
      role: ArtistRole.SINGER,
    };
    onChange([...songArtists, newArtist]);
  };

  const removeArtist = (index: number) => {
    const newArtists = [...songArtists];
    newArtists.splice(index, 1);
    onChange(newArtists);
  };

  const updateArtist = (index: number, field: keyof SongArtist, value: any) => {
    const newArtists = [...songArtists];
    newArtists[index] = { ...newArtists[index], [field]: value };
    onChange(newArtists);
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          {t('title')}
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addArtist}
          sx={{ textTransform: 'none' }}
        >
          {t('creationBtnText')}
        </Button>
      </Box>

      {songArtists.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'action.hover',
            borderStyle: 'dashed',
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}
        >
          {t('emptyListMessage')}
        </Paper>
      )}

      <Stack spacing={2}>
        {songArtists.map((artist, index) => (
          <Paper
            key={index}
            // variant="outlined"
            sx={{ p: 1, bgcolor: 'background.paper', transition: 'all 0.3s' }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Box sx={{ flex: 1, width: '100%', position: 'relative' }}>
                <ArtistSelectInput
                  required
                  name="artist"
                  value={artist.artistId || ''}
                  //  error={formError.artist}
                  options={artists}
                  placeholder={t('artist')}
                  handleInputChange={(e) =>
                    updateArtist(index, 'artistId', parseInt(e.target.value) || 0)
                  }
                  //  handleInputChange={handleInputChange}
                />
              </Box>

              <Box sx={{ flex: 1, width: '100%' }}>
                <FormControl fullWidth size="small">
                  <Select
                    value={artist.role}
                    onChange={(e) => updateArtist(index, 'role', e.target.value as ArtistRole)}
                    displayEmpty
                  >
                    {Object.values(ArtistRole).map((role) => (
                      <MenuItem key={role} value={role}>
                        {t('artistRole.' + role)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <IconButton
                color="error"
                onClick={() => removeArtist(index)}
                size="small"
                sx={{
                  bgcolor: 'rgba(244, 67, 54, 0.08)',
                  '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.16)' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default SongArtistList;
