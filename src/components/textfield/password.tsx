import { useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from '../iconify';
//----------------------------------------------------------------
type PasswordProps = {
  sx?: any;
  upperLabel?: boolean;
  name: string;
  label: string;
  formData: any;
  formError: any;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
};

export default function Password({
  sx,
  name,
  label,
  formData,
  formError,
  upperLabel,
  onChange,
  onEnter,
}: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const passwordTextField = (
    <TextField
      fullWidth
      name={name}
      label={!upperLabel ? label : undefined}
      value={formData[name]}
      error={!!formError[name]}
      helperText={formError[name]}
      onChange={onChange}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && onEnter) {
          onEnter();
        }
      }}
      type={showPassword ? 'text' : 'password'}
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
      sx={{ ...sx }}
    />
  );

  if (upperLabel) {
    return (
      <Box>
        <Typography variant="subtitle2">
          <span style={{ color: 'red' }}>*</span> {label}
        </Typography>
        {passwordTextField}
      </Box>
    );
  }

  return passwordTextField;
}
