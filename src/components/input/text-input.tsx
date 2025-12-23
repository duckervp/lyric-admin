import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type TextInputProps = {
  label?: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  error: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: number;
  placeholder?: string;
  disabled?: boolean;
};

export function TextInput({
  label,
  name,
  type,
  required,
  value,
  error,
  handleInputChange,
  multiline,
  placeholder,
  disabled,
}: TextInputProps) {
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
      <TextField
        fullWidth
        name={name}
        type={type || 'text'}
        value={value}
        error={!!error}
        helperText={error}
        onChange={handleInputChange}
        onInput={handleInputChange}
        // onBlur={handleInputChange}
        sx={{ mb: 0 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        placeholder={placeholder}
        multiline={!!multiline}
        minRows={multiline}
        disabled={disabled}
      />
    </Box>
  );
}
