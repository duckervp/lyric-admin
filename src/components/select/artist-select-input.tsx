import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';

import { Select } from './custom-select';
// ----------------------------------------------------------
type ArtistSelectInputProps = {
  required?: boolean;
  name: string;
  label?: string;
  value: any;
  options?: any[];
  error?: string;
  setError?: (error: string) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function ArtistSelectInput({
  required,
  label,
  value,
  error,
  setError,
  handleInputChange,
  options,
  name,
  placeholder,
}: ArtistSelectInputProps) {
  const [selected, setSelected] = useState<any>(options?.filter((item) => item.id == value).at(0));

  useEffect(() => {
    const option = options?.filter((item) => item.id == value).at(0);
    if (option) {
      setSelected(option);
    }
  }, [value, options]);

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography
          variant="caption"
          sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
        >
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}

      <Autocomplete
        fullWidth
        multiple={false}
        options={options ?? []}
        value={selected}
        getOptionLabel={(option) => option.name ?? ''}
        onChange={(event, newValue) => {
          if (handleInputChange) {
            handleInputChange({
              target: {
                type: 'custom',
                name,
                value: newValue ? newValue.id + '' : '',
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }
          setSelected(newValue);
          if (setError) setError('');
        }}
        slotProps={{
          paper: {
            sx: {
              boxShadow:
                '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 0 0 2px rgba(145, 158, 171, 0.08), 0 8px 16px -4px rgba(145, 158, 171, 0.16)',
              borderRadius: '8px',
              border: '1px solid rgba(145, 158, 171, 0.12)',
            },
          },
        }}
        renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
      />
    </Box>
  );
}
