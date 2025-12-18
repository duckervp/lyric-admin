import type { SwitchProps } from '@mui/material/Switch';

import Box from '@mui/material/Box';
import { styled } from '@mui/material';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

type SwitchInputProps = {
  label?: string;
  name: string;
  required?: boolean;
  value: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
};

export function SwitchInput({ label, name, required, value, handleInputChange }: SwitchInputProps) {
  return (
    <Box
      sx={{ width: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      {label && (
        <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}
      <IOSSwitch
        name={name}
        slotProps={{ input: { 'aria-label': `${name} switch` } }}
        checked={value}
        onChange={handleInputChange}
      />
    </Box>
  );
}
