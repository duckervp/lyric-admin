import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

// --------------------------------------------

type GenderInputProps = {
  required?: boolean;
  name?: string;
  value: string;
  error?: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function GenderInput({ required, name, value, error, handleInputChange }: GenderInputProps) {
  return (
    <Box>
      <Typography variant="caption" sx={{ mr: 2 }}>
        Giới tính
        {required && (
          <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Box>
        )}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
        <FormControlLabel
          label="Nam"
          control={
            <Checkbox
              checked={value === 'MALE'}
              onChange={(e, checked) => {
                handleInputChange({
                  target: {
                    type: 'gender',
                    name: name || 'gender',
                    value: checked ? 'MALE' : '',
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
          }
        />
        <FormControlLabel
          label="Nữ"
          control={
            <Checkbox
              checked={value === 'FEMALE'}
              onChange={(e, checked) => {
                handleInputChange({
                  target: {
                    type: 'gender',
                    name: name || 'gender',
                    value: checked ? 'FEMALE' : '',
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
          }
        />
      </Box>
      {!!error && (
        <Typography variant="caption" color="error" sx={{ ml: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
