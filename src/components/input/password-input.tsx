import { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from '../iconify';
//----------------------------------------------------------------
type PasswordInputProps = {
  label?: string;
  name: string;
  required?: boolean;
  value: string;
  error: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
};

export function PasswordInput({
  label,
  name,
  required,
  value,
  error,
  handleInputChange,
  onEnter,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography variant="body2">
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}
      <TextField
        fullWidth
        name={name}
        type={showPassword ? 'text' : 'password'}
        value={value}
        error={!!error}
        helperText={error}
        onChange={handleInputChange}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && onEnter) {
            onEnter();
          }
        }}
        sx={{ mb: 0 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
