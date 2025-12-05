import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// --------------------------------------------

type DateInputProps = {
  required?: boolean;
  label?: string;
  name: string;
  value: string;
  error: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function DateInput({
  required,
  name,
  label,
  value,
  error,
  handleInputChange,
}: DateInputProps) {
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
      <DatePicker
        value={value ? dayjs(value) : null}
        format="DD/MM/YYYY"
        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
        onChange={(date: any) => {
          handleInputChange({
            target: {
              type: 'date',
              name,
              value: date ? dayjs(date).endOf('day').toISOString() : '',
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }}
      />
      {!!error && (
        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
