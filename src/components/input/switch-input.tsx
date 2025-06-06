import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

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
        <Typography variant="body2">
          {label}
          {required && (
            <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
              *
            </Box>
          )}
        </Typography>
      )}
      <Switch
        name={name}
        slotProps={{ input: { 'aria-label': `${name} switch` } }}
        checked={value}
        onChange={handleInputChange}
      />
    </Box>
  );
}
