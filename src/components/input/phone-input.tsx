import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

// --------------------------------------------

type PhoneInputProps = {
  required?: boolean;
  value: string;
  error: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const formatPhoneNumber = (phone: string) =>
  phone.startsWith('+84') ? phone.slice(3) : phone.startsWith('0') ? phone.slice(1) : phone;

const unformatPhoneNumber = (phone: string) =>
  phone === '' ? phone : phone.startsWith('+84') ? phone : `+84${phone}`;

export function PhoneInput({ required, value, error, handleInputChange }: PhoneInputProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>
        Điện thoại
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <TextField
        fullWidth
        type="number"
        name="phone"
        value={formatPhoneNumber(value)}
        error={!!error}
        helperText={error}
        onChange={(e) => {
          handleInputChange({
            target: {
              type: 'number',
              name: 'phone',
              value: unformatPhoneNumber(e.target.value),
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
        sx={{ mb: 0 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            startAdornment: <InputAdornment position="start">+84</InputAdornment>,
          },
        }}
      />
    </Box>
  );
}
