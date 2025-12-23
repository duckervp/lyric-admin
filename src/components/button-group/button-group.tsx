import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

type DButtonGroupProps = {
  value: string;
  label: string;
  name: string;
  items: any[];
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function DButtonGroup({ value, label, name, items, handleInputChange }: DButtonGroupProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
      >
        {label}
      </Typography>
      <ButtonGroup fullWidth variant="outlined">
        {items.map((item) => (
          <Button
            onClick={() => {
              if (handleInputChange) {
                handleInputChange({
                  target: {
                    type: 'custom',
                    name,
                    value: item ? item.value + '' : '',
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            variant={value === item.value ? 'contained' : 'outlined'}
            color='inherit'
          >
            {item.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
}
